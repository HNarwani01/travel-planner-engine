'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import NextLink from 'next/link';
import { Button, Loader, useToast } from '@/components/ui';
import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import { trackEvent } from '@/services/analytics';

// ─── Questions ────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    question: 'Who are you traveling with?',
    options: ['Solo', 'Partner', 'Friends', 'Family', 'Office Trip', 'Honeymoon'],
  },
  {
    question: "What's your budget?",
    options: ['Under ₹10k', '₹10k–25k', '₹25k–50k', '₹50k–1L', 'Luxury Mode 💸'],
  },
  {
    question: 'How long are you wandering?',
    options: ['Weekend', '3–5 Days', '1 Week', '2 Weeks+', 'Long Escape'],
  },
  {
    question: "What's your mood right now?",
    options: [
      'Peace & Quiet',
      'Adventure',
      'Party & Nightlife',
      'Luxury Escape',
      'Nature Reset',
      'Cultural Exploration',
      'Food Journey',
      'Spiritual Journey',
    ],
  },
  {
    question: 'Your preferred weather?',
    options: ['Cold', 'Sunny', 'Rainy', 'Snow', "Doesn't Matter"],
  },
  {
    question: 'What kind of destination?',
    options: ['Mountains', 'Beaches', 'Cities', 'Villages', 'Forests', 'Desert', 'Hidden Gems'],
  },
  {
    question: 'Your travel style?',
    options: [
      'Budget Backpacker',
      'Comfortable Explorer',
      'Luxury Traveler',
      'Local Experience',
      'Instagram Worthy Spots 📸',
    ],
  },
  {
    question: 'Passport situation?',
    options: ['Domestic Only', 'Ready for International', 'Visa-Free Preferred'],
  },
  {
    question: 'Any specific destination in mind?',
    type: 'autocomplete',
    isOptional: true,
    options: [], // Keep options for type safety if needed, or update types
  },
] as const;

const TOTAL = QUESTIONS.length;

// ─── Option card ─────────────────────────────────────────────────────────────

