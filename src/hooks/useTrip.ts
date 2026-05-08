import { useState } from 'react';
import { TripPlan, TripRequest, Activity } from '../types';
import { generateTripPlan, swapTripActivity } from '../services/gemini.service';

export const useTrip = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [swappingActivity, setSwappingActivity] = useState<{day: number, time: string} | null>(null);

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
      return data;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const swapActivity = async (destination: string, dayIndex: number, dayNumber: number, activity: Activity) => {
    setSwappingActivity({ day: dayNumber, time: activity.time });
    setError(null);

    try {
      const data = await swapTripActivity(destination, activity, activity.time);

      setTripPlan(prev => {
        if (!prev) return prev;
        const newPlan = { ...prev };
        const newDays = [...newPlan.days];
        const newActivities = [...newDays[dayIndex].activities];
        
        const actIndex = newActivities.findIndex(a => a.time === activity.time);
        if (actIndex !== -1) {
          newActivities[actIndex] = data;
        }
        
        newDays[dayIndex] = { ...newDays[dayIndex], activities: newActivities };
        return { ...newPlan, days: newDays };
      });
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to swap activity. Try again.');
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
    swapActivity
  };
};
