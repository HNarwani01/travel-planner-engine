import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, activity, timeOfDay } = body;

    if (!destination || !activity || !timeOfDay) {
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

    const prompt = `You are a travel planning expert.
The user is planning a trip to ${destination}.
They want to swap out the following ${timeOfDay} activity: 
"${activity.place}: ${activity.description}"

Please provide ONE alternative activity for ${timeOfDay} in ${destination} that is different from the original one.
Return ONLY valid JSON in this exact format, with no other text or markdown:
{
  "time": "${timeOfDay}",
  "place": "place name",
  "description": "what to do",
  "estimatedCost": "cost in local currency",
  "duration": "estimated duration (e.g., 2 hours)",
  "coordinates": { "lat": 0, "lng": 0 }
}
Please ensure coordinates are roughly accurate.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();

    let newActivity;
    try {
      newActivity = JSON.parse(cleanText);
    } catch (e) {
      console.error('Failed to parse Gemini response for swap:', text);
      return NextResponse.json(
        { error: 'Failed to generate valid swap activity data' },
        { status: 500 }
      );
    }

    return NextResponse.json(newActivity);

  } catch (error) {
    console.error('Error swapping activity:', error);
    return NextResponse.json(
      { error: 'Failed to swap activity. Please try again later.' },
      { status: 500 }
    );
  }
}
