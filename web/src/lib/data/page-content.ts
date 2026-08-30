// src/lib/data/page-content.ts
// Server-side data access for static page copy (eyebrows, section titles,
// paragraphs, checklists). Uses the Cache Components ISR model so these
// pages — which change rarely — are served from cache instead of hitting
// MongoDB on every request. Written data is invalidated from the admin API
// via revalidateTag(page-content:slug).
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS, pageContentTag } from "@/lib/cache-tags";
import {
  PageContent,
  PageContentDocument,
  PageContentSection,
  PAGE_CONTENT_COLLECTION,
} from "@/types/page-content";
import { getDb } from "@/core/lib/db";

export async function getPageCopy(slug: string): Promise<PageContent | null> {
  "use cache";
  cacheLife("content");
  cacheTag(CACHE_TAGS.pageContent, pageContentTag(slug));

  const db = await getDb();
  const doc = await db
    .collection<PageContentDocument>(PAGE_CONTENT_COLLECTION)
    .findOne({ slug });

  if (!doc) return null;
  return {
    id: doc._id!.toString(),
    slug: doc.slug,
    label: doc.label,
    hero: doc.hero,
    sections: doc.sections ?? [],
    updatedAt: doc.updatedAt.toISOString(),
  };
}

// Look up a section by key with the DB copy taking priority and the
// hardcoded value preserved as an offline/empty-database fallback.
export function getSection(
  content: PageContent | null,
  key: string,
  fallback: PageContentSection
): PageContentSection {
  return content?.sections.find((s) => s.key === key) ?? fallback;
}

// Split multi-line textarea input back into separate paragraphs.
export function fromParagraphBlob(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

// Join paragraphs into a single textarea value for editing.
export function toParagraphBlob(paragraphs: string[] | undefined): string {
  return (paragraphs ?? []).join("\n");
}

// Split one-per-line checklist input back into items.
export function fromChecklistBlob(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

// Join checklist items into a single textarea value for editing.
export function toChecklistBlob(checklist: string[] | undefined): string {
  return (checklist ?? []).join("\n");
}