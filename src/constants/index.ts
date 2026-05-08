export const INTERESTS = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature'];
export const CONSTRAINTS = ['Vegetarian', 'Family-friendly', 'Wheelchair accessible'];
export const BUDGETS = ['Budget', 'Mid-range', 'Luxury'];

export const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522,
};

/**
 * Shared library list for all useJsApiLoader calls.
 * All components must use the same ID ('google-map-script') and this
 * library list so the Maps JS bundle is only loaded once.
 */
export const GOOGLE_MAPS_LIBRARIES: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places'];
