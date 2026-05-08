import { TripRequest, Activity, TripPlan } from '../types';
import { getCoordinatesForPlace } from './places.service';

export const generateTripPlan = async (data: TripRequest): Promise<TripPlan> => {
  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result: TripPlan = await response.json();
  if (!response.ok) {
    throw new Error((result as any).error || 'Failed to generate trip plan');
  }

  // Replace approximate coordinates with exact coordinates via Geocoding API
  for (const day of result.days) {
    for (const activity of day.activities) {
      if (activity.place) {
        const coords = await getCoordinatesForPlace(`${activity.place}, ${data.destination}`);
        if (coords) {
          activity.coordinates = coords;
        }
      }
    }
  }

  return result;
};

export const swapTripActivity = async (destination: string, activity: Activity, timeOfDay: string): Promise<Activity> => {
  const response = await fetch('/api/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, activity, timeOfDay }),
  });

  const result: Activity = await response.json();
  if (!response.ok) {
    throw new Error((result as any).error || 'Failed to swap activity');
  }

  if (result.place) {
    const coords = await getCoordinatesForPlace(`${result.place}, ${destination}`);
    if (coords) {
      result.coordinates = coords;
    }
  }

  return result;
};
