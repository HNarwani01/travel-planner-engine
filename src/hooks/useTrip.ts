import { useState } from 'react';
import { TripPlan, TripRequest, Activity } from '../types';
import { generateTripPlan, swapTripActivity } from '../services/gemini.service';
import { trackEvent } from '../services/analytics';

export const useTrip = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [swappingActivity, setSwappingActivity] = useState<{ day: number; time: string } | null>(null);

  const planTrip = async (formData: TripRequest, isRegenerate = false) => {
    if (!formData.destination.trim()) {
      setError('Please enter a destination.');
      return false;
    }

    if (formData.duration < 1 || formData.duration > 14) {
      setError('Trip duration must be between 1 and 14 days.');
      return false;
    }

    setLoading(true);
    setError(null);
    if (!isRegenerate) {
      setTripPlan(null);
    }

    try {
      const data = await generateTripPlan(formData);
      setTripPlan(data);
      trackEvent('trip_generated', {
        destination: formData.destination,
        duration: formData.duration,
        budget: formData.budget,
      });
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const swapActivity = async (
    destination: string,
    dayIndex: number,
    dayNumber: number,
    activity: Activity,
  ) => {
    setSwappingActivity({ day: dayNumber, time: activity.time });
    setError(null);

    try {
      const data = await swapTripActivity(destination, activity, activity.time);

      setTripPlan((prev) => {
        if (!prev) return prev;
        const newDays = prev.days.map((day, i) => {
          if (i !== dayIndex) return day;
          const newActivities = day.activities.map((a) =>
            a.time === activity.time ? data : a,
          );
          return { ...day, activities: newActivities };
        });
        return { ...prev, days: newDays };
      });

      trackEvent('activity_swapped', { destination, day: dayNumber, time: activity.time });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to swap activity. Try again.';
      setError(message);
      return false;
    } finally {
      setSwappingActivity(null);
    }
  };

  return {
    tripPlan,
    setTripPlan,
    loading,
    error,
    swappingActivity,
    planTrip,
    swapActivity,
  };
};
