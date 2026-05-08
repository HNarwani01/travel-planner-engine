import React from 'react';
import { Clock, CreditCard, RefreshCcw, RefreshCw } from 'lucide-react';
import { Activity } from '../../types';

interface ActivityItemProps {
  activity: Activity;
  dayNumber: number;
  isSwapping: boolean;
  onSwap: () => void;
}

export default function ActivityItem({ activity, dayNumber, isSwapping, onSwap }: ActivityItemProps) {
  return (
    <div className="activity-item">
      <div className="activity-time-dot"></div>
      <div className="activity-time">{activity.time}</div>
      
      <div className="activity-details">
        <div className="activity-header">
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{activity.place}</h4>
          <button 
            className="btn-outline" 
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            onClick={onSwap}
            disabled={isSwapping}
            aria-label={`Swap ${activity.time} activity on Day ${dayNumber}`}
          >
            {isSwapping ? (
              <RefreshCw size={14} className="spinning" />
            ) : (
              <RefreshCcw size={14} />
            )}
            Swap
          </button>
        </div>
        
        <p className="text-secondary">{activity.description}</p>
        
        <div className="activity-meta">
          <div className="activity-meta-item">
            <Clock size={14} />
            <span>{activity.duration}</span>
          </div>
          <div className="activity-meta-item">
            <CreditCard size={14} />
            <span>{activity.estimatedCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
