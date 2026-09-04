// In-memory, per-client-IP token bucket for the PayPal edge routes. This
// process runs as a single Node server (no edge/serverless fan-out here),
// so a module-level map is a real, persistent limiter for it — it would
// need to move to a shared store (e.g. Redis) if this ever ran as more
// than one instance, since each instance would otherwise count separately.

interface Bucket {
  tokens: number;
  lastRefill: number;
}

interface RateLimitRule {
  capacity: number;
  refillMs: number;
}

const buckets = new Map<string, Bucket>();

export const RATE_LIMIT_RULES = {
  // Only ever creates a PayPal order after re-pricing server-side — capped
  // mainly to stop it being used to hammer our own backend/PayPal quota.
  createOrder: { capacity: 10, refillMs: 60_000 },
  // Moves real money — the tightest limit of the three.
  captureOrder: { capacity: 5, refillMs: 60_000 },
  // Unauthenticated, calls PayPal's own token endpoint on every checkout
  // page load — the easiest of the three to burn quota on.
  clientToken: { capacity: 15, refillMs: 60_000 },
} as const satisfies Record<string, RateLimitRule>;

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}

export function checkRateLimit(key: string, rule: RateLimitRule): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: rule.capacity, lastRefill: now };

  const elapsedMs = now - bucket.lastRefill;
  const refilled = (elapsedMs / rule.refillMs) * rule.capacity;
  bucket.tokens = Math.min(rule.capacity, bucket.tokens + refilled);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    return false;
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return true;
}

export function rateLimitResponse() {
  return Response.json(
    { error: "Too many requests. Please slow down and try again shortly." },
    { status: 429 }
  );
}
