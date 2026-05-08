import { NextResponse } from 'next/server';
import { generateWithFallback, cleanJson } from '@/lib/gemini';
import { sanitizeText } from '@/utils/sanitize';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { validateTripPlan } from '@/lib/validate';

interface VibeRequest {
  travelingWith: string;
  budget       : string;
  duration     : string;
  mood         : string;
  weather      : string;
  destinationType: string;
  travelStyle  : string;
  passport     : string;
  specificDestination?: string;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfterSec),
          'X-RateLimit-Limit': String(limit.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(limit.resetAt),
        },
      },
    );
  }

  try {
    const body: VibeRequest = await req.json();

    const fields = {
      travelingWith  : sanitizeText(body.travelingWith, 100),
      budget         : sanitizeText(body.budget, 100),
      duration       : sanitizeText(body.duration, 100),
      mood           : sanitizeText(body.mood, 100),
      weather        : sanitizeText(body.weather, 100),
      destinationType: sanitizeText(body.destinationType, 100),
      travelStyle    : sanitizeText(body.travelStyle, 100),
      passport       : sanitizeText(body.passport, 100),
    };
    const specificDestination = sanitizeText(body.specificDestination, 100);

    if (Object.values(fields).some((v) => !v)) {
      return NextResponse.json({ error: 'Missing required vibe fields' }, { status: 400 });
    }

    const prompt = `You are a travel expert. Based on these preferences, suggest the perfect trip:
Traveling with: ${fields.travelingWith}
Budget: ${fields.budget}
Duration: ${fields.duration}
Mood: ${fields.mood}
Weather preference: ${fields.weather}
Destination type: ${fields.destinationType}
Travel style: ${fields.travelStyle}
Passport: ${fields.passport}
Specific Destination Preference: ${specificDestination || 'None (Surprise me!)'}

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

    let parsed: unknown;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.error('Failed to parse Gemini vibe response');
      return NextResponse.json({ error: 'Failed to generate valid itinerary data' }, { status: 500 });
    }

    const validated = validateTripPlan(parsed);
    if (!validated.ok || !validated.data) {
      console.error('Vibe response failed schema validation:', validated.error);
      return NextResponse.json(
        { error: 'Failed to generate valid itinerary data' },
        { status: 500 },
      );
    }

    return NextResponse.json(validated.data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error in vibe route:', msg);
    return NextResponse.json({ error: 'Failed to generate trip. Please try again.' }, { status: 500 });
  }
}
