# Cache Components Implementation for /programs Page

## ✅ Implementation Complete

This document summarizes the Next.js 16 Cache Components implementation for the `/programs` page, demonstrating hybrid data sources with proper cache invalidation.

---

## Architecture Overview

### Data Sources (Separate Cache Tags)

1. **`programs` collection** — Structured program data (name, slug, code, level, duration, seats, status, intro, eligibility, views)
   - Source of truth for all program-specific data
   - Cache tag: `programs-list` (invalidates when any program changes)
   - Cache tag: `program-{slug}` (invalidates when specific program changes)

2. **`page_content` collection** — Freeform page content (hero, intro, comparison table, CTA)
   - Stores only editable page copy, NOT program data
   - Cache tag: `page-content-programs` (invalidates only when page content changes)
   - Programs are referenced by slug only (no duplication)

### Key Principle: No Data Duplication

The `page_content` collection stores **references** to programs (slugs), not program data itself. The public page composes both sources at render time.

---

## File Structure

### 📁 Cache Layer (Server-Only)
```
src/lib/cache-tags.ts              # Central cache tag registry
src/lib/data/programs.ts           # Cached programs data functions
src/lib/data/page-content.ts       # Cached page content data functions
```

### 📁 Repository Layer
```
src/repositories/programs.repository.ts      # Programs CRUD operations
src/repositories/page-content.repository.ts  # Page content CRUD operations
```

### 📁 Type Definitions
```
src/types/programs.ts              # Program types
src/types/page-content.ts          # Page content types + field schema
```

### 📁 API Routes (Cache Invalidation)
```
src/app/api/admin/pages/programs/route.ts              # PUT - Edit page content
src/app/api/admin/content/programs/[slug]/route.ts    # PATCH/DELETE - Edit programs
```

### 📁 Public Page
```
src/app/(main)/programs/page.tsx          # Server component (fetches both sources)
src/app/(main)/programs/ProgramsClient.tsx # Client component (renders UI)
```

### 📁 Admin UI
```
src/app/admin/pages/programs/page.tsx                    # Server component
src/app/admin/pages/programs/_components/programs-page-editor.tsx  # Editor form
```

### 📁 Database Setup
```
scripts/create-page-content-collection.js  # Creates collection + indexes
```

---

## Cache Invalidation Flow

### Important: revalidateTag vs updateTag

In Next.js 16:
- **Route Handlers** (API routes) must use `revalidateTag` 
- **Server Actions** can use either `updateTag` or `revalidateTag`

All API routes in this implementation use `revalidateTag`.

### Scenario 1: Admin Edits a Program (e.g., changes seats from 48 to 60)

1. **Admin action**: Edit program at `/admin/content/programs/bba`
2. **API**: `PATCH /api/admin/content/programs/bba`
   ```ts
   await updateProgram(programId, { seats: 60 });
   revalidateTag(CACHE_TAGS.program("bba"));      // Invalidate this program
   revalidateTag(CACHE_TAGS.programsList);         // Invalidate programs list
   ```
3. **Result**: `/programs` page automatically shows new seat count on next request
4. **Page content cache**: NOT invalidated (hero/intro/CTA unchanged)

### Scenario 2: Admin Edits Page Content (e.g., changes hero title)

1. **Admin action**: Edit page content at `/admin/pages/programs`
2. **API**: `PUT /api/admin/pages/programs`
   ```ts
   await upsertPageContent("programs", { hero: { title: "..." } });
   revalidateTag(CACHE_TAGS.pageContent("programs")); // Only invalidate page content
   ```
3. **Result**: `/programs` page shows new hero title on next request
4. **Programs cache**: NOT invalidated (program data unchanged)

### Scenario 3: Admin Changes Featured Programs

1. **Admin action**: Select different programs at `/admin/pages/programs`
2. **API**: `PUT /api/admin/pages/programs`
   ```ts
   await upsertPageContent("programs", { 
     featuredProgramRefs: ["bcsit", "bba"] // Removed "bba-finance"
   });
   revalidateTag(CACHE_TAGS.pageContent("programs"));
   ```
3. **Result**: `/programs` page shows only 2 program cards on next request
4. **Programs cache**: NOT invalidated

---

## Field Schema (Editable vs Locked)

The admin editor enforces field permissions both **client-side** (UI) and **server-side** (API):

```ts
// src/types/page-content.ts
export const PROGRAMS_PAGE_SCHEMA = {
  hero: { title: "editable", subtitle: "editable" },
  intro: { heading: "editable", body: "editable" },
  comparisonTable: { heading: "editable", columns: "editable" },
  cta: { heading: "editable", body: "editable", phone: "editable" },
  featuredProgramRefs: "editable", // Can reorder/select programs
} as const;
```

### Admin UI Behavior

**Editable fields** → Render as `<input>` or `<textarea>`
**Locked fields** (program data) → Render as read-only cards with "Edit in /admin/programs" link

### Server-Side Enforcement