function OptionCard({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const bg     = selected ? 'rgba(108,99,255,0.14)' : hovered ? 'rgba(108,99,255,0.06)' : '#13131A';
  const border = selected
    ? '1.5px solid #6C63FF'
    : hovered
    ? '1.5px solid rgba(108,99,255,0.45)'
    : '1.5px solid #1E1E2E';
  const color  = selected || hovered ? '#ffffff' : '#A0A0B0';
  const shadow = selected ? '0 0 18px rgba(108,99,255,0.28)' : 'none';

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: bg,
        border,
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        color,
        fontWeight: selected ? 600 : 400,
        fontSize: '0.95rem',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.18s ease',
        boxShadow: shadow,
        outline: 'none',
        fontFamily: 'inherit',
        width: '100%',
        minHeight: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VibeCheckPage() {
  const router   = useRouter();
  const { toast } = useToast();

  const [currentQ, setCurrentQ]   = useState(0);
  const [answers, setAnswers]     = useState<string[]>(Array(TOTAL).fill(''));
  const [loading, setLoading]     = useState(false);

  const question = QUESTIONS[currentQ];
  const selected = answers[currentQ];
  const isLast   = currentQ === TOTAL - 1;
  const progress = ((currentQ + 1) / TOTAL) * 100;

  const handleSelect = (option: string) => {
    const updated   = [...answers];
    updated[currentQ] = option;
    setAnswers(updated);
  };

  const handleBack = () => {
    if (currentQ === 0) {
      router.push('/home');
    } else {
      setCurrentQ((q) => q - 1);
    }
  };

  const handleNext = async () => {
    if (!selected && !('isOptional' in question && question.isOptional)) return;

    if (!isLast) {
      setCurrentQ((q) => q + 1);
      return;
    }

    // Last question — call API
    setLoading(true);
    try {
      const response = await fetch('/api/vibe', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          travelingWith  : answers[0],
          budget         : answers[1],
          duration       : answers[2],
          mood           : answers[3],
          weather        : answers[4],
          destinationType: answers[5],
          travelStyle    : answers[6],
          passport       : answers[7],
          specificDestination: answers[8],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check your vibe');
      }

      sessionStorage.setItem('vibeTripPlan', JSON.stringify(data));
      trackEvent('trip_generated', { source: 'vibe_check' });
      router.push('/plan');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Loading overlay ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Loader
        variant="fullscreen"
        size="lg"
        text="Checking your vibe..."
      />
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight       : '100vh',
        backgroundColor : '#0A0A0F',
        color           : '#fff',
        display         : 'flex',
        flexDirection   : 'column',
        alignItems      : 'center',
        padding         : '2rem 1.5rem 4rem',
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          width          : '100%',
          maxWidth       : '640px',
          display        : 'flex',
          alignItems     : 'center',
          justifyContent : 'space-between',
          marginBottom   : '2rem',
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background : 'none',
            border     : 'none',
            cursor     : 'pointer',
            display    : 'flex',
            alignItems : 'center',
            gap        : '0.4rem',
            color      : '#8B8B9E',
            fontSize   : '0.9rem',
            padding    : 0,
            fontFamily : 'inherit',
          }}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
          {currentQ === 0 ? 'Home' : 'Previous'}
        </button>

        <NextLink href="/home" style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontSize      : '1.5rem',
              fontWeight    : 900,
              letterSpacing : '-0.05em',
              color         : '#fff',
            }}
          >
            wandr.
          </span>
        </NextLink>

        <span style={{ color: '#8B8B9E', fontSize: '0.9rem', fontWeight: 500 }}>
          {currentQ + 1}&nbsp;/&nbsp;{TOTAL}
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div
        style={{
          width           : '100%',
          maxWidth        : '640px',
          height          : '4px',
          backgroundColor : '#1E1E2E',
          borderRadius    : '999px',
          marginBottom    : '3rem',
          overflow        : 'hidden',
        }}
      >
        <div
          style={{
            height          : '100%',
            width           : `${progress}%`,
            backgroundColor : '#6C63FF',
            borderRadius    : '999px',
            transition      : 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
            boxShadow       : '0 0 8px rgba(108,99,255,0.5)',
          }}
        />
      </div>

      {/* ── Question ── */}
      <div
        style={{
          width        : '100%',
          maxWidth     : '640px',
          textAlign    : 'center',
          marginBottom : '2.5rem',
        }}
      >
        <p style={{ color: '#6C63FF', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          Question {currentQ + 1} of {TOTAL}
        </p>
        <h1
          style={{
            fontSize  : 'clamp(1.4rem, 4vw, 1.9rem)',
            fontWeight: 700,
            color     : '#ffffff',
            lineHeight: 1.3,
          }}
        >
          {question.question}
        </h1>
      </div>

      {/* ── Options grid or Autocomplete ── */}
      <div
        style={{
          width               : '100%',
          maxWidth            : '640px',
          marginBottom        : '3rem',
        }}
      >
        {('type' in question && question.type === 'autocomplete') ? (
          <div style={{ marginTop: '1rem' }}>
            <AutocompleteInput
              placeholder="e.g. Paris, France (Optional)"
              value={selected}
              onChange={handleSelect}
            />
            <p style={{ color: '#8B8B9E', fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>
              Leave blank if you want us to surprise you!
            </p>
          </div>
        ) : (
          <div
            style={{
              display             : 'grid',
              gridTemplateColumns : 'repeat(auto-fill, minmax(160px, 1fr))',
              gap                 : '0.875rem',
            }}
          >
            {question.options.map((option) => (
              <OptionCard
                key={option}
                label={option}
                selected={selected === option}
                onSelect={() => handleSelect(option)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Action button ── */}
      <div style={{ width: '100%', maxWidth: '640px' }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selected && !('isOptional' in question && question.isOptional)}
          onClick={handleNext}
        >
          {isLast ? 'Check My Vibe ✨' : selected || ('isOptional' in question && question.isOptional) ? 'Next →' : 'Select an Option'}
        </Button>
      </div>
    </div>
  );
}
