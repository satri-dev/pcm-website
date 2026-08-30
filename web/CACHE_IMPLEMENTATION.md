# Cache Components Implementation for /programs Page

## ✅ Implementation Status

### Completed:
1. **Cache Tags Helper** (`src/lib/cache-tags.ts`) - Central registry for all cache tags
2. **Types** (`src/types/page-content.ts`) - PageContent types with field schemas
3. **Repository** (`src/repositories/page-content.repository.ts`) - DB access for page_content
4. **Cached Data Layer** 
   - `src/lib/data/programs.ts` - Cached program queries
   - `src/lib/data/page-content.ts` - Cached page content queries
5. **Public Page** (`src/app/programs/page.tsx`) - Hybrid data composition
6. **Page Components** - Hero, IntroSection, ProgramCards, ComparisonTable, CTASection
7. **API Routes**
   - `src/app/api/admin/pages/[slug]/route.ts` - Page content CRUD with field filtering
   - `src/app/api/admin/content/programs/route.ts` - Programs list API
   - `src/app/api/admin/content/programs/[slug]/route.ts` - Individual program API
8. **Database Script** (`scripts/create-page-content-collection.js`) - Initialize collection

### To Complete:
- Admin UI for editing Programs page content (with locked/editable field distinction)
- Programs admin form enhancements (if needed)

## Data Architecture

### Two Separate Collections:

**1. `programs` Collection (Source of Truth)**
```typescript
{
  name, slug, code, level, duration, seats, status,
  image, intro, eligibility, views, createdAt, updatedAt
}
```

**2. `page_content` Collection (CMS Blocks)**
```typescript
{
  slug: "programs",
  content: {
    hero: { title, subtitle },
    intro: { heading, body },
    comparisonTable: { heading, columns },
    cta: { heading, body, phone },
    featuredProgramRefs: ["bcsit", "bba", "bba-finance"] // REFERENCES ONLY
  }
}
```

## Cache Tag Strategy

| Tag | Triggers Invalidation | Usage |
|-----|----------------------|-------|
| `programs-list` | Any program CRUD | `/programs` page (program cards/table) |
| `program-${slug}` | Update/delete specific program | Individual program pages |
| `page-content-programs` | Edit Programs page copy | `/programs` hero/intro/CTA/table labels |

**Key Principle**: Programs and page_content have SEPARATE cache tags. Editing a program never needs to touch page_content cache, and vice versa.

## Field Schema & Security

### Editable Fields (can be updated via page-content API):
- `hero.title`, `hero.subtitle`
- `intro.heading`, `intro.body`
- `comparisonTable.heading`, `comparisonTable.columns`
- `cta.heading`, `cta.body`, `cta.phone`
- `featuredProgramRefs` (array of slugs)

### Locked Fields (redirect to `/admin/programs/[slug]/edit`):
- NONE in page_content (all program data comes from programs collection)

### Server-Side Protection:
```typescript
// In PUT /api/admin/pages/[slug]
const filteredContent = filterEditableFields(body, PROGRAMS_PAGE_SCHEMA);
await upsertPageContent(slug, filteredContent);
```

## Cache Invalidation Flow

### Scenario 1: Admin edits program (name, seats, status, etc.)
```
PATCH /api/admin/content/programs/{slug}
  → updateTag(CACHE_TAGS.program(slug))
  → updateTag(CACHE_TAGS.programsList)
  
Result: /programs page auto-refreshes program data on next visit
```

### Scenario 2: Admin edits page copy (hero text, CTA, etc.)
```
PUT /api/admin/pages/programs
  → updateTag(CACHE_TAGS.pageContent("programs"))
  
Result: /programs page refreshes hero/intro/CTA text only
```

### Scenario 3: Admin reorders featured programs
```
PUT /api/admin/pages/programs
  → body: { featuredProgramRefs: ["bba", "bcsit", "bba-finance"] }
  → updateTag(CACHE_TAGS.pageContent("programs"))
  
Result: /programs page re-fetches content, maps slugs to programs, new order appears
```

## Validation Checklist

- [x] `page_content` documents store ONLY slug references, never program fields
- [x] Cached data functions use `"use cache"`, `cacheLife()`, `cacheTag()`
- [x] API routes call `updateTag()` after mutations
- [x] `filterEditableFields()` enforces schema server-side
- [ ] Admin UI renders program fields as read-only with redirect links
- [ ] Admin UI allows editing page copy fields inline
- [ ] Views increments bypass cache (direct uncached write)

## File Structure

```
web/
├── src/
│   ├── lib/
│   │   ├── cache-tags.ts          ✅ Cache tag registry
│   │   └── data/
│   │       ├── programs.ts         ✅ Cached program queries
│   │       └── page-content.ts     ✅ Cached content queries
│   ├── types/
│   │   ├── programs.ts             ✅ Existing
│   │   └── page-content.ts         ✅ New schemas
│   ├── repositories/
│   │   ├── programs.repository.ts  ✅ Existing
│   │   └── page-content.repository.ts ✅ New
│   ├── app/
│   │   ├── programs/
│   │   │   ├── page.tsx            ✅ Public page (hybrid data)
│   │   │   └── _components/        ✅ Hero, ProgramCards, etc.
│   │   ├── admin/
│   │   │   └── pages/
│   │   │       └── programs/       ⏳ TO DO
│   │   │           └── page.tsx
│   │   └── api/
│   │       └── admin/
│   │           ├── pages/
│   │           │   └── [slug]/
│   │           │       └── route.ts ✅ Page content CRUD
│   │           └── content/
│   │               └── programs/
│   │                   ├── route.ts        ✅ Programs list
│   │                   └── [slug]/route.ts ✅ Program CRUD
└── scripts/
    ├── create-programs-collection.js       ✅ Existing
    └── create-page-content-collection.js   ✅ New
```

## Next Steps

1. Create `/admin/pages/programs` editor UI
2. Implement field locking (show program data as read-only preview)
3. Add "Edit in /admin/programs/{slug}" redirect links
4. Test cache invalidation end-to-end
5. Add views increment as uncached direct write

## Usage Example

```typescript
// Public page automatically composes both sources
const [content, programs] = await Promise.all([
  getProgramsPageContent(),  // "use cache", tag: page-content-programs
  getProgramsList(),          // "use cache", tag: programs-list
]);

// Resolve featured programs by reference
const featured = content.featuredProgramRefs
  .map(slug => programs.find(p => p.slug === slug))
  .filter(Boolean);

return (
  <>
    <Hero {...content.hero} />           {/* From page_content */}
    <ProgramCards programs={featured} /> {/* From programs */}
  </>
);
```
