'use server';

/** A single result from the Google Geocoding API. */
export interface GeocodeResult {
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
    location_type: string;
  };
  place_id: string;
}

interface GeocodeApiResponse {
  status: string;
  results: GeocodeResult[];
}

/**
 * Geocodes a human-readable place name and returns its lat/lng coordinates.
 * Calls the Google Geocoding API server-side so the API key is never exposed
 * in client network requests.
 *
 * @param place - Address or place name to geocode (e.g. "Kyoto, Japan")
 * @returns Lat/lng object or null if geocoding failed
 */
export async function getCoordinates(
  place: string,
): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${apiKey}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      console.error(`[Geocoding] HTTP ${response.status} for place: ${place}`);
      return null;
    }

    const data: GeocodeApiResponse = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].geometry.location;
    }

    // ZERO_RESULTS is normal — not an error worth logging
    if (data.status !== 'ZERO_RESULTS') {
      console.error(`[Geocoding] API returned status ${data.status} for: ${place}`);
    }

    return null;
  } catch (error) {
    console.error('[Geocoding] Request failed for place:', place, error);
    return null;
  }
}
