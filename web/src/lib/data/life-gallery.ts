// src/lib/data/life-gallery.ts
// Server-side data access for the photo strip on the public /life page.
// Returns the latest few photos (photo-only gallery items, videos excluded).
// Cached with the galleryList tag and invalidated from the admin media/gallery
// API routes. Only the portfolio of photo *items* is read here so that videos
// never leak onto the life page.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listGallery } from "@/repositories/gallery.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export interface LifeGalleryPhoto {
  image: string;
  title: string;
  tag: string;
}

export async function getLifeGalleryPhotos(
  limit = 4
): Promise<LifeGalleryPhoto[]> {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.galleryList);

  const result = await listGallery({ pageSize: Math.max(limit * 2, 8) });
  const out: LifeGalleryPhoto[] = [];
  for (const item of result.items) {
    if (item.type === "video") continue;
    const photos = item.photos && item.photos.length > 0 ? item.photos : (item.image ? [{ url: item.image }] : []);
    for (const p of photos) {
      if (!p.url) continue;
      out.push({
        image: p.url,
        title: p.title || item.title,
        tag: item.category,
      });
      if (out.length >= limit) return out;
    }
    if (out.length >= limit) return out;
  }
  return out;
}
