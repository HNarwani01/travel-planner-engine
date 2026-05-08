/**
 * Wandr UI — Img
 *
 * Usage:
 * <Img src="/tokyo.jpg" alt="Tokyo at night" aspectRatio="landscape" rounded />
 * <Img src="/avatar.jpg" alt="User avatar" aspectRatio="square" rounded="full" />
 * <Img src={dynamicUrl} alt="Trip cover" fill priority />
 * <Img src="/broken.jpg" alt="Missing" fallback="/placeholder-trip.jpg" />
 */

'use client'

import React, { useState } from 'react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'

// ─── Types ───────────────────────────────────────────────────────────────────

export type AspectRatio = 'square' | 'video' | 'portrait' | 'landscape' | 'auto'
export type RoundedSize = boolean | 'sm' | 'md' | 'lg' | 'full'

export interface ImgProps {
  src         : string
  alt         : string
  aspectRatio?: AspectRatio
  rounded?    : RoundedSize
  fallback?   : string
  priority?   : boolean
  /** When true the image fills its positioned parent (no width/height needed) */
  fill?       : boolean
  width?      : number
  height?     : number
  className?  : string
  objectFit?  : 'cover' | 'contain' | 'fill' | 'none'
  sizes?      : string
  quality?    : number
  onClick?    : () => void
}

// ─── Design tokens ───────────────────────────────────────────────────────────

const aspectRatioClasses: Record<AspectRatio, string> = {
  square   : 'aspect-square',
  video    : 'aspect-video',       // 16/9
  portrait : 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  auto     : '',
}

const roundedClasses: Record<string, string> = {
  'true' : 'rounded-[12px]',
  sm     : 'rounded-[8px]',
  md     : 'rounded-[12px]',
  lg     : 'rounded-[20px]',
  full   : 'rounded-full',
  'false': '',
}

// ─── Shimmer placeholder ─────────────────────────────────────────────────────

function Shimmer() {
  return (
    <>
      <style>{`
        @keyframes imgShimmer {
          0%   { background-position: -800px 0; }
          100% { background-position:  800px 0; }
        }
        .wandr-img-shimmer {
          background: linear-gradient(90deg, #13131A 25%, #1E1E2E 50%, #13131A 75%);
          background-size: 1600px 100%;
          animation: imgShimmer 1.8s infinite linear;
        }
      `}</style>
      <div className="wandr-img-shimmer absolute inset-0" aria-hidden="true" />
    </>
  )
}

// ─── Fallback placeholder ─────────────────────────────────────────────────────

function Placeholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#13131A] gap-2" aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1E1E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Img = ({
  src,
  alt,
  aspectRatio = 'auto',
  rounded     = false,
  fallback,
  priority    = false,
  fill        = false,
  width,
  height,
  className   = '',
  objectFit   = 'cover',
  sizes       = '(max-width: 768px) 100vw, 50vw',
  quality     = 80,
  onClick,
}: ImgProps) => {
  const [loaded,  setLoaded]  = useState(false)
  const [errored, setErrored] = useState(false)

  const roundedKey = String(rounded)
  const roundedClass = roundedClasses[roundedKey] ?? roundedClasses['false']

  // Wrapper classes
  const wrapperClasses = [
    'relative overflow-hidden bg-[#13131A]',
    aspectRatio !== 'auto' ? aspectRatioClasses[aspectRatio] : '',
    roundedClass,
    className,
    onClick ? 'cursor-pointer' : '',
  ].filter(Boolean).join(' ')

  const imgStyle: React.CSSProperties = { objectFit }

  // Use fallback if errored
  const resolvedSrc = errored && fallback ? fallback : src

  // Shared Next/Image props
  const imageProps: Partial<NextImageProps> = {
    src     : resolvedSrc,
    alt,
    priority,
    quality,
    sizes,
    style   : imgStyle,
    onLoad  : () => setLoaded(true),
    onError : () => { if (!errored) setErrored(true) },
    className: `transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`,
  }

  return (
    <div className={wrapperClasses} onClick={onClick}>
      {/* Shimmer while loading */}
      {!loaded && !errored && <Shimmer />}

      {/* Fallback icon if errored and no fallback src provided */}
      {errored && !fallback && <Placeholder />}

      {fill ? (
        <NextImage {...imageProps as NextImageProps} fill />
      ) : (
        <NextImage
          {...imageProps as NextImageProps}
          width={width ?? 800}
          height={height ?? (aspectRatio === 'square' ? 800 : aspectRatio === 'video' ? 450 : 600)}
          className={`w-full h-auto ${imageProps.className}`}
        />
      )}
    </div>
  )
}

Img.displayName = 'Img'
