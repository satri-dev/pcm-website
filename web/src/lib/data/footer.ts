// src/lib/data/footer.ts
// Server-side data access for the public site footer. Cached with the
// Cache Components model so the footer (which changes rarely) is served
// from cache instead of hitting MongoDB on every request. Written data is
// invalidated from the admin API routes via revalidateTag(footerSettings/footerLinks).
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getFooterSettings as getFooterSettingsRepo, listFooterLinks as listFooterLinksRepo } from "@/repositories/footer.repository";
import type { FooterSettings, FooterLink } from "@/types/footer";

export async function getFooterSettings() {
  "use cache";
  cacheLife("rarely");
  cacheTag(CACHE_TAGS.footerSettings);

  return await getFooterSettingsRepo();
}

export async function getFooterLinks(): Promise<FooterLink[]> {
  "use cache";
  cacheLife("rarely");
  cacheTag(CACHE_TAGS.footerLinks);

  return await listFooterLinksRepo();
}
