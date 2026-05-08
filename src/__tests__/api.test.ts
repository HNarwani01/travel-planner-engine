import { readFileSync } from 'fs'
import { join } from 'path'

import { generateTripPlan, swapTripActivity } from '@/services/gemini.service'
import { cleanJson } from '@/lib/gemini'
import { sanitizeInput } from '@/utils/sanitize'
import { formatCurrency, formatDuration } from '@/utils/formatter'
import { BUDGETS } from '@/constants'

describe('Gemini service', () => {
  it('exports generateTripPlan and swapTripActivity as callable functions', () => {
    expect(typeof generateTripPlan).toBe('function')
    expect(typeof swapTripActivity).toBe('function')
  })

  it('throws when the underlying /api/plan endpoint returns an error payload', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'boom' }),
    })
    global.fetch = fetchMock as unknown as typeof fetch

    await expect(
      generateTripPlan({
        destination: 'Paris',
        duration: 3,
        budget: 'Mid-range',
        interests: ['Food'],
        constraints: [],
      }),
    ).rejects.toThrow('boom')
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/plan',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})

describe('sanitizeInput', () => {
  it('trims surrounding whitespace', () => {
    expect(sanitizeInput('  Tokyo  ')).toBe('Tokyo')
  })

  it('strips angle brackets to neutralise basic HTML/script injection', () => {
    expect(sanitizeInput('<script>alert(1)</script>Bali')).toBe('scriptalert(1)/scriptBali')
  })

  it('returns an empty string for empty / falsy input', () => {
    expect(sanitizeInput('')).toBe('')
    expect(sanitizeInput(undefined as unknown as string)).toBe('')
  })
})

describe('Trip preferences formatting', () => {
  it('formatCurrency converts numeric and string amounts to a string', () => {
    expect(formatCurrency(1500)).toBe('1500')
    expect(formatCurrency('₹2,500')).toBe('₹2,500')
  })

  it('formatDuration pluralises days correctly', () => {
    expect(formatDuration(1)).toBe('1 Day')
    expect(formatDuration(5)).toBe('5 Days')
  })
})

describe('API response parser', () => {
  it('handles valid JSON wrapped in a markdown ```json fence', () => {
    const fenced = '```json\n{"destination":"Bali","matchScore":92}\n```'
    const cleaned = cleanJson(fenced)
    const parsed = JSON.parse(cleaned)
    expect(parsed).toEqual({ destination: 'Bali', matchScore: 92 })
  })

  it('handles valid JSON without code fences', () => {
    const cleaned = cleanJson('{"a":1,"b":2}')
    expect(JSON.parse(cleaned)).toEqual({ a: 1, b: 2 })
  })

  it('handles invalid JSON gracefully (parser throws, caller can recover)', () => {
    const cleaned = cleanJson('```json\nnot really json\n```')
    let caught: unknown = null
    try {
      JSON.parse(cleaned)
    } catch (err) {
      caught = err
    }
    expect(caught).toBeInstanceOf(SyntaxError)
  })
})

describe('Budget options', () => {
  it('exposes a non-empty list of valid string budgets', () => {
    expect(Array.isArray(BUDGETS)).toBe(true)
    expect(BUDGETS.length).toBeGreaterThan(0)
    BUDGETS.forEach((b) => {
      expect(typeof b).toBe('string')
      expect(b.trim().length).toBeGreaterThan(0)
    })
  })

  it('contains the canonical Budget / Mid-range / Luxury tiers', () => {
    expect(BUDGETS).toEqual(expect.arrayContaining(['Budget', 'Mid-range', 'Luxury']))
  })
})

describe('Vibe check questions', () => {
  // Source the data from the actual page module so this stays honest as the page changes.
  const source = readFileSync(
    join(process.cwd(), 'src/app/vibe-check/page.tsx'),
    'utf-8',
  )
  const questionMatches = source.match(/question:\s*['"`]/g) ?? []
  const optionsMatches = source.match(/options:\s*\[/g) ?? []

  it('declares at least the 8 baseline questions', () => {
    expect(questionMatches.length).toBeGreaterThanOrEqual(8)
  })

  it('declares an options array for every question (1:1 parity)', () => {
    expect(optionsMatches).toHaveLength(questionMatches.length)
  })
})

describe('Destination guard before API call', () => {
  // The plan/lucky pages call sanitizeInput on the destination before POSTing.
  // A blank or whitespace-only destination must be rejected.
  it('rejects blank destinations after sanitisation', () => {
    const inputs = ['', '   ', '\t\n  ']
    inputs.forEach((raw) => {
      expect(sanitizeInput(raw)).toBe('')
    })
  })

  it('strips angle brackets from a would-be destination', () => {
    // After sanitisation the caller checks .length > 0; pure-bracket input collapses to empty.
    expect(sanitizeInput('<>')).toBe('')
  })

  it('accepts a real destination after sanitisation', () => {
    const cleaned = sanitizeInput('  Kyoto  ')
    expect(cleaned).toBe('Kyoto')
    expect(cleaned.length).toBeGreaterThan(0)
  })
})
