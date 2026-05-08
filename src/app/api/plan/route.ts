import { NextResponse } from 'next/server';
import { TripRequest } from '@/types';
import { generateWithFallback, cleanJson } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body: TripRequest = await req.json();
    const { destination, duration, budget, interests, constraints } = body;

    // Validate inputs
    if (!destination || !duration || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const interestsStr = interests.length > 0 ? interests.join(', ') : 'None';
    const constraintsStr = constraints.length > 0 ? constraints.join(', ') : 'None';

    const prompt = `You are a travel planning expert. Create a detailed 
${duration} day itinerary for ${destination}. 
Budget level: ${budget}. 
Interests: ${interestsStr}. 
Constraints: ${constraintsStr}.
Return ONLY valid JSON in this format:
{
  "days": [{
    "day": 1,
    "date": "Day 1",
    "activities": [{
      "time": "Morning",
      "place": "place name",
      "description": "what to do",
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

    const rawText  = await generateWithFallback(prompt);
    const cleanText = cleanJson(rawText);

    let tripData;
    try {
      tripData = JSON.parse(cleanText);
    } catch {
      console.error('Failed to parse Gemini response:', rawText);
      return NextResponse.json(
        { error: 'Failed to generate valid itinerary data' },
        { status: 500 }
      );
    }

    return NextResponse.json(tripData);

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error planning trip:', msg);
    return NextResponse.json(
      { error: 'Failed to plan trip. Please try again later.' },
      { status: 500 }
    );
  }
}
