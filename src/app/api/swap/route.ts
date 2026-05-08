import { NextResponse } from 'next/server';
import { generateWithFallback, cleanJson } from '@/lib/gemini';
import { sanitizeText, validateDestination } from '@/utils/sanitize';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { validateSwapActivity } from '@/lib/validate';

interface SwapRequest {
  destination: string;
  activity: { place: string; description: string };
  timeOfDay: string;
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
    const body = (await req.json()) as SwapRequest;

    const dest = validateDestination(body.destination);
    if (!dest.ok) {
      return NextResponse.json({ error: dest.error }, { status: 400 });
    }
    const timeOfDay = sanitizeText(body.timeOfDay, 50);
    const place = sanitizeText(body.activity?.place, 200);
    const description = sanitizeText(body.activity?.description, 1000);
    if (!timeOfDay || !place || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `You are a travel planning expert.
The user is planning a trip to ${dest.value}.
They want to swap out the following ${timeOfDay} activity:
"${place}: ${description}"

Please provide ONE alternative activity for ${timeOfDay} in ${dest.value} that is different from the original one.
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

    const rawText = await generateWithFallback(prompt);
    const cleanText = cleanJson(rawText);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanText);
    } catch {
      console.error('Failed to parse Gemini response for swap');
      return NextResponse.json(
        { error: 'Failed to generate valid swap activity data' },
        { status: 500 },
      );
    }

    const validated = validateSwapActivity(parsed);
    if (!validated.ok || !validated.data) {
      console.error('Swap response failed schema validation:', validated.error);
      return NextResponse.json(
        { error: 'Failed to generate valid swap activity data' },
        { status: 500 },
      );
    }

    return NextResponse.json(validated.data);
  } catch (error) {
    console.error('Error swapping activity:', error);
    return NextResponse.json(
      { error: 'Failed to swap activity. Please try again later.' },
      { status: 500 },
    );
  }
}
