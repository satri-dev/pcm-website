// src/lib/cache-tags.ts
// Shared cache tag constants. The fetch side (lib/data) and the
// invalidation side (admin API routes) must never drift apart — always
// reference these constants instead of duplicating string literals.

export const CACHE_TAGS = {
  navMenu: "nav-menu",
  pageContent: "page-content",
  about: "about",
  homepage: "homepage",
} as const;

// Per-slug tag so an edit to one page only invalidates its own cache
// entries, while the shared "page-content" tag covers bulk invalidation.
export function pageContentTag(slug: string): string {
  return `page-content:${slug}`;
}
