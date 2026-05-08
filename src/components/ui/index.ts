/**
 * Wandr UI Component Library
 * ─────────────────────────────────────────────────────
 * Single import surface for all UI primitives.
 *
 * Usage:
 *   import { Button, Input, Badge, Toast, useToast, ToastContainer, Loader, Link, Img } from '@/components/ui'
 */

// ── Button ────────────────────────────────────────────
export { Button }                        from './Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button'

// ── Input ─────────────────────────────────────────────
export { Input }                         from './Input'
export type { InputProps, InputType, SelectOption }    from './Input'

// ── Badge ─────────────────────────────────────────────
export { Badge }                         from './Badge'
export type { BadgeProps, BadgeVariant, BadgeSize }    from './Badge'

// ── Toast ─────────────────────────────────────────────
export { Toast, ToastContainer, ToastProvider, useToast } from './Toast'
export type { ToastItem, ToastType }     from './Toast'

// ── Loader ────────────────────────────────────────────
export { Loader }                        from './Loader'
export type { LoaderProps, LoaderVariant, LoaderSize } from './Loader'

// ── Link ──────────────────────────────────────────────
export { Link }                          from './Link'
export type { LinkProps, LinkVariant }   from './Link'

// ── Img ───────────────────────────────────────────────
export { Img }                           from './Img'
export type { ImgProps, AspectRatio, RoundedSize } from './Img'
