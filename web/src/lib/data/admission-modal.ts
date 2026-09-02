// src/lib/data/admission-modal.ts
// Public data access for admission modal configuration

import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getAdmissionModal as getAdmissionModalRepo } from "@/repositories/admission-modal.repository";

/**
 * Get admission modal configuration with caching
 */
export async function getAdmissionModal() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.admissionModal);
  
  return getAdmissionModalRepo();
}
