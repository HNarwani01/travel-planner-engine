import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: InputProps) {
  return (
    <input 
      {...props}
      style={{
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #333',
        backgroundColor: '#0A0A0F',
        color: '#fff',
        fontSize: '1rem',
        outline: 'none',
        width: '100%',
        ...props.style
      }}
    />
  );
}
