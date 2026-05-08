import { NextResponse } from 'next/server';
import { TripRequest } from '@/types';
import { generateWithFallback, cleanJson } from '@/lib/gemini';
import { sanitizeText, validateDestination, validateBudget } from '@/utils/sanitize';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { validateTripPlan } from '@/lib/validate';
import { getCoordinates } from '@/services/geocoding.service';

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
    const body: TripRequest = await req.json();
    const { destination, duration, budget, interests, constraints } = body;

    const dest = validateDestination(destination);
    if (!dest.ok) {
      return NextResponse.json({ error: dest.error }, { status: 400 });
    }
    const bud = validateBudget(budget);
    if (!bud.ok) {
      return NextResponse.json({ error: bud.error }, { status: 400 });
    }
    const days = Number(duration);
    if (!Number.isInteger(days) || days < 1 || days > 30) {
      return NextResponse.json(
        { error: 'Duration must be an integer between 1 and 30' },
        { status: 400 },
      );
    }

    const cleanInterests = (Array.isArray(interests) ? interests : [])
      .map((i) => sanitizeText(i, 50))
      .filter(Boolean);
    const cleanConstraints = (Array.isArray(constraints) ? constraints : [])
      .map((c) => sanitizeText(c, 50))
      .filter(Boolean);

    const interestsStr = cleanInterests.length > 0 ? cleanInterests.join(', ') : 'None';
    const constraintsStr = cleanConstraints.length > 0 ? cleanConstraints.join(', ') : 'None';

    const prompt = `You are a travel planning expert. Create a detailed
${days} day itinerary for ${dest.value}.
Budget level: ${bud.value}.
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

    const rawText = await generateWithFallback(prompt);
    const cleanText = cleanJson(rawText);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanText);
    } catch {
      console.error('Failed to parse Gemini response');
      return NextResponse.json(
        { error: 'Failed to generate valid itinerary data' },
        { status: 500 },
      );
    }

    const validated = validateTripPlan(parsed);
    if (!validated.ok || !validated.data) {
      console.error('Gemini response failed schema validation:', validated.error);
      return NextResponse.json(
        { error: 'Failed to generate valid itinerary data' },
        { status: 500 },
      );
    }

    // Enrich each activity with real coordinates from the Geocoding API.
    // Gemini's coordinates are approximations; the Geocoding API provides
    // precise lat/lng for the exact place name.
    const enriched = validated.data;
    await Promise.all(
      enriched.days.flatMap((day) =>
        day.activities.map(async (activity) => {
          if (!activity.place) return;
          const coords = await getCoordinates(`${activity.place}, ${dest.value}`);
          if (coords) {
            activity.coordinates = coords;
          }
        }),
      ),
    );

    return NextResponse.json(enriched);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error planning trip:', msg);
    return NextResponse.json(
      { error: 'Failed to plan trip. Please try again later.' },
      { status: 500 },
    );
  }
}
