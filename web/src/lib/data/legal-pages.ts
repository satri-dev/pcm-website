import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getLegalPageSettings } from "@/repositories/legal-page-settings.repository";
import { TERMS_PAGE_SETTINGS_KEY, PRIVACY_PAGE_SETTINGS_KEY } from "@/types/legal-page-settings";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getTermsPageSettings() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.termsPageSettings);
  return getLegalPageSettings(TERMS_PAGE_SETTINGS_KEY);
}

export async function getPrivacyPageSettings() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.privacyPageSettings);
  return getLegalPageSettings(PRIVACY_PAGE_SETTINGS_KEY);
}
