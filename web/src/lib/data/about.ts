// src/lib/data/about.ts
// Server-side data access for the public about page. Uses the Cache Components
// ISR model so rarely-changing about content is served from cache instead of
// hitting MongoDB on every request. Written data is invalidated from the admin
// API routes via revalidateTag(CACHE_TAGS.about).
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getAbout } from "@/repositories/about.repository";

export async function getAboutData() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.about);
  
  return await getAbout();
}
