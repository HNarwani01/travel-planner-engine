import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface LuckyRequest {
  budget: string;
  travelingWith: string;
  vibe: string;
  duration: string;
  locationPref: string;
}

export async function POST(req: Request) {
  try {
    const body: LuckyRequest = await req.json();
    const { budget, travelingWith, vibe, duration, locationPref } = body;

    if (!budget || !travelingWith || !vibe || !duration || !locationPref) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are Wandr, a magical travel AI.
Based on these preferences, pick ONE perfect surprise destination and create a trip plan.

Budget: ${budget}
Traveling with: ${travelingWith}
Vibe: ${vibe}
Duration: ${duration}
Location preference: ${locationPref}

Return ONLY valid JSON in exactly this format — no markdown, no extra text:
{
  "destination": "City, Country",
  "country": "Country",
  "countryEmoji": "🇮🇩",
  "tagline": "one line why this destination is magical",
  "matchScore": 95,
  "estimatedBudget": "amount range",
  "bestTimeToVisit": "months",
  "whyThisMatches": "paragraph explaining why this destination perfectly matches their preferences",
  "highlights": ["highlight1", "highlight2", "highlight3"],
  "days": [{
    "day": 1,
    "date": "Day 1",
    "activities": [{
      "time": "Morning",
      "place": "place name",
      "description": "what to do there",
      "estimatedCost": "cost in local currency",
      "duration": "2 hours",
      "coordinates": { "lat": 0.0, "lng": 0.0 }
    }]
  }],
  "budgetBreakdown": {
    "accommodation": "",
    "food": "",
    "activities": "",
    "transport": "",
    "total": ""
  }
}
Ensure coordinates are accurate for real places. Return ONLY the JSON object.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json\n?|\n?```/g, '').trim();

    let data;
    try {
      data = JSON.parse(clean);
    } catch {
      console.error('Failed to parse Gemini lucky response:', text);
      return NextResponse.json({ error: 'Failed to generate lucky destination' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: `Internal server error ` }, { status: 500 });
  }
}
