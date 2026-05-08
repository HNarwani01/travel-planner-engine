import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  onMouseOver?: React.MouseEventHandler<HTMLDivElement>;
  onMouseOut?: React.MouseEventHandler<HTMLDivElement>;
}

export default function Card({ children, style, className, onClick, onMouseOver, onMouseOut }: CardProps) {
  return (
    <div 
      className={className}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{
        backgroundColor: '#16161A',
        borderRadius: '16px',
        padding: '2.5rem',
        border: '1px solid #2A2A35',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        ...style
      }}
    >
      {children}
    </div>
  );
}
