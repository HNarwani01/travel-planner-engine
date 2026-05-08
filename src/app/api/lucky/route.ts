import { NextResponse } from 'next/server';
import { generateWithFallback, cleanJson } from '@/lib/gemini';
import { sanitizeText } from '@/utils/sanitize';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { validateLuckyResult } from '@/lib/validate';

export interface LuckyRequest {
  budget: string;
  travelingWith: string;
  vibe: string;
  duration: string;
  locationPref: string;
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
    const body: LuckyRequest = await req.json();
    const fields = {
      budget: sanitizeText(body.budget, 100),
      travelingWith: sanitizeText(body.travelingWith, 100),
      vibe: sanitizeText(body.vibe, 200),
      duration: sanitizeText(body.duration, 100),
      locationPref: sanitizeText(body.locationPref, 100),
    };

    if (Object.values(fields).some((v) => !v)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `You are Wandr, a magical travel AI.
Based on these preferences, pick ONE perfect surprise destination and create a trip plan.

Budget: ${fields.budget}
Traveling with: ${fields.travelingWith}
Vibe: ${fields.vibe}
Duration: ${fields.duration}
Location preference: ${fields.locationPref}

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

    const rawText = await generateWithFallback(prompt);
    const clean = cleanJson(rawText);

    let parsed: unknown;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.error('Failed to parse Gemini lucky response');
      return NextResponse.json({ error: 'Failed to generate lucky destination' }, { status: 500 });
    }

    const validated = validateLuckyResult(parsed);
    if (!validated.ok || !validated.data) {
      console.error('Lucky response failed schema validation:', validated.error);
      return NextResponse.json(
        { error: 'Failed to generate lucky destination' },
        { status: 500 },
      );
    }

    return NextResponse.json(validated.data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error in lucky route:', msg);
    return NextResponse.json({ error: 'Failed to generate lucky trip. Please try again.' }, { status: 500 });
  }
}
