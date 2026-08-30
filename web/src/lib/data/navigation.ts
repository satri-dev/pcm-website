// src/lib/data/navigation.ts
// Server-side data access for the public site navigation. Cached with the
// Cache Components model so the header menu (which changes rarely) is served
// from cache instead of hitting MongoDB on every request. Written data is
// invalidated from the admin API routes via revalidateTag(navMenu).
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { listNavMenu } from "@/repositories/nav-menu.repository";

export async function getNavbarItems() {
  "use cache";
  cacheLife("rarely");
  cacheTag(CACHE_TAGS.navMenu);

  const items = await listNavMenu();
  return items.filter((item) => item.active);
}