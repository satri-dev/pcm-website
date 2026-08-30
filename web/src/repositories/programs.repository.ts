// src/repositories/programs.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Program,
  ProgramDocument,
  ProgramCreateInput,
  ProgramUpdateInput,
  PROGRAM_COLLECTION,
} from "@/types/programs";

function fromDocument(doc: ProgramDocument): Program {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    slug: doc.slug,
    code: doc.code,
    level: doc.level,
    duration: doc.duration,
    seats: doc.seats ?? 0,
    status: doc.status,
    image: doc.image,
    intro: doc.intro,
    eligibility: doc.eligibility,
    views: doc.views ?? 0,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
    deletedAt: doc.deletedAt?.toISOString(),
    deletedBy: doc.deletedBy,
  };
}

function toDocument(input: ProgramCreateInput): Omit<ProgramDocument, "_id"> {
  const now = new Date();
  return clean({
    name: input.name.trim(),
    slug: input.slug.trim(),
    code: input.code.trim(),
    level: input.level,
    duration: input.duration.trim(),
    seats: input.seats >= 0 ? Math.trunc(input.seats) : 0,
    status: input.status,
    image: input.image || undefined,
    intro: input.intro,
    eligibility: input.eligibility,
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

export interface ListProgramsOptions {
  status?: Program["status"];
  level?: Program["level"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listPrograms(options: ListProgramsOptions = {}) {
  const db = await getDb();
  const { status, level, search, page = 1, pageSize = 8, sort, includeDeleted } = options;

  const filter: Filter<ProgramDocument> = {};
  if (!includeDeleted) {
    filter.deletedAt = { $exists: false };
  }
  if (status) filter.status = status;
  if (level) filter.level = level;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { code: rx }];
  }

  const collection = db.collection<ProgramDocument>(PROGRAM_COLLECTION);

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

export async function getProgramById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<ProgramDocument>(PROGRAM_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createProgram(input: ProgramCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<ProgramDocument>(PROGRAM_COLLECTION)
    .insertOne(doc as ProgramDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateProgram(id: string, patch: ProgramUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof ProgramCreateInput)[] = [
    "name",
    "slug",
    "code",
    "level",
    "duration",
    "seats",
    "status",
    "image",
    "intro",
    "eligibility",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }
  if (patch.views !== undefined) {
    set.views = patch.views >= 0 ? Math.trunc(patch.views) : 0;
  }
  if (patch.seats !== undefined) {
    set.seats = patch.seats >= 0 ? Math.trunc(patch.seats) : 0;
  }

  const doc = await db
    .collection<ProgramDocument>(PROGRAM_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as ProgramDocument) : null;
}

export async function deleteProgram(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ProgramDocument>(PROGRAM_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreProgram(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ProgramDocument>(PROGRAM_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteProgram(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ProgramDocument>(PROGRAM_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function listTrashedPrograms(options: { page?: number; pageSize?: number; search?: string } = {}) {
  const db = await getDb();
  const { page = 1, pageSize = 20, search } = options;

  const filter: Filter<ProgramDocument> = { deletedAt: { $exists: true } };
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { code: rx }];
  }

  const collection = db.collection<ProgramDocument>(PROGRAM_COLLECTION);
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

export async function autoPurgeTrashedPrograms() {
  const db = await getDb();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const result = await db
    .collection<ProgramDocument>(PROGRAM_COLLECTION)
    .deleteMany({ deletedAt: { $exists: true, $lt: thirtyDaysAgo } });
  return result.deletedCount;
}

let indexesReady: Promise<void> | null = null;
export function ensureProgramIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<ProgramDocument>(PROGRAM_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { slug: 1 }, name: "uniq_slug", unique: true },
        { key: { status: 1, createdAt: -1 }, name: "status_created_desc" },
        { key: { level: 1 }, name: "level" },
        { key: { name: "text", code: "text" }, name: "text_search" },
      ];

      const existing = await col.listIndexes().toArray();
      for (const idx of existing) {
        if (idx.name === "_id_") continue;
        const match = wanted.find((w) => w.name === idx.name);
        if (!match || JSON.stringify(match.key) !== JSON.stringify(idx.key)) {
          await col.dropIndex(idx.name).catch(() => {});
        }
      }

      // Create indexes one by one, skipping unique index if duplicates exist
      for (const index of wanted) {
        try {
          const options: any = { name: index.name };
          
          // Only add unique if it's explicitly true
          if (index.unique === true) {
            options.unique = true;
          }
          
          // Add text search options
          if (index.key.name === "text") {
            options.default_language = "english";
          }
          
          await col.createIndex(index.key, options);
        } catch (err: any) {
          if (err.code === 11000 && index.unique) {
            console.warn(`[Programs] Skipping unique index ${index.name} due to duplicate values. Please fix duplicate slugs in the database.`);
          } else {
            throw err;
          }
        }
      }
    })();
  }
  return indexesReady;
}
