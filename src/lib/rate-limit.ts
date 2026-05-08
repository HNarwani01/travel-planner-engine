/**
 * Lightweight in-memory rate limiter.
 *
 * Per-process Map keyed by client IP. Suitable for a single Next.js instance
 * (the standalone build runs one Node process); for multi-instance deploys
 * swap this for Redis or @upstash/ratelimit.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const buckets = new Map<string, Bucket>();

// Periodic sweep so the Map can't grow unbounded under churn.
let sweepTimer: ReturnType<typeof setInterval> | null = null;
const ensureSweep = () => {
  if (sweepTimer) return;
  sweepTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, WINDOW_MS);
  // Don't keep the event loop alive purely for sweeping.
  if (typeof sweepTimer === 'object' && sweepTimer && 'unref' in sweepTimer) {
    (sweepTimer as { unref: () => void }).unref();
  }
};

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  retryAfterSec: number;
}

export const getClientIp = (req: Request): string => {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
};

export const rateLimit = (
  ip: string,
  limit: number = MAX_REQUESTS,
  windowMs: number = WINDOW_MS,
): RateLimitResult => {
  ensureSweep();
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    const fresh: Bucket = { count: 1, resetAt: now + windowMs };
    buckets.set(ip, fresh);
    return {
      ok: true,
      remaining: limit - 1,
      limit,
      resetAt: fresh.resetAt,
      retryAfterSec: Math.ceil(windowMs / 1000),
    };
  }

  bucket.count += 1;
  const ok = bucket.count <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - bucket.count),
    limit,
    resetAt: bucket.resetAt,
    retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
  };
};

/** Test-only: clear the bucket store between cases. */
export const __resetRateLimitForTests = () => {
  buckets.clear();
};
