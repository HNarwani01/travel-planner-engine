import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { DayItinerary, Activity } from '../../types';
import ActivityItem from './ActivityItem';

interface ItineraryCardProps {
  day: DayItinerary;
  swappingActivity: { day: number; time: string } | null;
  onSwap: (activity: Activity) => void;
}

export default function ItineraryCard({ day, swappingActivity, onSwap }: ItineraryCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="day-card">
      <div 
        className="day-header" 
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
      >
        <h3 style={{ margin: 0 }}>Day {day.day}: {day.date}</h3>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      
      {expanded && (
        <div className="day-content">
          {day.activities.map((activity, aIdx) => (
            <ActivityItem 
              key={aIdx}
              activity={activity}
              dayNumber={day.day}
              isSwapping={swappingActivity?.day === day.day && swappingActivity?.time === activity.time}
              onSwap={() => onSwap(activity)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
