import type { GalleryAlbum, GalleryPhoto } from "../types";

// Albums and photos are now fetched from the backend and adapted server-side
// (see src/feature/gallery/lib/adapt.ts). These arrays are fallbacks used by
// the gallery hook when no server data is supplied.

export const albums: GalleryAlbum[] = [];

export const photos: GalleryPhoto[] = [];

// ── Categories ────────────────────────────────────────────────
// Categories are derived dynamically from the albums in the database rather
// than hardcoded. "all" (show everything) is always listed first, followed by
// each distinct category present in the data, preserving insertion order.

export interface GalleryCategoryOption {
  value: string;
  label: string;
}

export function getCategories(albums: GalleryAlbum[]): GalleryCategoryOption[] {
  const seen = new Set<string>();
  const options: GalleryCategoryOption[] = [{ value: "all", label: "All" }];
  for (const album of albums) {
    const cat = album.category;
    if (cat && !seen.has(cat)) {
      seen.add(cat);
      options.push({ value: cat, label: cat });
    }
  }
  return options;
}
