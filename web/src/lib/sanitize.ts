// src/lib/sanitize.ts
// Shared helpers to sanitize URLs from database records that may contain
// placeholder/test data instead of valid image paths.

import sanitizeHtml from "sanitize-html";

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

const baseAllowedTags = [
  "p",
  "br",
  "hr",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "blockquote",
  "pre",
  "code",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "span",
  "img",
];

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
export function sanitizeHtmlContent(html: unknown): string {
  if (typeof html !== "string" || html.length === 0) return typeof html === "string" ? html : "";
  return sanitizeHtml(html, {
    allowedTags: baseAllowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    disallowedTagsMode: "discard",
    transformTags: transformTags({}),
    allowVulnerableTags: false,
  });
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
  const { maxDepth = 5, maxEntries = 300 } = options;
  function clean(v: unknown, depth: number, budget: { left: number }): unknown {
    if (depth > maxDepth || budget.left <= 0) {
      if (typeof v === "string") return v.slice(0, 10_000);
      return undefined;
    }
    if (Array.isArray(v)) {
      const out: unknown[] = [];
      for (const item of v) {
        if (budget.left <= 0) break;
        budget.left -= 1;
        const cleaned = clean(item, depth + 1, budget);
        if (cleaned !== undefined && cleaned !== null) out.push(cleaned);
      }
      return out;
    }
    if (v && typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(v as Record<string, unknown>)) {
        if (budget.left <= 0) break;
        if (key.startsWith("$") || key.includes(".")) continue;
        budget.left -= 1;
        const cleaned = clean(val, depth + 1, budget);
        if (cleaned !== undefined) out[key] = cleaned;
      }
      return out;
    }
    if (typeof v === "string") return v.slice(0, 100_000);
    return v;
  }
  const budget = { left: maxEntries };
  return clean(value, 0, budget);
}

/**
 * Bound + shape-check an untrusted text value.
 */
export function capString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLength);
}
