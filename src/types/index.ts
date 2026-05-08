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

export interface DayItinerary {
  day: number;
  date: string;
  activities: Activity[];
}

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
