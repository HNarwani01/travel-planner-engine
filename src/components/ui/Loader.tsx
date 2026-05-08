/**
 * Wandr UI — Loader
 *
 * Usage:
 * <Loader variant="spinner" size="md" />
 * <Loader variant="dots" size="lg" />
 * <Loader variant="pulse" size="sm" />
 * <Loader variant="skeleton" size="md" />
 * <Loader variant="fullscreen" text="Planning your trip..." />
 */

import React from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

export type LoaderVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'fullscreen'
export type LoaderSize    = 'sm' | 'md' | 'lg'

export interface LoaderProps {
  variant?   : LoaderVariant
  size?      : LoaderSize
  text?      : string
  className? : string
  /** Alias for fullscreen variant */
  fullscreen?: boolean
}

// ─── Sizes ───────────────────────────────────────────────────────────────────

const spinnerDims: Record<LoaderSize, string> = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-10 h-10' }
const strokeW:    Record<LoaderSize, number>  = { sm: 3,        md: 3,         lg: 2.5        }
const dotDims:    Record<LoaderSize, string> = { sm: 'w-1.5 h-1.5', md: 'w-2 h-2', lg: 'w-3 h-3' }
const pulseDims:  Record<LoaderSize, string> = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
const textSizes:  Record<LoaderSize, string> = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

// ─── Spinner ─────────────────────────────────────────────────────────────────

function Spinner({ size }: { size: LoaderSize }) {
  return (
    <svg
      className={`${spinnerDims[size]} animate-spin text-[#6C63FF]`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={strokeW[size]} />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ─── Dots ─────────────────────────────────────────────────────────────────────

function Dots({ size }: { size: LoaderSize }) {
  return (
    <style>{`
      @keyframes wandrBounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40%            { transform: translateY(-6px); opacity: 1; }
      }
    `}</style>
  )
}

function DotsLoader({ size }: { size: LoaderSize }) {
  return (
    <>
      <Dots size={size} />
      <div className="flex items-center gap-1.5" aria-label="Loading" role="status">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`${dotDims[size]} rounded-full bg-[#6C63FF]`}
            style={{ animation: `wandrBounce 1.2s ease-in-out ${i * 0.16}s infinite` }}
          />
        ))}
      </div>
    </>
  )
}

// ─── Pulse ────────────────────────────────────────────────────────────────────

function PulseLoader({ size }: { size: LoaderSize }) {
  return (
    <span className={`relative inline-flex ${pulseDims[size]}`} role="status" aria-label="Loading">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C63FF] opacity-30`} />
      <span className={`relative inline-flex rounded-full ${pulseDims[size]} bg-[#6C63FF]`} />
    </span>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const skeletonHeights: Record<LoaderSize, string> = { sm: 'h-4', md: 'h-6', lg: 'h-8' }

function SkeletonLoader({ size, className = '' }: { size: LoaderSize; className?: string }) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .wandr-skeleton {
          background: linear-gradient(90deg, #13131A 25%, #1E1E2E 50%, #13131A 75%);
          background-size: 800px 100%;
          animation: shimmer 1.6s infinite linear;
        }
      `}</style>
      <div
        role="status"
        aria-label="Loading content"
        className={`wandr-skeleton w-full rounded-[12px] ${skeletonHeights[size]} ${className}`}
      />
    </>
  )
}

// ─── Fullscreen ───────────────────────────────────────────────────────────────

function FullscreenLoader({ size, text }: { size: LoaderSize; text?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={text ?? 'Loading'}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-4 bg-[rgba(10,10,15,0.85)] backdrop-blur-sm"
    >
      <Spinner size={size} />
      {text && (
        <p className={`${textSizes[size]} text-[#8B8B9E] font-medium`}>{text}</p>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export const Loader = ({
  variant    = 'spinner',
  size       = 'md',
  text,
  fullscreen = false,
  className  = '',
}: LoaderProps) => {
  const resolvedVariant = fullscreen ? 'fullscreen' : variant

  if (resolvedVariant === 'fullscreen') {
    return <FullscreenLoader size={size} text={text} />
  }

  if (resolvedVariant === 'skeleton') {
    return <SkeletonLoader size={size} className={className} />
  }

  const inner = (() => {
    switch (resolvedVariant) {
      case 'dots':  return <DotsLoader size={size} />
      case 'pulse': return <PulseLoader size={size} />
      default:      return <Spinner size={size} />
    }
  })()

  return (
    <span
      role="status"
      aria-label={text ?? 'Loading'}
      className={`inline-flex flex-col items-center gap-2 ${className}`}
    >
      {inner}
      {text && (
        <span className={`${textSizes[size]} text-[#8B8B9E]`}>{text}</span>
      )}
    </span>
  )
}

Loader.displayName = 'Loader'
