# Prompt: Production-Grade Performance & Architecture Audit for a Next.js 16 College Website

## Context

I have a **production Next.js 16+ (App Router)** college website. It functions as both frontend and backend (Server Actions / Route Handlers talk directly to the database — no separate API layer). Almost all content is dynamic and DB-driven: navigation, footer, page bodies, admissions info, department pages, announcements, etc. Content is edited through an admin panel.

Implement the Cache Components model: `cacheComponents: true`, `'use cache'`, `cacheLife`, `cacheTag`, and `updateTag` for granular caching and invalidation, as described in a prior architecture prompt.

## Goal

Do a full production-readiness pass using the **latest and most advanced Next.js 16 concepts**, not just caching. Treat this as a senior-engineer audit of the whole app — correctness, performance, resilience, and SEO — and implement fixes directly. Work through every section below, and don't skip a section just because it "looks fine" — verify it.

---

## 1. Caching & Rendering (Cache Components / PPR / ISR)

- Confirm `cacheComponents: true` is set and there are no leftover `export const dynamic = 'force-dynamic'` or `experimental_ppr` flags (these are obsolete in 16 — PPR is default under Cache Components).
- Audit every data-fetching function: does it have `'use cache'` where it should, with a correctly scoped `cacheTag` and an appropriate `cacheLife` profile (not everything should share one default)?
- For any route with dynamic segments (`/departments/[slug]`, `/programs/[slug]`, etc.), implement `generateStaticParams` for the high-traffic/known slugs so those get full ISR-style prerendering, while unlisted slugs fall back to the instant App Shell and self-upgrade.
- Find every place `cookies()` or `headers()` might be getting called inside a `'use cache'` scope (this silently forces the whole tree dynamic) — move those reads outside cached functions and pass values as arguments.
- Verify no page unexpectedly shows as fully dynamic (`λ`) in the build output when it should be static (`○`) or partial (`◐`). For each unexpected dynamic route, find and fix the uncached/unsuspended data access causing it.
- Ensure every genuinely per-request/personalized piece (logged-in state, live seat counts, real-time notices) is isolated in its own component wrapped in `<Suspense>` with a real skeleton fallback — not blocking the shell.

## 2. Data layer & invalidation integrity

- Confirm every admin Server Action that writes to the DB calls `updateTag` with the exact tag(s) affected, using shared tag constants (no duplicated string literals between fetch and invalidation sites).
- Check for orphaned tags (tagged data that's never invalidated anywhere) and over-broad tags (one tag covering unrelated entities, forcing unnecessary cache wipes).
- Add optimistic UI or at least immediate feedback in the admin panel so editors aren't left wondering if a save "took."

## 3. Rendering boundaries & streaming

- Confirm `loading.tsx` exists at meaningful route segments, not just the root.
- Confirm Suspense boundaries are placed close to the actual dynamic data, not wrapped around entire pages (which would negate the static shell benefit).
- Use `error.tsx` and `global-error.tsx` at appropriate segment levels so one broken widget (e.g. a DB timeout on a "latest news" section) doesn't take down the whole page.

## 4. Build & tooling

- Confirm Turbopack is the active build/dev bundler (default in 16) — flag if the project is still on Webpack for any reason and note the tradeoff.
- Run a production build and report the route-by-row static/partial/dynamic breakdown so I can see exactly what's cached vs not.

## 5. Images, fonts, and static assets

- Confirm all images go through `next/image` with correct `sizes`, and that above-the-fold images (hero banners, etc.) use `priority`.
- Confirm fonts are loaded via `next/font` (self-hosted, zero layout shift) rather than external `<link>` tags to Google Fonts.
- Confirm any admin-uploaded images (logos, staff photos, banners) are served through an optimized path, not raw unoptimized URLs.

## 6. Metadata & SEO

- Implement the Metadata API (`generateMetadata`) per route for title/description/OpenGraph, pulling from the same DB content where relevant — don't hardcode metadata for dynamic pages.
- Confirm a `sitemap.ts` and `robots.ts` exist and are generated dynamically from the DB-driven page list, not hand-maintained.
- Confirm canonical URLs and structured data (e.g. `EducationalOrganization` JSON-LD) are present for the college's key pages.

## 7. Security & admin-panel hardening

- Confirm admin routes are protected by middleware-level auth checks (not just page-level checks that can be bypassed).
- Confirm Server Actions that mutate data validate/authorize the caller server-side, never trusting client state.
- Add basic rate limiting on public-facing forms (admissions inquiry, contact forms) to prevent abuse.
- Confirm sensible security headers (CSP, X-Frame-Options, etc.) are set, e.g. via `next.config.ts` headers or middleware.

## 8. Observability

- Add lightweight logging or metrics around cache hit/miss on key data-fetching functions so I can verify in production that the DB isn't being hit on every request.
- Recommend (don't necessarily implement unless I confirm) a real monitoring setup — e.g. Vercel Analytics/Speed Insights or an equivalent — for Core Web Vitals tracking in production.

## 9. Final report

At the end, give me:
1. A route-by-route table: static / partial / dynamic status, and why.
2. A list of every cache tag, its `cacheLife`, and where it's invalidated.
3. A short prioritized list of anything found that's still a performance or correctness risk, ranked by impact.

Ask me before making structural changes to the DB schema or admin-panel auth flow — flag issues there rather than silently rewriting them.