The API route strips any locked fields before saving:
```ts
const safeContent = filterEditableFields(body, PROGRAMS_PAGE_SCHEMA);
await upsertPageContent("programs", safeContent);
```

---

## Public Page Rendering

```tsx
// src/app/(main)/programs/page.tsx
export default async function ProgramsPage() {
  // Fetch both sources in parallel (each has its own cache tag)
  const [pageContent, programsData] = await Promise.all([
    getPageContent("programs"),    // Cache tag: page-content-programs
    getProgramsList({ status: "open" }), // Cache tag: programs-list
  ]);

  const content = pageContent?.content || {};
  const programs = programsData.items;

  // Map featured program slugs to actual program objects
  const featuredPrograms = content.featuredProgramRefs
    .map((slug) => programs.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <ProgramsClient
      hero={content.hero}
      intro={content.intro}
      comparisonTable={content.comparisonTable}
      cta={content.cta}
      programs={featuredPrograms}
    />
  );
}
```

---

## Setup Instructions

### 1. Initialize Database Collection

```bash
node scripts/create-page-content-collection.js
```

This will:
- Create `page_content` collection
- Add unique index on `slug`
- Insert default Programs page content

### 2. Test Cache Invalidation

#### Test A: Edit Page Content
1. Visit `/admin/pages/programs`
2. Change hero title to "Our Academic Programs"
3. Click "Save Page Content"
4. Visit `/programs` (public page)
5. ✅ Hero title should reflect the change

#### Test B: Edit Program Data
1. Visit `/admin/content/programs`
2. Edit BBA program (e.g., change seats from 48 to 50)
3. Click "Save"
4. Visit `/programs` (public page)
5. ✅ BBA card should show 50 seats

#### Test C: Change Featured Programs
1. Visit `/admin/pages/programs`
2. Uncheck "BBA-Finance" in Featured Programs section
3. Click "Save Page Content"
4. Visit `/programs` (public page)
5. ✅ Only 2 program cards should display

---

## Cache Tags Reference

| Cache Tag | Invalidated When | Affects |
|-----------|------------------|---------|
| `programs-list` | Any program created/updated/deleted | `/programs` page (program cards, comparison table) |
| `program-{slug}` | Specific program updated | Individual program detail pages (future) |
| `page-content-programs` | Page content edited at `/admin/pages/programs` | `/programs` page (hero, intro, CTA) |

---

## Cache Profiles (next.config.ts)

```ts
cacheLife: {
  content: {
    stale: 60 * 5,        // 5 minutes
    revalidate: 60 * 15,  // 15 minutes
    expire: 60 * 60 * 24, // 1 day
  },
}
```

Both data sources use the `"content"` profile.

---

## Security Checklist

✅ **No data duplication** — Programs are referenced by slug, not copied into page_content  
✅ **Field locking enforced** — Admin UI shows program fields as read-only  
✅ **Server-side validation** — API strips locked fields via `filterEditableFields()`  
✅ **Proper cache invalidation** — Separate tags for programs vs page content  
✅ **Role-based access** — API routes require admin/editor roles  

---

## Extension Ideas

### Add Program Coordinators to CMS
Currently hardcoded in `ProgramsClient.tsx`. Could be:
- Added to `Program` type with `coordinator` field
- Or stored in `page_content` with `coordinators: [...]`

### Add Views Tracking
The `views` field exists in the `Program` type. Implement as:
```ts
// Uncached direct write (do NOT wrap in 'use cache')
export async function incrementProgramViews(slug: string) {
  await db.collection("programs").updateOne(
    { slug },
    { $inc: { views: 1 } }
  );
  // Do NOT call updateTag — views don't need to bust cache
}
```

### Add More Page Content Sections
1. Update `PROGRAMS_PAGE_SCHEMA` in `src/types/page-content.ts`
2. Add fields to admin form in `programs-page-editor.tsx`
3. Use in `ProgramsClient.tsx`

---

## Troubleshooting

### Page content not updating after save
- Check browser console for API errors
- Verify `updateTag(CACHE_TAGS.pageContent("programs"))` is called in API route
- Clear Next.js cache: delete `.next` folder and restart dev server

### Program data not updating after edit
- Check that `/api/admin/content/programs/[slug]` calls `updateTag(CACHE_TAGS.programsList)`
- Verify programs repository returns updated data

### Featured programs not appearing
- Check `featuredProgramRefs` in database (should be array of slugs)
- Verify programs exist with matching slugs in `programs` collection
- Check console for errors in `getProgramsList()`

---

## Related Documentation

- [Next.js 16 Cache Components](https://nextjs.org/docs/app/building-your-application/caching)
- [updateTag API Reference](https://nextjs.org/docs/app/api-reference/functions/updateTag)
- [cacheLife Configuration](https://nextjs.org/docs/app/api-reference/next-config-js/cacheLife)

---

**Status**: ✅ Implementation Complete  
**Date**: 2026-08-30  
**Next.js Version**: 16.3.2
