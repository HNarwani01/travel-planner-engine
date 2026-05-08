'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import NextLink from 'next/link';
import { Button, Loader, useToast } from '@/components/ui';

// ─── Questions config ─────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    key    : 'budget',
    label  : "What's your budget? 💸",
    options: [
      { value: 'Budget Escape',   emoji: '🪙' },
      { value: 'Mid-Range Trip',  emoji: '💳' },
      { value: 'Luxury Mode',     emoji: '💎' },
      { value: 'Surprise Me',     emoji: '🎁' },
    ],
  },
  {
    key    : 'travelingWith',
    label  : "Who's coming? 👥",
    options: [
      { value: 'Solo',       emoji: '🧍' },
      { value: 'Partner',    emoji: '👫' },
      { value: 'Friends',    emoji: '👯' },
      { value: 'Family',     emoji: '👨‍👩‍👧' },
      { value: 'Surprise Me',emoji: '🎲' },
    ],
  },
  {
    key    : 'vibe',
    label  : "What's the vibe? ✨",
    options: [
      { value: 'Relax & Chill', emoji: '🌊' },
      { value: 'Adventure',     emoji: '🧗' },
      { value: 'Party',         emoji: '🎉' },
      { value: 'Romantic',      emoji: '🌹' },
      { value: 'Nature',        emoji: '🌿' },
      { value: 'Luxury',        emoji: '✨' },
      { value: 'Hidden Gem',    emoji: '💎' },
      { value: 'Total Surprise',emoji: '🎲' },
    ],
  },
  {
    key    : 'duration',
    label  : "Trip length? 🗓️",
    options: [
      { value: 'Weekend',        emoji: '⚡' },
      { value: '3–5 Days',       emoji: '🗓️' },
      { value: '1 Week',         emoji: '📅' },
      { value: '2 Weeks+',       emoji: '🌍' },
      { value: "Doesn't Matter", emoji: '♾️' },
    ],
  },
  {
    key    : 'locationPref',
    label  : "How far? 🌍",
    options: [
      { value: 'Domestic Only',  emoji: '🏠' },
      { value: 'International',  emoji: '✈️' },
      { value: 'Either Works',   emoji: '🗺️' },
      { value: 'Surprise Me',    emoji: '🎲' },
    ],
  },
] as const;

type AnswerKey = typeof QUESTIONS[number]['key'];

// ─── Single option chip ───────────────────────────────────────────────────────

function OptionChip({
  emoji,
  label,
  selected,
  onSelect,
}: {
  emoji   : string;
  label   : string;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background   : selected ? 'rgba(108,99,255,0.18)' : hovered ? 'rgba(108,99,255,0.08)' : '#13131A',
        border       : selected ? '1.5px solid #6C63FF' : hovered ? '1.5px solid rgba(108,99,255,0.5)' : '1.5px solid #1E1E2E',
        borderRadius : '12px',
        padding      : '0.65rem 1rem',
        color        : selected ? '#fff' : hovered ? '#d4d0ff' : '#A0A0B0',
        fontWeight   : selected ? 600 : 400,
        fontSize     : '0.875rem',
        cursor       : 'pointer',
        transition   : 'all 0.18s ease',
        boxShadow    : selected ? '0 0 16px rgba(108,99,255,0.3)' : 'none',
        outline      : 'none',
        fontFamily   : 'inherit',
        display      : 'flex',
        alignItems   : 'center',
        gap          : '0.5rem',
        whiteSpace   : 'nowrap',
      }}
      aria-pressed={selected}
    >
      <span style={{ fontSize: '1rem' }}>{emoji}</span>
      {label}
    </button>
  );
}

// ─── Question block ───────────────────────────────────────────────────────────

