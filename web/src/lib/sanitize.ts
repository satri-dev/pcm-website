// src/lib/sanitize.ts
// Shared helpers to sanitize URLs from database records that may contain
// placeholder/test data instead of valid image paths.

const FALLBACK = "/images/hero-1.jpg";

export function safeImg(src: string | undefined | null, fallback = FALLBACK): string {
  if (!src || typeof src !== "string") return fallback;
  const s = src.trim();
  if (!s || (!s.startsWith("/") && !s.startsWith("http"))) return fallback;
  return s;
}

export function safeHref(href: string | undefined | null, fallback = "/"): string {
  if (!href || typeof href !== "string") return fallback;
  const s = href.trim();
  if (!s || (!s.startsWith("/") && !s.startsWith("http"))) return fallback;
  return s;
}

/**
 * Caps a string to a maximum length. Returns empty string if value is falsy.
 */
export function capString(value: string, maxLength: number): string {
  if (!value) return "";
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

/**
 * Basic HTML sanitization - strips script tags and dangerous attributes.
 * For production, consider using a library like DOMPurify on the server.
 */
export function sanitizeHtmlContent(html: string): string {
  if (!html || typeof html !== "string") return "";
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  
  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "");
  
  return sanitized.trim();
}

/**
 * Options for sanitizing untrusted objects.
 */
export interface SanitizeOptions {
  /** Maximum recursion depth (default: 10) */
  maxDepth?: number;
  /** Maximum number of entries in arrays/objects (default: 100) */
  maxEntries?: number;
  /** Maximum string length (default: 10000) */
  maxStringLength?: number;
}

/**
 * Recursively sanitizes an untrusted object by capping all string values.
 * Useful for handling user-submitted JSON data.
 */
export function sanitizeUntrustedObject(
  obj: unknown,
  options: number | SanitizeOptions = 10000,
  currentDepth = 0
): unknown {
  // Normalize options
  const opts: Required<SanitizeOptions> = typeof options === "number"
    ? { maxDepth: 10, maxEntries: 100, maxStringLength: options }
    : {
        maxDepth: options.maxDepth ?? 10,
        maxEntries: options.maxEntries ?? 100,
        maxStringLength: options.maxStringLength ?? 10000,
      };

  // Guard against deep recursion
  if (currentDepth >= opts.maxDepth) {
    return undefined;
  }

  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === "string") {
    return capString(obj, opts.maxStringLength);
  }
  
  if (typeof obj === "number" || typeof obj === "boolean") {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj
      .slice(0, opts.maxEntries)
      .map((item) => sanitizeUntrustedObject(item, opts, currentDepth + 1));
  }
  
  if (typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    const entries = Object.entries(obj).slice(0, opts.maxEntries);
    
    for (const [key, value] of entries) {
      const safeKey = capString(key, 200);
      sanitized[safeKey] = sanitizeUntrustedObject(value, opts, currentDepth + 1);
    }
    
    return sanitized;
  }
  
  return obj;
}
