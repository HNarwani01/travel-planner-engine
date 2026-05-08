/**
 * Wandr UI — Link
 *
 * Usage:
 * <Link href="/trips" variant="primary">My Trips</Link>
 * <Link href="https://maps.google.com" external>Open in Maps</Link>
 * <Link href="/login" variant="nav">Sign in</Link>
 * <Link href="/profile" variant="subtle" icon={<UserIcon />}>Profile</Link>
 * <Link href="/help" disabled>Help (coming soon)</Link>
 */

import React from 'react'
import NextLink from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────

export type LinkVariant = 'default' | 'primary' | 'secondary' | 'nav' | 'subtle'

export interface LinkProps {
  href      : string
  variant?  : LinkVariant
  external? : boolean
  disabled? : boolean
  icon?     : React.ReactNode
  children? : React.ReactNode
  className?: string
  /** Pass-through for Next.js Link */
  prefetch? : boolean
  replace?  : boolean
  scroll?   : boolean
  onClick?  : (e: React.MouseEvent<HTMLAnchorElement>) => void
  'aria-label'?: string
  'aria-current'?: React.AriaAttributes['aria-current']
}

// ─── Design tokens ───────────────────────────────────────────────────────────

const base =
  'inline-flex items-center gap-1.5 font-medium transition-colors duration-200 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F] rounded-sm ' +
  'disabled:opacity-50'

const variants: Record<LinkVariant, string> = {
  default:
    'text-white hover:text-[#6C63FF] underline-offset-4 hover:underline',
  primary:
    'text-[#6C63FF] hover:text-[#8B84FF] underline-offset-4 hover:underline',
  secondary:
    'text-[#FF6B6B] hover:text-[#FF8E8E] underline-offset-4 hover:underline',
  nav:
    'text-[#8B8B9E] hover:text-white no-underline text-sm',
  subtle:
    'text-[#8B8B9E] hover:text-white underline-offset-4 hover:underline',
}

// ─── External link icon ───────────────────────────────────────────────────────

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="opacity-60"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Link = ({
  href,
  variant   = 'default',
  external  = false,
  disabled  = false,
  icon,
  children,
  className = '',
  prefetch,
  replace,
  scroll,
  onClick,
  'aria-label': ariaLabel,
  'aria-current': ariaCurrent,
}: LinkProps) => {
  // detect external automatically if not explicitly passed
  const isExternal = external || (typeof href === 'string' && /^https?:\/\//.test(href))

  const classes = [base, variants[variant], disabled ? 'pointer-events-none opacity-50' : '', className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon && <span className="shrink-0 leading-none">{icon}</span>}
      {children}
      {isExternal && <ExternalIcon />}
    </>
  )

  if (disabled) {
    return (
      <span
        role="link"
        aria-disabled="true"
        aria-label={ariaLabel}
        className={classes}
      >
        {content}
      </span>
    )
  }

  const externalProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <NextLink
      href={href}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={classes}
      {...externalProps}
    >
      {content}
    </NextLink>
  )
}

Link.displayName = 'Link'
