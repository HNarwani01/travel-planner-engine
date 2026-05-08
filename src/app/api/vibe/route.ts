import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface VibeRequest {
  travelingWith: string;
  budget       : string;
  duration     : string;
  mood         : string;
  weather      : string;
  destinationType: string;
  travelStyle  : string;
  passport     : string;
}

export async function POST(req: Request) {
  try {
    const body: VibeRequest = await req.json();

    const { travelingWith, budget, duration, mood, weather, destinationType, travelStyle, passport } = body;

    if (!travelingWith || !budget || !duration || !mood || !weather || !destinationType || !travelStyle || !passport) {
      return NextResponse.json({ error: 'Missing required vibe fields' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a travel expert. Based on these preferences, suggest the perfect trip:
Traveling with: ${travelingWith}
Budget: ${budget}
Duration: ${duration}
Mood: ${mood}
Weather preference: ${weather}
Destination type: ${destinationType}
Travel style: ${travelStyle}
Passport: ${passport}

Generate a personalized itinerary. Include WHY each place was chosen based on their specific preferences.
Return ONLY valid JSON in this format:
{
  "days": [{
    "day": 1,
    "date": "Day 1",
    "activities": [{
      "time": "Morning",
      "place": "place name",
      "description": "what to do and why it matches their preferences",
      "estimatedCost": "cost in local currency",
      "duration": "2 hours",
      "coordinates": { "lat": 0, "lng": 0 }
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
Please ensure the coordinates are roughly correct for the given places. Return ONLY JSON and no extra markdown or text.`;

    const result = await model.generateContent(prompt);
    const text   = result.response.text();
    const clean  = text.replace(/```json\n?|\n?```/g, '').trim();

    let tripData;
    try {
      tripData = JSON.parse(clean);
    } catch {
      console.error('Failed to parse Gemini vibe response:', text);
      return NextResponse.json({ error: 'Failed to generate valid itinerary data' }, { status: 500 });
    }

    return NextResponse.json(tripData);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
