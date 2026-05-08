/**
 * Component tests are kept in a `.ts` file (per task spec), so JSX is expressed
 * via `React.createElement` to satisfy the TypeScript compiler.
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Loader } from '@/components/ui/Loader'

describe('Button', () => {
  it('renders its children as button text', () => {
    render(React.createElement(Button, null, 'Start Wandering'))
    const btn = screen.getByRole('button', { name: 'Start Wandering' })
    expect(btn).toBeInTheDocument()
    expect(btn.tagName).toBe('BUTTON')
  })

  it('fires onClick when clicked', () => {
    const onClick = jest.fn()
    render(React.createElement(Button, { onClick }, 'Tap'))
    fireEvent.click(screen.getByRole('button', { name: 'Tap' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled and shows spinner when loading=true', () => {
    render(React.createElement(Button, { loading: true }, 'Saving'))
    const btn = screen.getByRole('button', { name: /saving/i })
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
  })
})

describe('Input', () => {
  it('renders the value passed via the value prop', () => {
    render(
      React.createElement(Input, {
        label: 'Destination',
        value: 'Tokyo',
        onChange: () => undefined,
      }),
    )
    const field = screen.getByLabelText('Destination') as HTMLInputElement
    expect(field).toBeInTheDocument()
    expect(field.value).toBe('Tokyo')
  })

  it('invokes onChange with the new value when the user types', () => {
    const onChange = jest.fn()
    render(
      React.createElement(Input, {
        label: 'Search',
        value: '',
        onChange,
      }),
    )
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'Bali' } })
    expect(onChange).toHaveBeenCalledWith('Bali')
  })
})

describe('Badge', () => {
  it('renders children inside a span', () => {
    render(React.createElement(Badge, { variant: 'primary' }, 'Featured'))
    const badge = screen.getByText('Featured')
    expect(badge.tagName).toBe('SPAN')
  })

  it('applies the primary variant class tokens', () => {
    render(React.createElement(Badge, { variant: 'primary' }, 'Primary'))
    const badge = screen.getByText('Primary')
    // primary variant uses the brand purple #6C63FF for text
    expect(badge.className).toMatch(/text-\[#6C63FF\]/)
    expect(badge.className).toMatch(/rounded-full/)
  })

  it('applies the success variant class tokens', () => {
    render(React.createElement(Badge, { variant: 'success' }, 'OK'))
    const badge = screen.getByText('OK')
    expect(badge.className).toMatch(/text-\[#22C55E\]/)
  })
})

describe('Loader', () => {
  it('shows a status indicator when rendered (loading=true case)', () => {
    render(React.createElement(Loader, { variant: 'spinner', text: 'Loading…' }))
    const status = screen.getByRole('status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveAttribute('aria-label', 'Loading…')
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('renders a fullscreen overlay when fullscreen=true', () => {
    render(React.createElement(Loader, { fullscreen: true, text: 'Checking your vibe...' }))
    const overlay = screen.getByRole('status')
    expect(overlay).toBeInTheDocument()
    expect(overlay.className).toMatch(/fixed/)
    expect(screen.getByText('Checking your vibe...')).toBeInTheDocument()
  })
})
