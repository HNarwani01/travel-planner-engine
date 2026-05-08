'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { DayItinerary } from '../../types';
import { calculateMapBounds } from '../../services/maps.service';
import { defaultCenter, GOOGLE_MAPS_LIBRARIES } from '../../constants';

interface MapViewProps {
  days: DayItinerary[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

/** Colours used for the per-day route polylines (cycles if more than 5 days). */
const DAY_ROUTE_COLORS = ['#6C63FF', '#FF6B4A', '#00C9A7', '#FFB347', '#E91E8C'];

/**
 * Wraps the callback-based DirectionsService.route() in a Promise so it
 * can be used with async/await.
 */
function requestDirections(
  service: google.maps.DirectionsService,
  request: google.maps.DirectionsRequest,
): Promise<google.maps.DirectionsResult> {
  return new Promise((resolve, reject) => {
    service.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        resolve(result);
      } else {
        reject(new Error(`Directions request failed with status: ${status}`));
      }
    });
  });
}

export default function MapView({ days }: MapViewProps) {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [directionsResults, setDirectionsResults] = useState<google.maps.DirectionsResult[]>([]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  /** Compute a walking route for each day's activities and store results. */
  const computeRoutes = useCallback(async () => {
    if (!window.google) return;
    const service = new google.maps.DirectionsService();
    const results: google.maps.DirectionsResult[] = [];

    for (const day of days) {
      // Need at least two locations to draw a route
      const valid = day.activities.filter(
        (a) => a.coordinates && a.coordinates.lat !== 0,
      );
      if (valid.length < 2) continue;

      const [origin, ...rest] = valid;
      const destination = rest[rest.length - 1];
      const waypoints = rest.slice(0, -1).map((a) => ({
        location: new google.maps.LatLng(a.coordinates.lat, a.coordinates.lng),
        stopover: false,
      }));

      try {
        const result = await requestDirections(service, {
          origin: new google.maps.LatLng(origin.coordinates.lat, origin.coordinates.lng),
          destination: new google.maps.LatLng(destination.coordinates.lat, destination.coordinates.lng),
          waypoints,
          travelMode: google.maps.TravelMode.WALKING,
          optimizeWaypoints: false,
        });
        results.push(result);
      } catch {
        // Route unavailable for this day — silently skip, markers still show
      }
    }

    setDirectionsResults(results);
  }, [days]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      calculateMapBounds(days, map);
      computeRoutes();
    },
    [days, computeRoutes],
  );

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      calculateMapBounds(days, mapRef.current);
      computeRoutes();
    }
  }, [days, computeRoutes]);

  const allActivities = days.flatMap((day) =>
    day.activities.map((act) => ({ ...act, dayNum: day.day })),
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
      center={allActivities[0]?.coordinates ?? defaultCenter}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [{ featureType: 'poi.business', stylers: [{ visibility: 'off' }] }],
      }}
    >
      {/* Per-day walking route polylines */}
      {directionsResults.map((result, idx) => (
        <DirectionsRenderer
          key={idx}
          directions={result}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: DAY_ROUTE_COLORS[idx % DAY_ROUTE_COLORS.length],
              strokeWeight: 4,
              strokeOpacity: 0.75,
            },
          }}
        />
      ))}

      {/* Activity markers */}
      {allActivities.map((activity, idx) => {
        if (!activity.coordinates || activity.coordinates.lat === 0) return null;
        const markerKey = `${activity.dayNum}-${activity.time}-${idx}`;

        return (
          <Marker
            key={markerKey}
            position={activity.coordinates}
            label={{ text: `${activity.dayNum}`, color: 'white', fontWeight: 'bold' }}
            onClick={() => setActiveMarker(markerKey)}
          >
            {activeMarker === markerKey && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div style={{ padding: '0.5rem', maxWidth: '200px' }}>
                  <h4 style={{ margin: 0, marginBottom: '0.25rem', color: 'var(--primary-color)' }}>
                    {activity.place}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Day {activity.dayNum} · {activity.time}
                  </p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </GoogleMap>
  );
}
