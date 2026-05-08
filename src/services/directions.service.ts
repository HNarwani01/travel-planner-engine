'use server';

/** A single step returned by the Google Directions API. */
export interface DirectionsStep {
  html_instructions: string;
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  travel_mode: string;
}

/** A single leg (origin → destination segment) in a Directions response. */
export interface DirectionsLeg {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  start_address: string;
  end_address: string;
  steps: DirectionsStep[];
}

/** Successful Directions API route. */
export interface DirectionsRoute {
  summary: string;
  legs: DirectionsLeg[];
  /** Encoded overview polyline for the full route. */
  overview_polyline: { points: string };
}

/** Return type for getDirections — null when no route is found. */
export interface DirectionsResult {
  status: string;
  routes: DirectionsRoute[];
}

/**
 * Fetches driving/walking directions between an ordered list of places using
 * the Google Directions API. The first place is the origin, the last is the
 * destination, and any places in between are treated as waypoints.
 *
 * Called server-side so the API key stays out of client bundles.
 *
 * @param places - Ordered array of place names or "lat,lng" strings
 * @param mode   - Travel mode: DRIVING | WALKING | BICYCLING | TRANSIT
 * @returns DirectionsResult or null on failure
 */
export async function getDirections(
  places: string[],
  mode: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT' = 'WALKING',
): Promise<DirectionsResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || places.length < 2) return null;

  const origin = encodeURIComponent(places[0]);
  const destination = encodeURIComponent(places[places.length - 1]);
  const waypoints =
    places.length > 2
      ? `&waypoints=${places
          .slice(1, -1)
          .map(encodeURIComponent)
          .join('|')}`
      : '';

  const url =
    `https://maps.googleapis.com/maps/api/directions/json` +
    `?origin=${origin}&destination=${destination}${waypoints}` +
    `&mode=${mode.toLowerCase()}&key=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      console.error(`[Directions] HTTP ${response.status}`);
      return null;
    }

    const data: DirectionsResult = await response.json();

    if (data.status !== 'OK') {
      console.error(`[Directions] API status: ${data.status}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error('[Directions] Request failed:', error);
    return null;
  }
}
