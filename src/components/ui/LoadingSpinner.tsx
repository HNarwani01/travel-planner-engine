import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export default function LoadingSpinner({ size = 20, color = 'white' }: LoadingSpinnerProps) {
  return (
    <div 
      className="spinner" 
      style={{
        width: size,
        height: size,
        borderWidth: size > 30 ? '4px' : '3px',
        borderColor: `rgba(255, 255, 255, 0.3)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    ></div>
  );
}
