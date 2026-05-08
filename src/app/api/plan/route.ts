import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TripRequest } from '@/types';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse the generated text
    // Remove markdown code blocks if the model wrapped it
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();

    let tripData;
    try {
      tripData = JSON.parse(cleanText);
    } catch (e) {
      console.error('Failed to parse Gemini response:', text);
      return NextResponse.json(
        { error: 'Failed to generate valid itinerary data' },
        { status: 500 }
      );
    }

    return NextResponse.json(tripData);

  } catch (error) {
    console.error('Error planning trip:', error);
    return NextResponse.json(
      { error: `Failed to plan trip. Please try again later. ${error}` },
      { status: 500 }
    );
  }
}
