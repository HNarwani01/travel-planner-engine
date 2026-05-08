'use server';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

/** A result entry returned by the Places Text Search API. */
export interface PlaceSearchResult {
  name: string;
  formatted_address: string;
  place_id: string;
  rating?: number;
  user_ratings_total?: number;
  geometry: { location: { lat: number; lng: number } };
  photos?: Array<{ photo_reference: string; width: number; height: number }>;
  types?: string[];
}

interface PlaceTextSearchResponse {
  status: string;
  results: PlaceSearchResult[];
}

interface FindPlaceResponse {
  status: string;
  candidates: Array<{ photos?: Array<{ photo_reference: string }> }>;
}

/**
 * Geocodes a place name via the Google Geocoding API.
 * Kept for backwards compatibility — prefer geocoding.service.ts for new code.
 *
 * @param placeName - Human-readable place name or address
 * @returns Lat/lng or null on failure
 */
export const getCoordinatesForPlace = async (
  placeName: string,
): Promise<{ lat: number; lng: number } | null> => {
  if (!API_KEY) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${API_KEY}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    const data: { status: string; results: Array<{ geometry: { location: { lat: number; lng: number } } }> } =
      await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].geometry.location;
    }
  } catch (error) {
    console.error('[Places] Geocoding failed for place:', placeName, error);
  }
  return null;
};

/**
 * Searches for a destination photo using the Places Find Place API.
 * Returns a direct photo URL string, or null if none is found.
 *
 * @param destinationName - e.g. "Kyoto, Japan"
 */
export const getPhotoForDestination = async (
  destinationName: string,
): Promise<string | null> => {
  if (!API_KEY) return null;

  try {
    const searchUrl =
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
      `?input=${encodeURIComponent(destinationName)}&inputtype=textquery&fields=photos&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl, { next: { revalidate: 3600 } });
    const searchData: FindPlaceResponse = await searchRes.json();

    if (
      searchData.status === 'OK' &&
      searchData.candidates.length > 0
    ) {
      const photoRef = searchData.candidates[0].photos?.[0]?.photo_reference;
      if (photoRef) {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photoRef}&key=${API_KEY}`;
      }
    }
  } catch (error) {
    console.error('[Places] Photo fetch failed for destination:', destinationName, error);
  }
  return null;
};

/**
 * Fetches rich place data (address, rating, photos, geometry) from the
 * Google Places Text Search API.
 *
 * @param destination - Search query, e.g. "Kyoto, Japan"
 * @returns The top PlaceSearchResult or null on failure
 */
export const getPlaceDetails = async (
  destination: string,
): Promise<PlaceSearchResult | null> => {
  if (!API_KEY) return null;

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/textsearch/json` +
      `?query=${encodeURIComponent(destination)}&key=${API_KEY}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      console.error(`[Places] Text Search HTTP ${response.status} for: ${destination}`);
      return null;
    }

    const data: PlaceTextSearchResponse = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0];
    }

    if (data.status !== 'ZERO_RESULTS') {
      console.error(`[Places] Text Search API status ${data.status} for: ${destination}`);
    }

    return null;
  } catch (error) {
    console.error('[Places] Text Search failed for destination:', destination, error);
    return null;
  }
};
