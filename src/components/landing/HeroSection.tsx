'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui';

export default function HeroSection() {
  const router = useRouter();

  return (
    <div style={{ zIndex: 1, textAlign: 'center' }}>
      <h1 style={{ fontSize: '4.5rem', letterSpacing: '0.05em', marginBottom: '1rem', color: '#ffffff', fontWeight: 700 }}>Wandr</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: '#A0A0A0', fontWeight: 300 }}>
        Every journey starts with a single wander
      </p>
      <Button onClick={() => router.push('/login')}>
        Start Wandering
      </Button>
    </div>
  );
}
