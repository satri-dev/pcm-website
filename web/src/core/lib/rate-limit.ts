import { NextRequest, NextResponse } from "next/server";

interface RateLimitRule {
  limit: number;
  windowMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

// In-memory sliding-window limiter. Suitable for single-instance deployments;
// for multi-instance setups swap this for a shared store (Redis, etc.).
const store = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

function clientKey(req: NextRequest | Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return ip;
}

function sweep() {
  if (store.size < MAX_BUCKETS) return;
  const now = Date.now();
  for (const [key, bucket] of store) {
    if (bucket.resetAt < now) store.delete(key);
  }
}

/**
 * In-memory rate limiter. Returns a 429 response when the limit is exceeded,
 * or null when the request is allowed to proceed.
 */
export function rateLimit(
  request: NextRequest | Request,
  rule: RateLimitRule = { limit: 30, windowMs: 60_000 }
): NextResponse | null {
  const key = clientKey(request);
  const now = Date.now();
  sweep();

  let bucket = store.get(key);
  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + rule.windowMs };
    store.set(key, bucket);
  }

  bucket.count += 1;

  if (bucket.count > rule.limit) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  return null;
}

/**
 * Cross-site request forgery guard. Blocks browser-initiated requests whose
 * Origin does not match the application's own origins. Requests without an
 * Origin header (raw API clients, curl) are allowed through — a hostile page
 * in a victim's browser will always send Origin.
 */
export function assertSameOrigin(request: NextRequest | Request): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  const allowed = new Set(
    [
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.BETTER_AUTH_URL,
    ]
      .filter(Boolean)
      .map((o) => o!.replace(/\/+$/, "").toLowerCase())
  );
  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://localhost:3001");
    allowed.add("http://127.0.0.1:3000");
  }

  if (!allowed.has(origin.replace(/\/+$/, "").toLowerCase())) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Convenience guard applying both CSRF origin check and rate limiting.
 * Returns an error response (403/429) or null to continue.
 */
export function guardPublicWrite(
  request: NextRequest | Request,
  rule?: RateLimitRule
): NextResponse | null {
  return assertSameOrigin(request) ?? rateLimit(request, rule);
}

export function resetRateLimitStore() {
  store.clear();
}