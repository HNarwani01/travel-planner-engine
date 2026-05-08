import { TripRequest, Activity, TripPlan } from '../types';

export const generateTripPlan = async (data: TripRequest): Promise<TripPlan> => {
  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to generate trip plan');
  }

  return result;
};

export const swapTripActivity = async (destination: string, activity: Activity, timeOfDay: string): Promise<Activity> => {
  const response = await fetch('/api/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, activity, timeOfDay }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to swap activity');
  }

  return result;
};
