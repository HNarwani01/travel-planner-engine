/**
 * Wandr UI — Input
 *
 * Usage:
 * <Input type="text" label="Destination" placeholder="Where to?" error="Please enter a destination" />
 * <Input type="password" label="Password" />
 * <Input type="search" label="Search trips" placeholder="Tokyo, Bali…" />
 * <Input type="textarea" label="Notes" placeholder="Any extra info…" />
 * <Input type="select" label="Travel style" options={['Solo', 'Couple', 'Group']} />
 * <Input type="file" label="Upload cover photo" />
 */

'use client'

import React, { useId, useRef, useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

export type InputType = 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'file' | 'search'

export interface SelectOption {
  label: string
  value: string
}

export interface InputProps {
  type?        : InputType
  label?       : string
  placeholder? : string
  value?       : string
  defaultValue?: string
  onChange?    : (value: string) => void
  error?       : string
  disabled?    : boolean
  required?    : boolean
  helperText?  : string
  icon?        : React.ReactNode
  /** For select type */
  options?     : (string | SelectOption)[]
  /** For textarea type */
  rows?        : number
  /** For file type */
  accept?      : string
  multiple?    : boolean
  className?   : string
  name?        : string
  id?          : string
  autoComplete?: string
  maxLength?   : number
}

// ─── Shared style helpers ────────────────────────────────────────────────────

const fieldBase =
  'w-full bg-[#1E1E2E] text-white placeholder-[#8B8B9E] ' +
  'border border-[#2E2E3E] rounded-[12px] ' +
  'transition-all duration-200 ' +
  'focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.18)] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'text-base leading-relaxed'

const fieldError  = 'border-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.18)]'
const fieldNormal = 'border-[#2E2E3E]'

// ─── Sub-components ──────────────────────────────────────────────────────────

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-[#8B8B9E] mb-1.5 uppercase tracking-wide">
      {children}
      {required && <span className="text-[#EF4444] ml-1">*</span>}
    </label>
  )
}

function HelperText({ error, helperText }: { error?: string; helperText?: string }) {
  if (!error && !helperText) return null
  return (
    <p className={`mt-1.5 text-xs ${error ? 'text-[#EF4444]' : 'text-[#8B8B9E]'}`} role={error ? 'alert' : undefined}>
      {error ?? helperText}
    </p>
  )
}

// ─── Text / Email / Number input ─────────────────────────────────────────────

function TextInput({ id, type = 'text', placeholder, value, defaultValue, onChange, error, disabled, required, icon, name, autoComplete, maxLength }: InputProps & { id: string }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B9E] pointer-events-none">
          {icon}
        </span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${fieldBase} ${error ? fieldError : fieldNormal} py-4 ${icon ? 'pl-9 pr-4' : 'px-4'}`}
      />
    </div>
  )
}

// ─── Search input ─────────────────────────────────────────────────────────────

function SearchInput(props: InputProps & { id: string }) {
  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
  return <TextInput {...props} type="text" icon={props.icon ?? <SearchIcon />} />
}

// ─── Password input ───────────────────────────────────────────────────────────

function PasswordInput({ id, placeholder, value, defaultValue, onChange, error, disabled, required, name, autoComplete }: InputProps & { id: string }) {
  const [show, setShow] = useState(false)

  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  )

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        placeholder={placeholder ?? '••••••••'}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete ?? 'current-password'}
        aria-invalid={!!error}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${fieldBase} ${error ? fieldError : fieldNormal} py-4 pl-4 pr-10`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B9E] hover:text-white transition-colors"
      >
        <EyeIcon />
      </button>
    </div>
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

function TextareaInput({ id, placeholder, value, defaultValue, onChange, error, disabled, required, rows = 4, name, maxLength }: InputProps & { id: string }) {
  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      required={required}
      rows={rows}
      maxLength={maxLength}
      aria-invalid={!!error}
      onChange={(e) => onChange?.(e.target.value)}
      className={`${fieldBase} ${error ? fieldError : fieldNormal} py-3 px-4 resize-y min-h-[96px]`}
    />
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────

function SelectInput({ id, placeholder, value, defaultValue, onChange, error, disabled, required, options = [], name }: InputProps & { id: string }) {
  const normalised: SelectOption[] = options.map((o) =>
    typeof o === 'string' ? { label: o, value: o } : o
  )

  const ChevronIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )

  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${fieldBase} ${error ? fieldError : fieldNormal} py-4 pl-4 pr-10 appearance-none cursor-pointer`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {normalised.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#13131A]">
            {o.label}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B9E] pointer-events-none">
        <ChevronIcon />
      </span>
    </div>
  )
}

// ─── File / Drag-and-drop ─────────────────────────────────────────────────────

function FileInput({ id, onChange, error, disabled, accept, multiple, name }: InputProps & { id: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const names = Array.from(files).map((f) => f.name).join(', ')
    setFileName(names)
    onChange?.(names)
  }

  const UploadIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-[#6C63FF]">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  )

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="File upload area"
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled) handleFiles(e.dataTransfer.files) }}
      className={[
        'w-full rounded-[12px] border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200',
        dragging ? 'border-[#6C63FF] bg-[rgba(108,99,255,0.08)]' : error ? 'border-[#EF4444]' : 'border-[#1E1E2E]',
        'hover:border-[#6C63FF] hover:bg-[rgba(108,99,255,0.05)]',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
    >
      <UploadIcon />
      {fileName ? (
        <p className="text-sm text-white">{fileName}</p>
      ) : (
        <>
          <p className="text-sm text-white font-medium">Drop files here or <span className="text-[#6C63FF]">browse</span></p>
          <p className="text-xs text-[#8B8B9E] mt-1">{accept ? `Accepted: ${accept}` : 'Any file type'}</p>
        </>
      )}
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export const Input = React.forwardRef<HTMLDivElement, InputProps>(
  (
    {
      type        = 'text',
      label,
      placeholder,
      value,
      defaultValue,
      onChange,
      error,
      disabled    = false,
      required    = false,
      helperText,
      icon,
      options,
      rows,
      accept,
      multiple,
      className   = '',
      name,
      id: idProp,
      autoComplete,
      maxLength,
    },
    ref
  ) => {
    const generatedId = useId()
    const id = idProp ?? generatedId

    const sharedProps: InputProps & { id: string } = {
      id, type, placeholder, value, defaultValue, onChange,
      error, disabled, required, icon, options, rows, accept,
      multiple, name, autoComplete, maxLength,
    }

    const renderInput = () => {
      switch (type) {
        case 'password': return <PasswordInput {...sharedProps} />
        case 'textarea': return <TextareaInput {...sharedProps} />
        case 'select':   return <SelectInput {...sharedProps} />
        case 'file':     return <FileInput {...sharedProps} />
        case 'search':   return <SearchInput {...sharedProps} />
        default:         return <TextInput {...sharedProps} />
      }
    }

    return (
      <div ref={ref} className={`w-full ${className}`}>
        {label && <Label htmlFor={id} required={required}>{label}</Label>}
        {renderInput()}
        <HelperText error={error} helperText={helperText} />
      </div>
    )
  }
)

Input.displayName = 'Input'
