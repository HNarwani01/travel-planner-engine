import { DayItinerary } from '../types';

/**
 * Fits a Google Map's viewport to show all activity markers for the given days.
 * No-ops gracefully when the map is not yet initialised or no valid coordinates exist.
 *
 * @param days - Itinerary days whose activity coordinates will be included
 * @param map  - Loaded google.maps.Map instance (or null if not yet mounted)
 */
export const calculateMapBounds = (days: DayItinerary[], map: google.maps.Map | null): void => {
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
