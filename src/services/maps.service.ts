import { DayItinerary } from '../types';

export const calculateMapBounds = (days: DayItinerary[], map: google.maps.Map | null) => {
  if (!map || !window.google) return;
  
  const bounds = new window.google.maps.LatLngBounds();
  let hasValidCoordinates = false;
  
  days.forEach(day => {
    day.activities.forEach(activity => {
      if (activity.coordinates && activity.coordinates.lat !== 0) {
        bounds.extend(activity.coordinates);
        hasValidCoordinates = true;
      }
    });
  });

  if (hasValidCoordinates) {
    map.fitBounds(bounds);
  }
};
