'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Map, Compass, Sparkles } from 'lucide-react';

export default function ModeCards() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/plan');
  };

  const baseCardStyle: React.CSSProperties = {
    borderRadius: '16px',
    padding: '2.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    height: '100%',
    position: 'relative',
    background: '#16161A',
    zIndex: 1
  };

  // Function to create wrapper style for gradient border
  const getWrapperStyle = (gradient: string): React.CSSProperties => ({
    background: gradient,
    padding: '2px', // Border width
    borderRadius: '18px',
    transition: 'all 0.3s ease',
    height: '100%',
    boxShadow: '0 0 0 rgba(0,0,0,0)'
  });

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>, glowColor: string) => {
    e.currentTarget.style.transform = 'translateY(-8px)';
    e.currentTarget.style.boxShadow = `0 15px 35px ${glowColor}`;
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2.5rem',
      width: '100%',
      maxWidth: '1100px'
    }}>
      {/* Total Lost Card */}
      <div 
        onClick={handleNavigate}
        style={getWrapperStyle('linear-gradient(135deg, #6C63FF, #B362FF)')}
        onMouseOver={e => handleMouseOver(e, 'rgba(108, 99, 255, 0.25)')}
        onMouseOut={handleMouseOut}
      >
        <div style={baseCardStyle}>
          <Compass size={48} color="#6C63FF" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff', fontWeight: 600 }}>Total Lost</h2>
          <p style={{ color: '#A0A0A0', lineHeight: 1.6, flex: 1 }}>Embrace the unknown and let us guide you to somewhere entirely unexpected.</p>
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #2A2A35', width: '100%', fontSize: '0.85rem' }}>
            <span style={{ color: '#6C63FF', fontWeight: 600 }}>Best for: </span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Overworked, spontaneous, open-minded</span>
          </div>
        </div>
      </div>

      {/* Vibe Check Card */}
      <div 
        onClick={() => router.push('/vibe-check')}
        style={getWrapperStyle('linear-gradient(135deg, #FF6B4A, #FFB86C)')}
        onMouseOver={e => handleMouseOver(e, 'rgba(255, 107, 74, 0.25)')}
        onMouseOut={handleMouseOut}
      >
        <div style={baseCardStyle}>
          <Map size={48} color="#FF6B4A" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff', fontWeight: 600 }}>Vibe Check</h2>
          <p style={{ color: '#A0A0A0', lineHeight: 1.6, flex: 1 }}>Tell us your mood, and we&apos;ll craft an itinerary that perfectly matches your vibe.</p>
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #2A2A35', width: '100%', fontSize: '0.85rem' }}>
            <span style={{ color: '#FF6B4A', fontWeight: 600 }}>Best for: </span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Specific moods, aesthetics, distinct cravings</span>
          </div>
        </div>
      </div>

      {/* Feeling Lucky Card */}
      <div 
        onClick={() => router.push('/feeling-lucky')}
        style={getWrapperStyle('linear-gradient(135deg, #FFD700, #FFA500)')}
        onMouseOver={e => handleMouseOver(e, 'rgba(255, 215, 0, 0.2)')}
        onMouseOut={handleMouseOut}
      >
        <div style={baseCardStyle}>
          <Sparkles size={48} color="#FFD700" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff', fontWeight: 600 }}>Feeling Lucky</h2>
          <p style={{ color: '#A0A0A0', lineHeight: 1.6, flex: 1 }}>Leave it all to chance. We&apos;ll pick a destination and plan a spontaneous adventure.</p>
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #2A2A35', width: '100%', fontSize: '0.85rem' }}>
            <span style={{ color: '#FFD700', fontWeight: 600 }}>Best for: </span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Indecisive, thrill-seekers, quick getaways</span>
          </div>
        </div>
      </div>
    </div>
  );
}
