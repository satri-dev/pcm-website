// src/repositories/gallery.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Gallery,
  GalleryDocument,
  GalleryCreateInput,
  GalleryUpdateInput,
  GALLERY_COLLECTION,
} from "@/types/gallery";

function fromDocument(doc: GalleryDocument): Gallery {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    category: doc.category,
    image: doc.image,
    photos: doc.photos ?? [],
    date: doc.date,
    photoCount: doc.photoCount ?? (doc.photos ?? []).length,
    views: doc.views ?? 0,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

function toDocument(input: GalleryCreateInput): Omit<GalleryDocument, "_id"> {
  const now = new Date();
  return clean({
    title: input.title.trim(),
    category: input.category,
    image: input.image || undefined,
    photos: Array.isArray(input.photos) ? input.photos : [],
    date: input.date,
    photoCount:
      typeof input.photoCount === "number" && input.photoCount >= 0
        ? Math.trunc(input.photoCount)
        : (input.photos ?? []).length,
    views: input.views && input.views >= 0 ? Math.trunc(input.views) : 0,
    createdAt: now,
    updatedAt: now,
  });
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) delete obj[key];
  }
  return obj;
}

export interface ListGalleryOptions {
  category?: Gallery["category"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listGallery(options: ListGalleryOptions = {}) {
  const db = await getDb();
  const { category, search, page = 1, pageSize = 8, sort } = options;

  const filter: Filter<GalleryDocument> = {};
  if (category) filter.category = category;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { title: rx },
      { "photos.title": rx },
      { "photos.tags": rx },
    ];
  }

  const collection = db.collection<GalleryDocument>(GALLERY_COLLECTION);

  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort(sort ?? { date: -1, createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
  ]);

  return {
    items: docs.map(fromDocument),
    total,
    page,
    pageSize,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getGalleryById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<GalleryDocument>(GALLERY_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createGallery(input: GalleryCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<GalleryDocument>(GALLERY_COLLECTION)
    .insertOne(doc as GalleryDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateGallery(id: string, patch: GalleryUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof GalleryCreateInput)[] = [
    "title",
    "category",
    "image",
    "photos",
    "date",
    "photoCount",
    "views",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }
  if (patch.date !== undefined) {
    set.date = patch.date;
  }
  if (patch.photoCount !== undefined) {
    set.photoCount =
      typeof patch.photoCount === "number" && patch.photoCount >= 0
        ? Math.trunc(patch.photoCount)
        : (patch.photos ?? []).length;
  }
  if (patch.views !== undefined) {
    set.views = patch.views >= 0 ? Math.trunc(patch.views) : 0;
  }

  const doc = await db
    .collection<GalleryDocument>(GALLERY_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as GalleryDocument) : null;
}

export async function deleteGallery(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<GalleryDocument>(GALLERY_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureGalleryIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<GalleryDocument>(GALLERY_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { category: 1 }, name: "category" },
        { key: { date: -1 }, name: "date_desc" },
        { key: { createdAt: -1 }, name: "created_at_desc" },
        { key: { title: "text", "photos.title": "text", "photos.tags": "text" }, name: "text_search" },
      ];

      const existing = await col.listIndexes().toArray();
      for (const idx of existing) {
        if (idx.name === "_id_") continue;
        const match = wanted.find((w) => w.name === idx.name);
        if (!match || JSON.stringify(match.key) !== JSON.stringify(idx.key)) {
          await col.dropIndex(idx.name).catch(() => {});
        }
      }

      await col.createIndexes(wanted);
    })();
  }
  return indexesReady;
}
