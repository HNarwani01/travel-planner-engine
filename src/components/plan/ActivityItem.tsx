'use client';

import React, { useState } from 'react';
import { Clock, CreditCard, RefreshCcw, RefreshCw } from 'lucide-react';
import { Activity } from '../../types';

interface ActivityItemProps {
  activity: Activity;
  dayNumber: number;
  isSwapping: boolean;
  onSwap: () => void;
}

/** Mini Maps Embed shown on hover over an activity card. */
function MiniMapEmbed({ place }: { place: string }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(place)}&zoom=15`;

  return (
    <div
      style={{
        marginTop   : '0.75rem',
        borderRadius: '8px',
        overflow    : 'hidden',
        border      : '1px solid var(--border-color)',
        height      : '140px',
      }}
    >
      <iframe
        src={src}
        title={`Map preview for ${place}`}
        width="100%"
        height="140"
        style={{ border: 0, display: 'block' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

export default function ActivityItem({ activity, dayNumber, isSwapping, onSwap }: ActivityItemProps) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div
      className="activity-item"
      onMouseEnter={() => setShowMap(true)}
      onMouseLeave={() => setShowMap(false)}
    >
      <div className="activity-time-dot" />
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

        {/* Mini map preview — shown on hover when a place name is available */}
        {showMap && activity.place && (
          <MiniMapEmbed place={activity.place} />
        )}
      </div>
    </div>
  );
}
