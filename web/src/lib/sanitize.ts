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

const allowedAttributes: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel", "title", "class"],
  img: ["src", "alt", "title", "width", "height", "class"],
  span: ["class"],
  p: ["class"],
  code: ["class"],
  pre: ["class"],
  h1: ["class"],
  h2: ["class"],
  h3: ["class"],
  h4: ["class"],
  li: ["class"],
  ul: ["class"],
  ol: ["class"],
};

function transformTags(base: sanitizeHtml.IOptions["transformTags"]) {
  const result: NonNullable<sanitizeHtml.IOptions["transformTags"]> = { ...base };
  // Force safe targets on any link that opens in a new tab.
  result.a = (tagName, attribs) => {
    const attrs = { ...attribs };
    if (attrs.target) attrs.target = "_blank";
    if (attrs.target) attrs.rel = "noopener noreferrer nofollow";
    return { tagName, attribs: attrs };
  };
  return result;
}

/*
 * Sanitize untrusted rich-text HTML before it is stored or rendered.
 * Covers the tag set produced by the TipTap rich text editor used across the
 * site (bold/italic/underline/lists/blockquote/headings/links).
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
 * Recursively removes Mongo-DSL-shaped keys (leading "$" or containing ".")
 * from untrusted objects before they are persisted, and bounds the depth and
 * entry count to prevent pathological payloads.
 */
export function sanitizeUntrustedObject(
  value: unknown,
  options: { maxDepth?: number; maxEntries?: number } = {}
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
