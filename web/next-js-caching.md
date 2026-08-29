# Prompt: Implement Dynamic-Content Caching Architecture for a Next.js 16 College Website

## Context

I am building a **production college website** in **Next.js 16+ (App Router)**, used as both frontend and backend (Server Actions / Route Handlers hitting our database directly — no separate API layer).

Almost nothing on this site is hardcoded. Every piece of content is dynamic and DB-driven, including:
- Header/navigation menu items
- Footer menu + footer content (links, contact info, social links)
- About Us page text and all other static-looking pages (admissions, programs, departments, etc.)
- Any other section normally treated as "static" in most websites

Content is managed through an admin panel that writes directly to the database. Because everything is dynamic, hitting the database on every single request for every piece of content (including nav/footer, which barely change) is unacceptable for performance at production scale.

## Goal

Implement Next.js 16's **Cache Components** model (`cacheComponents: true`) using `'use cache'`, `cacheLife`, `cacheTag`, and `updateTag` so that:

1. Nothing hits the database on every request unnecessarily.
2. Rarely-changing content (nav, footer) is cached aggressively and long-lived.
3. Frequently-edited content (page bodies, announcements) is cached with shorter lifetimes.
4. When an admin edits content, the relevant cached data is invalidated **immediately** (read-your-writes) via `updateTag`, without a manual redeploy or waiting for TTL expiry.
5. Pages still render as fast, near-static shells using Partial Prerendering (PPR), streaming in any genuinely dynamic parts.

## Requirements — implement all of the following

### 1. Enable Cache Components
- Update `next.config.ts` to set `cacheComponents: true`.
- Remove any leftover `export const dynamic = 'force-dynamic'` flags — caching should be controlled purely by presence/absence of `'use cache'`.

### 2. Centralized data-access layer
- Create a `lib/data/` (or equivalent) directory where **every DB read used in rendering** is wrapped in its own async function with `'use cache'` at the top.
- Each function must declare an explicit `cacheTag(...)` and `cacheLife(...)`.
- Do NOT put `'use cache'` at the page or layout level broadly — apply it at the individual function/component level for granular control, per Next.js 16 guidance.
- Example shape to follow:
```ts
export async function getNavMenu() {
  'use cache'
  cacheTag('nav-menu')
  cacheLife('rarely')
  return db.menu.findMany({ where: { location: 'header' } })
}
```

### 3. Custom cache lifetime profiles
In `next.config.ts`, define at least these profiles (adjust names/values as sensible for a college site):
- `rarely` — for nav, footer, site settings (long stale/revalidate/expire windows, e.g. hours-to-days)
- `content` — for page bodies like About, Admissions, Programs (shorter windows, e.g. minutes)
- `frequent` — for anything closer to real-time (announcements, event listings), if applicable

### 4. Tag discipline
- One tag per logical entity, scoped as narrowly as what actually changes (e.g. `nav-menu`, `footer-content`, `page:about`, `page:admissions`, `department:<slug>`).
- Never share one broad tag across unrelated entities — that forces over-invalidation.
- Keep tag name constants in a single shared file (e.g. `lib/cache-tags.ts`) so the fetch side and the invalidation side can never drift out of sync (no magic strings duplicated across files).

### 5. Admin-side invalidation via Server Actions
- Every admin "save" action that writes to the DB must call `updateTag(<the exact tag(s) affected>)` immediately after the write succeeds, using the shared tag constants from step 4.
- Use `updateTag` (not the older `revalidateTag`/`revalidatePath`) since it's the current stable primitive for this model and provides read-your-writes.
- Example:
```ts
'use server'
import { updateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export async function updateNavMenu(data: NavMenuInput) {
  await db.menu.update({ /* ... */ })
  updateTag(CACHE_TAGS.navMenu)
}
```

### 6. Avoid the dynamic-API cache-busting trap
- Never call `cookies()` or `headers()` inside a `'use cache'` scope — read them outside the cached function and pass values in as plain arguments if needed.
- Audit for any accidental use of request-time APIs inside cached functions.

### 7. Partial Prerendering
- Structure layouts/pages so the static shell (cached nav, footer, layout chrome) prerenders instantly, and any genuinely per-request dynamic content (e.g., a logged-in user widget, live seat-availability counter) is wrapped in `<Suspense>` and streams in separately.
- Do not force whole pages dynamic just because one small section needs to be.

### 8. Verification / self-check before finishing
- Confirm the DB is only queried on cache miss / after explicit invalidation — verify with logging or dev-mode cache hit/miss output.
- Confirm editing content in the admin panel reflects immediately on the live site (read-your-writes) without a full redeploy.
- Confirm nav/footer are not being refetched from DB on every navigation.
- List out every cache tag created and where it's invalidated, so I can audit for orphaned tags (a fetch with a tag that's never invalidated anywhere) or over-broad tags (invalidating more than necessary).

## Deliverables

1. Updated `next.config.ts` with `cacheComponents: true` and custom `cacheLife` profiles.
2. `lib/cache-tags.ts` with all tag constants.
3. `lib/data/` (or your equivalent) with every content-fetching function properly cached and tagged.
4. Updated Server Actions for the admin panel that call `updateTag` after each write.
5. A short summary at the end listing: every cache tag, its `cacheLife` profile, which function produces it, and which action(s) invalidate it.

Ask me clarifying questions about my current DB schema, ORM, and admin-panel structure before making changes if anything above is ambiguous — don't guess at table/field names.
