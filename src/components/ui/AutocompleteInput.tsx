'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Input, InputProps } from './Input';

interface AutocompleteInputProps extends InputProps {
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
}

const LIBRARIES: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

export const AutocompleteInput: React.FC<AutocompleteInputProps> = (props) => {
  const { onPlaceSelected, onChange, value, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['(regions)'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place) {
          if (onPlaceSelected) {
            onPlaceSelected(place);
          }
          if (onChange && place.formatted_address) {
            onChange(place.formatted_address);
          } else if (onChange && place.name) {
            onChange(place.name);
          }
        }
      });
    }
  }, [isLoaded, onChange, onPlaceSelected]);

  // We need to reach into the Input component's input element.
  // Since Input uses forwardRef, we can pass our ref to it.
  // Wait, Input.tsx forwardRef is on the wrapper div, not the input.
  // Let me check Input.tsx again.
  
  return (
    <Input
      {...rest}
      value={value}
      onChange={onChange}
      innerRef={inputRef as any} 
    />
  );
};
