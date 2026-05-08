import { NextResponse } from 'next/server';
import { generateWithFallback, cleanJson } from '@/lib/gemini';

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

    const rawText = await generateWithFallback(prompt);
    const clean   = cleanJson(rawText);

    let tripData;
    try {
      tripData = JSON.parse(clean);
    } catch {
      console.error('Failed to parse Gemini vibe response:', rawText);
      return NextResponse.json({ error: 'Failed to generate valid itinerary data' }, { status: 500 });
    }

    return NextResponse.json(tripData);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error in vibe route:', msg);
    return NextResponse.json({ error: 'Failed to generate trip. Please try again.' }, { status: 500 });
  }
}
