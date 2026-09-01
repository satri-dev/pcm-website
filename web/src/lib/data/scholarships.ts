// src/lib/data/scholarships.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listScholarships } from "@/repositories/scholarships.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getPublishedScholarships() {
  "use cache";
  cacheLife("frequent");
  cacheTag(CACHE_TAGS.scholarshipsList);
  const { items } = await listScholarships({ active: true, pageSize: 50 });
  return items;
}
