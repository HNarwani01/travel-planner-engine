'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/home');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '100%', maxWidth: '420px' }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ 
          fontSize: '2.5rem', 
          fontWeight: 900, 
          letterSpacing: '-0.05em', 
          color: '#fff',
          marginBottom: '0.2rem',
          textAlign: 'center'
        }}>
          wandr.
        </div>
      </Link>
      <div style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
        Every journey starts here
      </div>

      <div style={{ 
        textAlign: 'center', 
        padding: '3rem', 
        width: '100%',
        boxShadow: '0 0 0 1px rgba(108,99,255,0.25), 0 0 40px rgba(108,99,255,0.15)',
        border: '1px solid rgba(108,99,255,0.3)',
        backgroundColor: '#13131A',
        borderRadius: '16px'
      }}>
        <h2 style={{ marginBottom: '2rem', color: '#fff', fontSize: '1.8rem', fontWeight: 600 }}>Welcome back</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input 
            type="text" 
            placeholder="Username (optional)" 
            value={username}
            onChange={(value) => setUsername(value)}
          />
          <Input 
            type="password" 
            placeholder="Password (optional)" 
            value={password}
            onChange={(value) => setPassword(value)}
          />
          <Button type="submit" fullWidth size="lg">
            Start Wandering
          </Button>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            No account needed — just wander in
          </div>
        </form>
      </div>
    </div>
  );
}
