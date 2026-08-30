// src/repositories/about.repository.ts
import { getDb } from "@/core/lib/db";
import {
  AboutData,
  AboutDocument,
  AboutUpdateInput,
  ABOUT_COLLECTION,
  DEFAULT_ABOUT_DATA,
} from "@/types/about";

function fromDocument(doc: AboutDocument): AboutData {
  return {
    id: doc._id!.toString(),
    hero: doc.hero,
    whoWeAre: doc.whoWeAre,
    whyStudy: doc.whyStudy,
    vision: doc.vision,
    difference: doc.difference,
    stats: doc.stats,
    achievers: doc.achievers,
    cta: doc.cta,
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

export async function getAbout(): Promise<AboutData> {
  const db = await getDb();
  const col = db.collection<AboutDocument>(ABOUT_COLLECTION);
  let doc = await col.findOne({});
  if (!doc) {
    const now = new Date();
    const insert = { ...DEFAULT_ABOUT_DATA, createdAt: now, updatedAt: now };
    const result = await col.insertOne(insert as AboutDocument);
    doc = { ...insert, _id: result.insertedId };
  }
  return fromDocument(doc);
}

export async function updateAbout(
  patch: AboutUpdateInput
): Promise<AboutData> {
  const db = await getDb();
  const col = db.collection<AboutDocument>(ABOUT_COLLECTION);

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof AboutUpdateInput)[] = [
    "hero",
    "whoWeAre",
    "whyStudy",
    "vision",
    "difference",
    "stats",
    "achievers",
    "cta",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }

  const existing = await col.findOne({});
  if (!existing) {
    const now = new Date();
    await col.insertOne({
      ...DEFAULT_ABOUT_DATA,
      ...set,
      createdAt: now,
      updatedAt: now,
    } as AboutDocument);
  } else {
    await col.updateOne({ _id: existing._id }, { $set: set });
  }

  return getAbout();
}
