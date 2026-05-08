'use server';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export const getCoordinatesForPlace = async (placeName: string): Promise<{ lat: number; lng: number } | null> => {
  if (!API_KEY) return null;
  
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${API_KEY}`);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results[0].geometry.location;
    }
  } catch (error) {
    console.error('Error fetching geocoding for place:', placeName, error);
  }
  return null;
};

export const getPhotoForDestination = async (destinationName: string): Promise<string | null> => {
  if (!API_KEY) return null;
  
  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(destinationName)}&inputtype=textquery&fields=photos&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (searchData.status === 'OK' && searchData.candidates && searchData.candidates.length > 0) {
      const candidate = searchData.candidates[0];
      if (candidate.photos && candidate.photos.length > 0) {
        const photoRef = candidate.photos[0].photo_reference;
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photoRef}&key=${API_KEY}`;
      }
    }
  } catch (error) {
    console.error('Error fetching photo for destination:', destinationName, error);
  }
  return null;
};
