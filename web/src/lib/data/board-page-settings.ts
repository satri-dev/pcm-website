// src/lib/data/board-page-settings.ts
// Server-side data access for the public /about/board page settings.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getBoardPageSettings } from "@/repositories/board-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getBoardSettings() {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.boardSettings);

  return await getBoardPageSettings();
}
