/**
 * Wandr UI — Badge
 *
 * Usage:
 * <Badge variant="success">Confirmed</Badge>
 * <Badge variant="primary" size="sm" icon={<StarIcon />}>Featured</Badge>
 * <Badge variant="outline" onRemove={() => removeTag('beach')}>Beach</Badge>
 */

import React from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

export type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'outline'
export type BadgeSize    = 'sm' | 'md' | 'lg'

export interface BadgeProps {
  variant?  : BadgeVariant
  size?     : BadgeSize
  icon?     : React.ReactNode
  onRemove? : () => void
  children? : React.ReactNode
  className?: string
}

// ─── Design tokens ───────────────────────────────────────────────────────────

const base =
  'inline-flex items-center gap-1.5 font-semibold rounded-full ' +
  'transition-colors duration-150 select-none leading-none'

const variants: Record<BadgeVariant, string> = {
  default:
    'bg-[#1E1E2E] text-[#8B8B9E] border border-[#2A2A3E]',
  success:
    'bg-[rgba(34,197,94,0.15)] text-[#22C55E] border border-[rgba(34,197,94,0.25)]',
  error:
    'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border border-[rgba(239,68,68,0.25)]',
  warning:
    'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.25)]',
  primary:
    'bg-[rgba(108,99,255,0.15)] text-[#6C63FF] border border-[rgba(108,99,255,0.25)]',
  secondary:
    'bg-[rgba(255,107,107,0.15)] text-[#FF6B6B] border border-[rgba(255,107,107,0.25)]',
  outline:
    'bg-transparent text-white border border-[#1E1E2E] hover:border-[#6C63FF] hover:text-[#6C63FF]',
}

const sizes: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs    px-2.5 py-1',
  lg: 'text-sm    px-3 py-1.5',
}

const removeIconSizes: Record<BadgeSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
}

// ─── Close icon ───────────────────────────────────────────────────────────────

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Badge = ({
  variant   = 'default',
  size      = 'md',
  icon,
  onRemove,
  children,
  className = '',
}: BadgeProps) => {
  const classes = [base, variants[variant], sizes[size], className].filter(Boolean).join(' ')

  return (
    <span className={classes}>
      {icon && <span className="shrink-0 leading-none">{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="shrink-0 opacity-70 hover:opacity-100 transition-opacity ml-0.5 rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-current"
        >
          <CloseIcon className={removeIconSizes[size]} />
        </button>
      )}
    </span>
  )
}

Badge.displayName = 'Badge'
