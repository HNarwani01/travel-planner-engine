'use client';
import React from 'react';
import ModeCards from '../../components/home/ModeCards';
import Starfield from '../../components/ui/Starfield';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0F',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '6rem 2rem 4rem 2rem',
      position: 'relative'
    }}>
      <Starfield />

      {/* Navbar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        padding: '1.5rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#fff' }}>wandr.</div>
        </Link>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem' }}>Welcome wanderer</div>
      </div>

      <div style={{ zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '4rem', 
          color: '#fff',
          textAlign: 'center',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          textShadow: '0 0 40px rgba(255,255,255,0.1)'
        }}>
          Where will you wander next?
        </h1>
        
        <ModeCards />
      </div>
    </div>
  );
}
