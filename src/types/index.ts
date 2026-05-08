export interface Activity {
  time: string;
  place: string;
  description: string;
  estimatedCost: string;
  duration: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

/** A single calendar day within an itinerary. */
export interface DayItinerary {
  day: number;
  date: string;
  activities: Activity[];
}

/** Alias for DayItinerary for semantic clarity. */
export type Day = DayItinerary;

export interface BudgetBreakdown {
  accommodation: string;
  food: string;
  activities: string;
  transport: string;
  total: string;
}

export interface TripPlan {
  days: DayItinerary[];
  budgetBreakdown: BudgetBreakdown;
}

export interface TripRequest {
  destination: string;
  duration: number;
  budget: string;
  interests: string[];
  constraints: string[];
}

/** User preferences for planning a trip — shape mirrors TripRequest. */
export type TripPreferences = TripRequest;

/** Answers collected from the Vibe Check quiz. */
export interface VibeCheckAnswers {
  travelingWith: string;
  budget: string;
  duration: string;
  mood: string;
  weather: string;
  destinationType: string;
  travelStyle: string;
  passport: string;
  specificDestination?: string;
}

/** Input payload for the "Feeling Lucky" random-destination feature. */
export interface LuckyTripInput {
  budget: string;
  travelingWith: string;
  vibe: string;
  duration: string;
  locationPref: string;
}

/**
 * Raw JSON response shape expected from Gemini for any trip-generation prompt.
 * Fields are validated and sanitised via lib/validate.ts before use.
 */
export interface GeminiTripResponse {
  days: unknown[];
  budgetBreakdown: unknown;
}

export interface LuckyResult {
  destination    : string;
  country        : string;
  countryEmoji   : string;
  tagline        : string;
  matchScore     : number;
  estimatedBudget: string;
  bestTimeToVisit: string;
  whyThisMatches : string;
  highlights     : string[];
  days           : DayItinerary[];
  budgetBreakdown: BudgetBreakdown;
}
