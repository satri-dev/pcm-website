// src/lib/data/homepage.ts
// Server-side data access for the public home page. Uses the Cache Components
// ISR model so homepage content is served from cache instead of hitting MongoDB
// on every request. Written data is invalidated from the admin API routes via
// revalidateTag(CACHE_TAGS.homepage).
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getHomepage } from "@/repositories/homepage.repository";

export async function getHomepageData() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.homepage);
  
  return await getHomepage();
}
