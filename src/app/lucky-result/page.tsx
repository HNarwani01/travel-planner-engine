'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, CreditCard, Star } from 'lucide-react';
import NextLink from 'next/link';
import { Button, Badge, useToast } from '@/components/ui';
import { LuckyResult, DayItinerary, Activity } from '@/types';
import MapView from '@/components/plan/MapView';
import { getPhotoForDestination, getPlaceDetails, PlaceSearchResult } from '@/services/places.service';

// ─── Typewriter hook ──────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 60, startDelay = 800) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1400, startDelay = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0);
    let start: number | null = null;
    let rafId: number;
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        setValue(Math.floor(progress * target));
        if (progress < 1) rafId = requestAnimationFrame(step);
        else setValue(target);
      };
      rafId = requestAnimationFrame(step);
    }, startDelay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(rafId); };
  }, [target, duration, startDelay]);
  return value;
}

// ─── Collapsible itinerary day ────────────────────────────────────────────────

function LuckyActivityItem({ activity }: { activity: Activity }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '0.875rem 0', borderBottom: '1px solid #1A1A28' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FF6B4A', marginTop: 4 }} />
        <div style={{ width: 2, flex: 1, backgroundColor: '#1E1E2E', marginTop: 4 }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#FF6B4A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{activity.time}</span>
            <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', margin: '0.2rem 0' }}>{activity.place}</h4>
            <p style={{ color: '#8B8B9E', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{activity.description}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#8B8B9E', fontSize: '0.78rem' }}>
            <Clock size={12} /> {activity.duration}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#8B8B9E', fontSize: '0.78rem' }}>
            <CreditCard size={12} /> {activity.estimatedCost}
          </span>
        </div>
      </div>
    </div>
  );
}

function LuckyDayCard({ day, index }: { day: DayItinerary; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div
      style={{
        backgroundColor: '#0E0E18',
        border         : '1px solid #1E1E2E',
        borderRadius   : '14px',
        marginBottom   : '0.875rem',
        overflow       : 'hidden',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width     : '100%',
          background: 'none',
          border    : 'none',
          cursor    : 'pointer',
          padding   : '1rem 1.25rem',
          display   : 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
          <span style={{ color: '#FF6B4A', marginRight: '0.5rem' }}>Day {day.day}</span>
          {day.date}
        </span>
        <span style={{ color: '#6C63FF', fontSize: '1.2rem' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 1.25rem 0.5rem' }}>
          {day.activities.map((a, i) => (
            <LuckyActivityItem key={i} activity={a} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LuckyResultPage() {
  const router    = useRouter();
  const { toast } = useToast();
  const [result, setResult] = useState<LuckyResult | null>(null);
  const [ready, setReady]   = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [placeDetails, setPlaceDetails] = useState<PlaceSearchResult | null>(null);
  const [highlightVisible, setHighlightVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('luckyResult');
    if (!raw) { router.replace('/feeling-lucky'); return; }
    try {
      const data: LuckyResult = JSON.parse(raw);
      setResult(data);
      // stagger highlight fade-in after initial reveal
      setTimeout(() => setHighlightVisible([true]), 2400);
      setTimeout(() => setHighlightVisible([true, true]), 2700);
      setTimeout(() => setHighlightVisible([true, true, true]), 3000);
      // Fetch real photo from Places API
      getPhotoForDestination(`${data.destination}, ${data.country}`).then(url => {
        if (url) setPhotoUrl(url);
      });
      // Fetch rich place data (rating, address) from Places Text Search
      getPlaceDetails(`${data.destination}, ${data.country}`).then(details => {
        if (details) setPlaceDetails(details);
      });

      setReady(true);
    } catch {
      router.replace('/feeling-lucky');
    }
  }, [router]);

  const { displayed: destTyped, done: destDone } = useTypewriter(
    result?.destination ?? '',
    55,
    900
  );
  const scoreCount = useCountUp(result?.matchScore ?? 0, 1200, 1800);

  const handleSave = () => toast.success('Trip saved! ✅ Your lucky adventure is locked in.');

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.info('Link copied to clipboard 🔗');
    }).catch(() => toast.error('Could not copy link'));
  };

  if (!ready || !result) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8B8B9E' }}>Loading your lucky trip…</p>
      </div>
    );
  }

  const heroImage = photoUrl || `https://source.unsplash.com/1200x600/?${encodeURIComponent(result.destination + ',' + result.country)}`;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0F', color: '#fff', paddingBottom: '5rem' }}>

      {/* ── Top bar ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => router.push('/feeling-lucky')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B8B9E', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit', padding: 0 }}
        >
          <ArrowLeft size={18} /> Spin Again
        </button>
        <NextLink href="/home" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#fff' }}>wandr.</span>
        </NextLink>
        <span style={{ width: 90 }} />
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── SECTION 1: Reveal ── */}
        <div
          style={{
            marginTop    : '2.5rem',
            background   : 'linear-gradient(135deg, #0E0E1A 0%, #13131F 60%, #0E0E1A 100%)',
            border       : '1px solid rgba(108,99,255,0.25)',
            borderRadius : '20px',
            padding      : 'clamp(2rem, 5vw, 3rem)',
            textAlign    : 'center',
            boxShadow    : '0 0 60px rgba(108,99,255,0.08)',
          }}
        >
          <p style={{ color: '#8B8B9E', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>
            Your Lucky Destination is…
          </p>

          {/* Destination + flag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <h1
              style={{
                fontSize  : 'clamp(2.4rem, 8vw, 4rem)',
                fontWeight: 900,
                color     : '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                minHeight : '1.2em',
              }}
            >
              {destTyped}
              {!destDone && <span style={{ color: '#6C63FF', animation: 'blink 0.8s step-end infinite' }}>|</span>}
            </h1>
            {destDone && (
              <span style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>{result.countryEmoji}</span>
            )}
          </div>

          {destDone && (
            <p style={{ color: '#8B8B9E', fontStyle: 'italic', fontSize: '1rem', marginBottom: '1.75rem' }}>
              {result.tagline}
            </p>
          )}

          {/* Match score */}
          {destDone && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div style={{
                background   : 'rgba(108,99,255,0.18)',
                border       : '1.5px solid rgba(108,99,255,0.4)',
                borderRadius : '999px',
                padding      : '0.5rem 1.25rem',
                display      : 'inline-flex',
                alignItems   : 'center',
                gap          : '0.5rem',
                boxShadow    : '0 0 20px rgba(108,99,255,0.2)',
              }}>
                <span style={{ color: '#6C63FF', fontWeight: 800, fontSize: '1.15rem' }}>{scoreCount}%</span>
                <span style={{ color: '#8B8B9E', fontSize: '0.85rem' }}>Vibe Match 🎯</span>
              </div>
            </div>
          )}

          {/* Quick stats */}
          {destDone && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                { icon: '💰', label: 'Budget',    value: result.estimatedBudget },
                { icon: '📅', label: 'Best Time', value: result.bestTimeToVisit },
                { icon: '✈️', label: 'Duration',  value: result.days.length + (result.days.length === 1 ? ' Day' : ' Days') },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{s.icon}</div>
                  <div style={{ color: '#8B8B9E', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.1rem' }}>{s.value}</div>
                </div>
              ))}
              {/* Real data from Google Places */}
              {placeDetails?.rating !== undefined && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>⭐</div>
                  <div style={{ color: '#8B8B9E', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rating</div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <Star size={12} style={{ color: '#FFB347', fill: '#FFB347' }} />
                    {placeDetails.rating.toFixed(1)}
                    {placeDetails.user_ratings_total !== undefined && (
                      <span style={{ color: '#8B8B9E', fontWeight: 400, fontSize: '0.75rem' }}>
                        ({placeDetails.user_ratings_total.toLocaleString()})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Verified address from Google Places */}
          {destDone && placeDetails?.formatted_address && (
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#8B8B9E', fontSize: '0.8rem' }}>
              <MapPin size={13} style={{ flexShrink: 0 }} />
              <span>{placeDetails.formatted_address}</span>
            </div>
          )}
        </div>

        {/* ── SECTION 2: Hero image ── */}
        <div style={{ marginTop: '2rem', borderRadius: '16px', overflow: 'hidden', position: 'relative', height: 'clamp(200px, 40vw, 380px)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={result.destination}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.85) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="#FF6B4A" />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              {result.destination}
            </span>
          </div>
        </div>

        {/* ── SECTION 3: Why this matches ── */}
        <div
          style={{
            marginTop  : '1.75rem',
            background : '#0E0E18',
            border     : '1px solid #1E1E2E',
            borderLeft : '4px solid #6C63FF',
            borderRadius: '14px',
            padding    : '1.5rem 1.75rem',
          }}
        >
          <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.875rem', fontSize: '1.05rem' }}>
            Why Wandr picked this for you 🧠
          </h3>
          <p style={{ color: '#A0A0B0', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            {result.whyThisMatches}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {result.highlights.map((h, i) => (
              <span
                key={h}
                style={{
                  background  : highlightVisible[i] ? 'rgba(108,99,255,0.15)' : 'transparent',
                  border      : `1.5px solid ${highlightVisible[i] ? 'rgba(108,99,255,0.4)' : 'transparent'}`,
                  color       : highlightVisible[i] ? '#9B94FF' : 'transparent',
                  borderRadius: '999px',
                  padding     : '0.3rem 0.875rem',
                  fontSize    : '0.82rem',
                  fontWeight  : 500,
                  transition  : 'all 0.5s ease',
                }}
              >
                ✦ {h}
              </span>
            ))}
          </div>
        </div>

        {/* ── SECTION 4: Itinerary ── */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginBottom: '1.25rem' }}>
            Your {result.days.length}-Day Adventure 🗺️
          </h3>
          {result.days.map((day, i) => (
            <LuckyDayCard key={day.day} day={day} index={i} />
          ))}
        </div>

        {/* ── SECTION 5: Map ── */}
        <div
          style={{
            marginTop   : '2rem',
            border      : '1px solid #1E1E2E',
            borderRadius: '16px',
            overflow    : 'hidden',
            height      : '420px',
          }}
        >
          <MapView days={result.days} />
        </div>

        {/* ── SECTION 6: Action buttons ── */}
        <div
          style={{
            marginTop     : '2rem',
            display       : 'flex',
            gap           : '0.875rem',
            flexWrap      : 'wrap',
          }}
        >
          <Button
            variant="ghost"
            size="md"
            onClick={() => router.push('/feeling-lucky')}
            style={{ flex: '1 1 auto' } as React.CSSProperties}
          >
            Not feeling it? Spin Again 🎲
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            style={{ flex: '1 1 auto' } as React.CSSProperties}
          >
            I&apos;m in! Save This Trip ✅
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={handleShare}
            style={{ flex: '1 1 auto' } as React.CSSProperties}
          >
            Share My Lucky Trip 🔗
          </Button>
        </div>
      </div>

      {/* Cursor blink keyframe */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
