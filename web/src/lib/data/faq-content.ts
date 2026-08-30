// src/lib/data/faq-content.ts
// Server-side data access for the public /faq page copy (hero, section head,
// CTA band). Uses the Cache Components ISR model so this rarely-changing copy
// is served from cache instead of hitting Mongo on every request. Writes are
// invalidated from the admin API via revalidateTag("faq-page").
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  FAQ_PAGE_SETTINGS_DEFAULTS,
  FaqPageSettings,
} from "@/types/faq-content";
import { getFaqPageSettings } from "@/repositories/faq-content.repository";

export async function getFaqPageCopy(): Promise<FaqPageSettings> {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.faqPage);
  return getFaqPageSettings();
}

export { FAQ_PAGE_SETTINGS_DEFAULTS };
export type { FaqPageSettings };
