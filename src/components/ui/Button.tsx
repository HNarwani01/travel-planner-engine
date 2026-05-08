/**
 * Wandr UI — Button
 *
 * Usage:
 * <Button variant="primary" size="md" loading={false}>Start Wandering</Button>
 * <Button variant="ghost" size="sm" icon={<SearchIcon />}>Search</Button>
 * <Button variant="danger" size="lg" fullWidth>Delete Trip</Button>
 */

import React from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'loading'
export type ButtonSize    = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?  : ButtonVariant
  size?     : ButtonSize
  loading?  : boolean
  disabled? : boolean
  fullWidth?: boolean
  icon?     : React.ReactNode
  children? : React.ReactNode
}

// ─── Design tokens ───────────────────────────────────────────────────────────

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-[12px] ' +
  'transition-all duration-200 focus:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed select-none'

const variants: Record<string, string> = {
  primary:
    'bg-[#6C63FF] hover:bg-[#5A52E0] active:bg-[#4A42D0] text-white ' +
    'shadow-[0_0_20px_rgba(108,99,255,0.35)] hover:shadow-[0_0_30px_rgba(108,99,255,0.55)] ' +
    'focus-visible:ring-[#6C63FF]',
  secondary:
    'bg-[#FF6B6B] hover:bg-[#E85D5D] active:bg-[#D04F4F] text-white ' +
    'shadow-[0_0_20px_rgba(255,107,107,0.3)] hover:shadow-[0_0_30px_rgba(255,107,107,0.5)] ' +
    'focus-visible:ring-[#FF6B6B]',
  ghost:
    'bg-transparent border border-[#6C63FF] text-[#6C63FF] ' +
    'hover:bg-[rgba(108,99,255,0.1)] active:bg-[rgba(108,99,255,0.2)] ' +
    'focus-visible:ring-[#6C63FF]',
  danger:
    'bg-[#EF4444] hover:bg-[#DC2626] active:bg-[#B91C1C] text-white ' +
    'shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] ' +
    'focus-visible:ring-[#EF4444]',
  loading:
    'bg-[#6C63FF] text-white opacity-70 cursor-wait ' +
    'focus-visible:ring-[#6C63FF]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 h-8',
  md: 'text-sm px-4 py-2   h-10',
  lg: 'text-base px-6 py-4',
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

const Spinner = ({ className = '' }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

const spinnerSizes: Record<ButtonSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant   = 'primary',
      size      = 'md',
      loading   = false,
      disabled  = false,
      fullWidth = false,
      icon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const resolvedVariant = loading ? 'loading' : variant
    const isDisabled = disabled || loading

    const classes = [
      base,
      variants[resolvedVariant],
      sizes[size],
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={classes}
        {...props}
      >
        {loading ? (
          <>
            <Spinner className={spinnerSizes[size]} />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
