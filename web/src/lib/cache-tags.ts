// src/lib/cache-tags.ts
// Shared cache tag constants. The fetch side (lib/data) and the
// invalidation side (admin API routes) must never drift apart — always
// reference these constants instead of duplicating string literals.

export const CACHE_TAGS = {
  navMenu: "nav-menu",
} as const;