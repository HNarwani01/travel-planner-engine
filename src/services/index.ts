/**
 * Barrel export for all services.
 *
 * Import from here to avoid deep relative imports:
 *   import { generateTripPlan, trackEvent } from '@/services';
 *
 * NOTE: geocoding, directions, and places services are marked 'use server' and
 * can be called as server actions from client components (Next.js RPC).
 */

export * from './analytics';
export * from './directions.service';
export * from './geocoding.service';
export * from './gemini.service';
export * from './maps.service';
export * from './places.service';
