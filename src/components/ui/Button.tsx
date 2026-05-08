import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
}

export default function Button({ children, variant = 'primary', fullWidth, style, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        backgroundColor: variant === 'primary' ? '#FF6B4A' : 'transparent',
        color: variant === 'primary' ? '#fff' : '#FF6B4A',
        padding: '1rem 2.5rem',
        borderRadius: '9999px',
        fontSize: '1.1rem',
        fontWeight: '600',
        border: variant === 'primary' ? 'none' : '1px solid #FF6B4A',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        boxShadow: variant === 'primary' && !props.disabled ? '0 4px 14px 0 rgba(255, 107, 74, 0.39)' : 'none',
        opacity: props.disabled ? 0.7 : 1,
        width: fullWidth ? '100%' : undefined,
        ...style
      }}
      onMouseOver={e => {
        if (!props.disabled) e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={e => {
        if (!props.disabled) e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </button>
  );
}
