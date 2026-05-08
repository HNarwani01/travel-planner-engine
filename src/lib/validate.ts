/**
 * Server-side validators for Gemini responses.
 *
 * Gemini returns JSON shaped per the prompt, but we cannot trust it: we must
 * confirm required fields exist and the values are the correct type before
 * forwarding to the client. Strings are also re-sanitised (HTML stripped) so
 * that a prompt-injected response can't ship raw markup to the browser.
 */

import { sanitizeText } from '@/utils/sanitize';
import type {
  Activity,
  BudgetBreakdown,
  DayItinerary,
  LuckyResult,
  TripPlan,
} from '@/types';

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const cleanString = (v: unknown, max = 500): string =>
  typeof v === 'string' ? sanitizeText(v, max) : '';

const cleanCoords = (v: unknown): { lat: number; lng: number } => {
  if (!isObj(v)) return { lat: 0, lng: 0 };
  const lat = typeof v.lat === 'number' && Number.isFinite(v.lat) ? v.lat : 0;
  const lng = typeof v.lng === 'number' && Number.isFinite(v.lng) ? v.lng : 0;
  return { lat, lng };
};

export const sanitizeActivity = (raw: unknown): Activity | null => {
  if (!isObj(raw)) return null;
  const place = cleanString(raw.place, 200);
  const description = cleanString(raw.description, 1000);
  if (!place || !description) return null;
  return {
    time: cleanString(raw.time, 50),
    place,
    description,
    estimatedCost: cleanString(raw.estimatedCost, 100),
    duration: cleanString(raw.duration, 50),
    coordinates: cleanCoords(raw.coordinates),
  };
};

export const sanitizeDay = (raw: unknown): DayItinerary | null => {
  if (!isObj(raw)) return null;
  const day = typeof raw.day === 'number' ? raw.day : Number(raw.day);
  if (!Number.isFinite(day)) return null;
  const activitiesRaw = Array.isArray(raw.activities) ? raw.activities : [];
  const activities = activitiesRaw
    .map(sanitizeActivity)
    .filter((a): a is Activity => a !== null);
  if (activities.length === 0) return null;
  return {
    day,
    date: cleanString(raw.date, 100),
    activities,
  };
};

export const sanitizeBudget = (raw: unknown): BudgetBreakdown => {
  const src = isObj(raw) ? raw : {};
  return {
    accommodation: cleanString(src.accommodation, 100),
    food: cleanString(src.food, 100),
    activities: cleanString(src.activities, 100),
    transport: cleanString(src.transport, 100),
    total: cleanString(src.total, 100),
  };
};

export interface ValidatedResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export const validateTripPlan = (raw: unknown): ValidatedResponse<TripPlan> => {
  if (!isObj(raw)) return { ok: false, error: 'Response is not an object' };
  const daysRaw = Array.isArray(raw.days) ? raw.days : null;
  if (!daysRaw) return { ok: false, error: 'Missing days array' };
  const days = daysRaw.map(sanitizeDay).filter((d): d is DayItinerary => d !== null);
  if (days.length === 0) return { ok: false, error: 'No valid days in itinerary' };
  return {
    ok: true,
    data: {
      days,
      budgetBreakdown: sanitizeBudget(raw.budgetBreakdown),
    },
  };
};

export const validateLuckyResult = (raw: unknown): ValidatedResponse<LuckyResult> => {
  if (!isObj(raw)) return { ok: false, error: 'Response is not an object' };
  const destination = cleanString(raw.destination, 200);
  if (!destination) return { ok: false, error: 'Missing destination' };
  const tripCheck = validateTripPlan(raw);
  if (!tripCheck.ok || !tripCheck.data) return { ok: false, error: tripCheck.error };
  const matchScore = typeof raw.matchScore === 'number' ? raw.matchScore : 0;
  const highlightsRaw = Array.isArray(raw.highlights) ? raw.highlights : [];
  return {
    ok: true,
    data: {
      destination,
      country: cleanString(raw.country, 100),
      countryEmoji: cleanString(raw.countryEmoji, 10),
      tagline: cleanString(raw.tagline, 300),
      matchScore: Math.max(0, Math.min(100, matchScore)),
      estimatedBudget: cleanString(raw.estimatedBudget, 100),
      bestTimeToVisit: cleanString(raw.bestTimeToVisit, 100),
      whyThisMatches: cleanString(raw.whyThisMatches, 1000),
      highlights: highlightsRaw.map((h) => cleanString(h, 200)).filter(Boolean),
      days: tripCheck.data.days,
      budgetBreakdown: tripCheck.data.budgetBreakdown,
    },
  };
};

export const validateSwapActivity = (raw: unknown): ValidatedResponse<Activity> => {
  const activity = sanitizeActivity(raw);
  if (!activity) return { ok: false, error: 'Invalid swap activity' };
  return { ok: true, data: activity };
};
