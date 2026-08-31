// src/lib/data/topbar.ts
// Server-side data access for the public site top bar. Cached with the
// Cache Components model so the top bar (which changes rarely) is served
// from cache instead of hitting MongoDB on every request.
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  listTopBarLinks as listTopBarLinksRepo,
  getTopBarContact as getTopBarContactRepo,
} from "@/repositories/topbar.repository";
import type { TopBarLink, TopBarContact } from "@/types/topbar";

export async function listTopBarLinks(): Promise<TopBarLink[]> {
  "use cache";
  cacheLife("rarely");
  cacheTag(CACHE_TAGS.topBarLinks);

  return await listTopBarLinksRepo();
}

export async function getTopBarContact(): Promise<TopBarContact | null> {
  "use cache";
  cacheLife("rarely");
  cacheTag(CACHE_TAGS.topBarContact);

  return await getTopBarContactRepo();
}
