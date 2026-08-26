// src/repositories/scholarships.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Scholarship,
  ScholarshipDocument,
  ScholarshipCreateInput,
  ScholarshipUpdateInput,
  SCHOLARSHIP_COLLECTION,
} from "@/types/scholarships";

function fromDocument(doc: ScholarshipDocument): Scholarship {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    slug: doc.slug,
    type: doc.type,
    desc: doc.desc,
    active: doc.active ?? false,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
    deletedAt: doc.deletedAt?.toISOString(),
    deletedBy: doc.deletedBy,
  };
}

function toDocument(input: ScholarshipCreateInput): Omit<ScholarshipDocument, "_id"> {
  const now = new Date();
  return clean({
    title: input.title.trim(),
    slug: input.slug.trim(),
    type: input.type,
    desc: input.desc,
    active: input.active,
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

export interface ListScholarshipsOptions {
  type?: Scholarship["type"];
  active?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listScholarships(options: ListScholarshipsOptions = {}) {
  const db = await getDb();
  const { type, active, search, page = 1, pageSize = 8, sort, includeDeleted } = options;

  const filter: Filter<ScholarshipDocument> = {};
  if (!includeDeleted) {
    filter.deletedAt = { $exists: false };
  }
  if (type) filter.type = type;
  if (active !== undefined) filter.active = active;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { desc: rx }];
  }

  const collection = db.collection<ScholarshipDocument>(SCHOLARSHIP_COLLECTION);

  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort(sort ?? { createdAt: -1 })
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

export async function getScholarshipById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<ScholarshipDocument>(SCHOLARSHIP_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createScholarship(input: ScholarshipCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<ScholarshipDocument>(SCHOLARSHIP_COLLECTION)
    .insertOne(doc as ScholarshipDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateScholarship(id: string, patch: ScholarshipUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof ScholarshipCreateInput)[] = [
    "title",
    "slug",
    "type",
    "desc",
    "active",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }

  const doc = await db
    .collection<ScholarshipDocument>(SCHOLARSHIP_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as ScholarshipDocument) : null;
}

export async function deleteScholarship(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ScholarshipDocument>(SCHOLARSHIP_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreScholarship(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ScholarshipDocument>(SCHOLARSHIP_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteScholarship(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ScholarshipDocument>(SCHOLARSHIP_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function listTrashedScholarships(options: { page?: number; pageSize?: number; search?: string } = {}) {
  const db = await getDb();
  const { page = 1, pageSize = 20, search } = options;

  const filter: Filter<ScholarshipDocument> = { deletedAt: { $exists: true } };
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { desc: rx }];
  }

  const collection = db.collection<ScholarshipDocument>(SCHOLARSHIP_COLLECTION);
  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort({ deletedAt: -1 })
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

export async function autoPurgeTrashedScholarships() {
  const db = await getDb();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const result = await db
    .collection<ScholarshipDocument>(SCHOLARSHIP_COLLECTION)
    .deleteMany({ deletedAt: { $exists: true, $lt: thirtyDaysAgo } });
  return result.deletedCount;
}

let indexesReady: Promise<void> | null = null;
export function ensureScholarshipIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<ScholarshipDocument>(SCHOLARSHIP_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { slug: 1 }, name: "uniq_slug", unique: true },
        { key: { type: 1 }, name: "type" },
        { key: { active: 1, createdAt: -1 }, name: "active_created_desc" },
        { key: { title: "text", desc: "text" }, name: "text_search" },
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
