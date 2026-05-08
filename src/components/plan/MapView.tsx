'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { DayItinerary } from '../../types';
import { calculateMapBounds } from '../../services/maps.service';
import { defaultCenter } from '../../constants';

interface MapViewProps {
  days: DayItinerary[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

export default function MapView({ days }: MapViewProps) {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    calculateMapBounds(days, map);
  }, [days]);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Recalculate bounds if days change
  useEffect(() => {
    if (mapRef.current) {
      calculateMapBounds(days, mapRef.current);
    }
  }, [days]);

  const allActivities = days.flatMap(day => 
    day.activities.map(act => ({ ...act, dayNum: day.day }))
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-secondary">Loading Map...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={allActivities[0]?.coordinates || defaultCenter}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }]
          }
        ]
      }}
    >
      {allActivities.map((activity, idx) => {
        if (!activity.coordinates || activity.coordinates.lat === 0) return null;
        const markerKey = `${activity.dayNum}-${activity.time}-${idx}`;
        
        return (
          <Marker
            key={markerKey}
            position={activity.coordinates}
            label={{
              text: `${activity.dayNum}`,
              color: 'white',
              fontWeight: 'bold'
            }}
            onClick={() => setActiveMarker(markerKey)}
          >
            {activeMarker === markerKey && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div style={{ padding: '0.5rem', maxWidth: '200px' }}>
                  <h4 style={{ margin: 0, marginBottom: '0.25rem', color: 'var(--primary-color)' }}>{activity.place}</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Day {activity.dayNum} - {activity.time}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </GoogleMap>
  );
}