function QuestionBlock({
  question,
  selected,
  onSelect,
}: {
  question: typeof QUESTIONS[number];
  selected: string;
  onSelect: (val: string) => void;
}) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <p style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: '0.875rem' }}>
        {question.label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        {question.options.map((opt) => (
          <OptionChip
            key={opt.value}
            emoji={opt.emoji}
            label={opt.value}
            selected={selected === opt.value}
            onSelect={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeelingLuckyPage() {
  const router     = useRouter();
  const { toast }  = useToast();
  const [loading, setLoading] = useState(false);

  const [answers, setAnswers] = useState<Record<AnswerKey, string>>({
    budget       : '',
    travelingWith: '',
    vibe         : '',
    duration     : '',
    locationPref : '',
  });

  const allAnswered = QUESTIONS.every((q) => answers[q.key] !== '');

  const handleSelect = (key: AnswerKey, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSpin = async () => {
    if (!allAnswered) return;
    setLoading(true);
    try {
      const res = await fetch('/api/lucky', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to spin');

      localStorage.setItem('luckyResult', JSON.stringify(data));
      router.push('/lucky-result');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader variant="fullscreen" size="lg" text="Spinning the globe... 🌍" />;
  }

  return (
    <div
      style={{
        minHeight      : '100vh',
        backgroundColor: '#0A0A0F',
        color          : '#fff',
        display        : 'flex',
        flexDirection  : 'column',
        alignItems     : 'center',
        padding        : '2rem 1.5rem 6rem',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          width         : '100%',
          maxWidth      : '640px',
          display       : 'flex',
          alignItems    : 'center',
          justifyContent: 'space-between',
          marginBottom  : '2.5rem',
        }}
      >
        <button
          onClick={() => router.push('/home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B8B9E', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit', padding: 0 }}
          aria-label="Back to home"
        >
          <ArrowLeft size={18} /> Home
        </button>
        <NextLink href="/home" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#fff' }}>wandr.</span>
        </NextLink>
        <span style={{ width: 64 }} />
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', width: '100%', maxWidth: '640px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎲</div>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Feeling Lucky?
        </h1>
        <p style={{ color: '#8B8B9E', fontSize: '1.1rem' }}>5 hints. One perfect trip. Zero stress.</p>
      </div>

      {/* Questions */}
      <div style={{ width: '100%', maxWidth: '640px' }}>
        {QUESTIONS.map((q) => (
          <QuestionBlock
            key={q.key}
            question={q}
            selected={answers[q.key]}
            onSelect={(val) => handleSelect(q.key, val)}
          />
        ))}
      </div>

      {/* Spin button */}
      <div style={{ width: '100%', maxWidth: '640px', marginTop: '1rem' }}>
        <style>{`
          @keyframes shimmer {
            0%   { background-position: -400px 0; }
            100% { background-position:  400px 0; }
          }
          .spin-btn:not(:disabled) {
            background: linear-gradient(
              135deg,
              #6C63FF 0%, #8B84FF 30%, #6C63FF 60%, #5A52E0 100%
            );
            background-size: 400px 100%;
            animation: shimmer 3s linear infinite;
          }
          .spin-btn:disabled {
            background: #1E1E2E;
            color: #3A3A4E;
          }
        `}</style>
        <button
          className="spin-btn"
          disabled={!allAnswered}
          onClick={handleSpin}
          style={{
            width        : '100%',
            padding      : '1rem',
            borderRadius : '12px',
            border       : 'none',
            cursor       : allAnswered ? 'pointer' : 'not-allowed',
            color        : allAnswered ? '#fff' : '#3A3A4E',
            fontWeight   : 700,
            fontSize     : '1.05rem',
            fontFamily   : 'inherit',
            transition   : 'opacity 0.2s',
            boxShadow    : allAnswered ? '0 0 30px rgba(108,99,255,0.4)' : 'none',
          }}
          aria-disabled={!allAnswered}
        >
          🎰 Spin My Trip
        </button>
      </div>

      {!allAnswered && (
        <p style={{ color: '#3A3A4E', fontSize: '0.8rem', marginTop: '0.75rem' }}>
          Answer all 5 questions to unlock your lucky trip
        </p>
      )}
    </div>
  );
}
