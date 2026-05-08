/**
 * Google Tag Manager / Analytics utilities.
 *
 * Push custom events to the GTM dataLayer. All functions are no-ops in
 * server-side or non-GTM environments, so they are safe to call anywhere.
 */

// Augment the Window interface so TypeScript knows about dataLayer.
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/** All trackable event names in the app. */
export type AnalyticsEvent =
  | 'mode_selected'
  | 'trip_generated'
  | 'activity_swapped'
  | 'feeling_lucky_spin';

/**
 * Push a custom event to the GTM dataLayer.
 * Safe to call from any client component — no-ops on the server.
 *
 * @param event  - Event name from the AnalyticsEvent union
 * @param params - Optional extra data to include in the dataLayer push
 */
export function trackEvent(
  event: AnalyticsEvent,
  params?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
