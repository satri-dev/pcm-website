// src/repositories/homepage.repository.ts
import { IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  HomepageData,
  HomepageDocument,
  HomepageUpdateInput,
  HOMEPAGE_COLLECTION,
  DEFAULT_HOMEPAGE_DATA,
} from "@/types/homepage";

function fromDocument(doc: HomepageDocument): HomepageData {
  return {
    id: doc._id!.toString(),
    heroSlides: doc.heroSlides, // No limit applied
    welcomeStats: doc.welcomeStats,
    whyChooseReasons: doc.whyChooseReasons,
    testimonials: doc.testimonials,
    admission: doc.admission,
    cta: doc.cta,
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

/**
 * Return the single homepage document, creating it from defaults if it
 * does not yet exist.  The homepage collection stores exactly one row.
 */
export async function getHomepage(): Promise<HomepageData> {
  const db = await getDb();
  const col = db.collection<HomepageDocument>(HOMEPAGE_COLLECTION);
  let doc = await col.findOne({});
  if (!doc) {
    const now = new Date();
    const insert = { ...DEFAULT_HOMEPAGE_DATA, createdAt: now, updatedAt: now };
    const result = await col.insertOne(insert as HomepageDocument);
    doc = { ...insert, _id: result.insertedId };
  }
  return fromDocument(doc);
}

/** Replace sections of the homepage document. */
export async function updateHomepage(
  patch: HomepageUpdateInput
): Promise<HomepageData> {
  const db = await getDb();
  const col = db.collection<HomepageDocument>(HOMEPAGE_COLLECTION);

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof HomepageUpdateInput)[] = [
    "heroSlides",
    "welcomeStats",
    "whyChooseReasons",
    "testimonials",
    "admission",
    "cta",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) {
      set[key] = patch[key]; // No limit applied to heroSlides
    }
  }

  // Ensure document exists
  const existing = await col.findOne({});
  if (!existing) {
    const now = new Date();
    await col.insertOne({
      ...DEFAULT_HOMEPAGE_DATA,
      ...set,
      createdAt: now,
      updatedAt: now,
    } as HomepageDocument);
  } else {
    await col.updateOne({ _id: existing._id }, { $set: set });
  }

  return getHomepage();
}

let indexesReady: Promise<void> | null = null;
export function ensureHomepageIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      try {
        const db = await getDb();
        const col = db.collection<HomepageDocument>(HOMEPAGE_COLLECTION);
        const wanted: IndexDescription[] = [];

        const existing = await col.listIndexes().toArray();
        for (const idx of existing) {
          if (idx.name === "_id_") continue;
          const match = wanted.find((w) => w.name === idx.name);
          if (!match || JSON.stringify(match.key) !== JSON.stringify(idx.key)) {
            await col.dropIndex(idx.name).catch(() => {});
          }
        }
        if (wanted.length > 0) {
          await col.createIndexes(wanted);
        }
      } catch {
        // Collection may not exist yet; indexes will be created on first insert.
      }
    })();
  }
  return indexesReady;
}
