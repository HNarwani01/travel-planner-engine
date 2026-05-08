import { BUDGETS } from '@/constants';

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Strip HTML tags, script/style blocks, and control characters from arbitrary
 * user text before it is forwarded to the Gemini API. Also caps length at
 * `maxLength` to bound prompt size.
 */
export const sanitizeText = (input: unknown, maxLength = 500): string => {
  if (typeof input !== 'string' || !input) return '';

  return input
    // Drop entire script/style blocks (incl. contents).
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    // Drop any remaining HTML/XML tags.
    .replace(/<\/?[a-z][^>]*>/gi, '')
    // Strip `javascript:` / `data:` URI schemes that could survive tag removal.
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    // Strip ASCII control chars except \t \n \r.
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLength);
};

export interface ValidationResult {
  ok: boolean;
  value: string;
  error?: string;
}

const DESTINATION_PATTERN = /^[A-Za-z0-9 ]+$/;
const DESTINATION_MAX = 100;

/**
 * Validate a user-provided destination: alphanumeric + spaces only,
 * ≤ 100 chars, non-empty after trim.
 */
export const validateDestination = (input: unknown): ValidationResult => {
  if (typeof input !== 'string') {
    return { ok: false, value: '', error: 'Destination must be a string' };
  }
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { ok: false, value: '', error: 'Destination is required' };
  }
  if (trimmed.length > DESTINATION_MAX) {
    return { ok: false, value: '', error: `Destination must be ≤ ${DESTINATION_MAX} characters` };
  }
  if (!DESTINATION_PATTERN.test(trimmed)) {
    return { ok: false, value: '', error: 'Destination may only contain letters, numbers, and spaces' };
  }
  return { ok: true, value: trimmed };
};

/**
 * Validate a budget value against the canonical allowed list.
 */
export const validateBudget = (input: unknown, allowed: readonly string[] = BUDGETS): ValidationResult => {
  if (typeof input !== 'string' || input.length === 0) {
    return { ok: false, value: '', error: 'Budget is required' };
  }
  if (!allowed.includes(input)) {
    return { ok: false, value: '', error: `Budget must be one of: ${allowed.join(', ')}` };
  }
  return { ok: true, value: input };
};
