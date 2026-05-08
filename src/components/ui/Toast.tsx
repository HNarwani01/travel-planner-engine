/**
 * Wandr UI — Toast & useToast
 *
 * Usage:
 *   // In layout.tsx
 *   import { ToastContainer } from '@/components/ui'
 *   <ToastContainer />
 *
 *   // In any component
 *   const { toast } = useToast()
 *   toast.success("Trip planned successfully!")
 *   toast.error("Something went wrong.")
 *   toast.warning("Almost at your budget limit.")
 *   toast.info("New destination unlocked.")
 */

'use client'

import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id       : string
  type     : ToastType
  message  : string
  duration?: number
  /** internal: whether the exit animation is running */
  removing?: boolean
}

interface ToastContextValue {
  toasts : ToastItem[]
  add    : (item: Omit<ToastItem, 'id'>) => void
  remove : (id: string) => void
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const remove = useCallback((id: string) => {
    // mark as removing first (triggers exit animation), then delete
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
    )
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  const add = useCallback(
    (item: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${++counter.current}`
      setToasts((prev) => [...prev.slice(-4), { ...item, id }]) // cap at 5
      const duration = item.duration ?? 3000
      if (duration > 0) {
        setTimeout(() => remove(id), duration)
      }
    },
    [remove]
  )

  return (
    <ToastContext.Provider value={{ toasts, add, remove }}>
      {children}
    </ToastContext.Provider>
  )
}

// ─── useToast hook ────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')

  const toast = {
    success : (message: string, duration?: number) => ctx.add({ type: 'success', message, duration }),
    error   : (message: string, duration?: number) => ctx.add({ type: 'error',   message, duration }),
    warning : (message: string, duration?: number) => ctx.add({ type: 'warning', message, duration }),
    info    : (message: string, duration?: number) => ctx.add({ type: 'info',    message, duration }),
  }

  return { toast, remove: ctx.remove, toasts: ctx.toasts }
}

// ─── Design tokens ───────────────────────────────────────────────────────────

const toastStyles: Record<ToastType, { icon: React.ReactNode; bar: string; bg: string; border: string }> = {
  success: {
    bar   : 'bg-[#22C55E]',
    bg    : 'bg-[rgba(34,197,94,0.08)]',
    border: 'border-[rgba(34,197,94,0.25)]',
    icon  : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  error: {
    bar   : 'bg-[#EF4444]',
    bg    : 'bg-[rgba(239,68,68,0.08)]',
    border: 'border-[rgba(239,68,68,0.25)]',
    icon  : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  warning: {
    bar   : 'bg-[#F59E0B]',
    bg    : 'bg-[rgba(245,158,11,0.08)]',
    border: 'border-[rgba(245,158,11,0.25)]',
    icon  : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  info: {
    bar   : 'bg-[#6C63FF]',
    bg    : 'bg-[rgba(108,99,255,0.08)]',
    border: 'border-[rgba(108,99,255,0.25)]',
    icon  : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
}

// ─── Single toast card ────────────────────────────────────────────────────────

function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: () => void }) {
  const style = toastStyles[item.type]

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={[
        'relative flex items-start gap-3 w-[340px] max-w-[calc(100vw-32px)]',
        'rounded-[12px] border px-4 py-3.5',
        'bg-[#13131A] backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        style.border,
        'overflow-hidden',
        item.removing
          ? 'animate-[toastOut_0.3s_ease_forwards]'
          : 'animate-[toastIn_0.35s_cubic-bezier(0.22,1,0.36,1)_forwards]',
      ].join(' ')}
    >
      {/* coloured left bar */}
      <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${style.bar} rounded-l-[12px]`} />

      {/* icon */}
      <span className="shrink-0 mt-0.5">{style.icon}</span>

      {/* message */}
      <p className="flex-1 text-sm text-white leading-snug">{item.message}</p>

      {/* close */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Dismiss notification"
        className="shrink-0 text-[#8B8B9E] hover:text-white transition-colors mt-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#6C63FF] rounded"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

// ─── ToastContainer ───────────────────────────────────────────────────────────

/**
 * Place once in your root layout:
 *   <ToastContainer />
 *
 * Wrap your app (or layout) with <ToastProvider> if you're not using
 * the standalone version below.
 */
export function ToastContainer() {
  const ctx = useContext(ToastContext)
  if (!ctx) return null

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(110%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(110%); }
        }
      `}</style>
      <div
        aria-label="Notifications"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
      >
        {ctx.toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastCard item={t} onRemove={() => ctx.remove(t.id)} />
          </div>
        ))}
      </div>
    </>
  )
}

// ─── Standalone Toast (re-exports Provider + Container together) ──────────────

/**
 * The named export `Toast` is the provider + container bundled.
 * Useful if you want a single import in layout.tsx:
 *
 *   <Toast>
 *     {children}
 *   </Toast>
 */
export function Toast({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  )
}
