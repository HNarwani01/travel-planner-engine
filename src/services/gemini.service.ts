import { TripRequest, Activity, TripPlan } from '../types';

interface ApiErrorResponse {
  error: string;
}

function isApiError(obj: unknown): obj is ApiErrorResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'error' in obj &&
    typeof (obj as ApiErrorResponse).error === 'string'
  );
}

/**
 * Generates a full trip plan by calling the /api/plan route.
 * Coordinate enrichment is performed server-side in the API route.
 *
 * @param data - Trip request parameters
 * @returns Validated TripPlan with real coordinates
 */
export const generateTripPlan = async (data: TripRequest): Promise<TripPlan> => {
  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result: TripPlan | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(isApiError(result) ? result.error : 'Failed to generate trip plan');
  }

  return result as TripPlan;
};

/**
 * Swaps a single activity by calling the /api/swap route.
 * Returns the replacement activity with real coordinates.
 *
 * @param destination - Trip destination name
 * @param activity    - The activity to replace
 * @param timeOfDay   - Time slot of the activity (e.g. "Morning")
 */
export const swapTripActivity = async (
  destination: string,
  activity: Activity,
  timeOfDay: string,
): Promise<Activity> => {
  const response = await fetch('/api/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, activity, timeOfDay }),
  });

  const result: Activity | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw new Error(isApiError(result) ? result.error : 'Failed to swap activity');
  }

  return result as Activity;
};
