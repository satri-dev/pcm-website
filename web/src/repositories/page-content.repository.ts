// src/repositories/page-content.repository.ts
import { ObjectId } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  PageContent,
  PageContentDocument,
  PAGE_CONTENT_COLLECTION,
} from "@/types/page-content";

function fromDocument(doc: PageContentDocument): PageContent {
  return {
    id: doc._id!.toString(),
    slug: doc.slug,
    content: doc.content,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function getPageContentBySlug(slug: string): Promise<PageContent | null> {
  const db = await getDb();
  const doc = await db
    .collection<PageContentDocument>(PAGE_CONTENT_COLLECTION)
    .findOne({ slug });
  
  return doc ? fromDocument(doc) : null;
}

export async function upsertPageContent(
  slug: string,
  content: Record<string, unknown>
): Promise<PageContent> {
  const db = await getDb();
  const now = new Date();
  
  const doc = await db
    .collection<PageContentDocument>(PAGE_CONTENT_COLLECTION)
    .findOneAndUpdate(
      { slug },
      {
        $set: {
          content,
          updatedAt: now,
        },
        $setOnInsert: {
          slug,
          createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );
  
  return fromDocument(doc as PageContentDocument);
}

export async function deletePageContent(slug: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<PageContentDocument>(PAGE_CONTENT_COLLECTION)
    .deleteOne({ slug });
  
  return result.deletedCount > 0;
}

// Ensure indexes
let indexesReady: Promise<void> | null = null;
export function ensurePageContentIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<PageContentDocument>(PAGE_CONTENT_COLLECTION);
      
      await col.createIndex({ slug: 1 }, { unique: true, name: "uniq_slug" });
    })();
  }
  return indexesReady;
}
