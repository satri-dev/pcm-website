// src/lib/data/navbar-settings.ts
// Server-side data access for navbar settings. Cached with the
// Cache Components model so navbar settings are served from cache.

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getNavbarSettings as getNavbarSettingsRepo } from "@/repositories/navbar-settings.repository";
import type { NavbarSettings } from "@/types/nav-menu";

export async function getNavbarSettings(): Promise<NavbarSettings> {
  "use cache";
  cacheLife("rarely");
  cacheTag(CACHE_TAGS.navbar);

  return await getNavbarSettingsRepo();
}
