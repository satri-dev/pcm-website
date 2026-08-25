// src/repositories/results.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Result,
  ResultDocument,
  ResultCreateInput,
  ResultUpdateInput,
  RESULT_COLLECTION,
} from "@/types/results";

function fromDocument(doc: ResultDocument): Result {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    slug: doc.slug,
    program: doc.program,
    date: doc.date.toISOString().slice(0, 10),
    status: doc.status,
    views: doc.views ?? 0,
    fileUrl: doc.fileUrl,
    fileName: doc.fileName,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

function toDocument(input: ResultCreateInput): Omit<ResultDocument, "_id"> {
  const now = new Date();
  const date = new Date(input.date);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  return clean({
    title: input.title.trim(),
    slug: input.slug.trim(),
    program: input.program,
    date,
    status: input.status,
    views: input.views && input.views >= 0 ? Math.trunc(input.views) : 0,
    fileUrl: input.fileUrl || undefined,
    fileName: input.fileName || undefined,
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

export interface ListResultsOptions {
  status?: Result["status"];
  program?: Result["program"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listResults(options: ListResultsOptions = {}) {
  const db = await getDb();
  const { status, program, search, page = 1, pageSize = 8, sort } = options;

  const filter: Filter<ResultDocument> = {};
  if (status) filter.status = status;
  if (program) filter.program = program;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }];
  }

  const collection = db.collection<ResultDocument>(RESULT_COLLECTION);

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

export async function getResultById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<ResultDocument>(RESULT_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createResult(input: ResultCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<ResultDocument>(RESULT_COLLECTION)
    .insertOne(doc as ResultDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateResult(id: string, patch: ResultUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof ResultCreateInput)[] = [
    "title",
    "slug",
    "program",
    "status",
    "fileUrl",
    "fileName",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }
  if (patch.date !== undefined) {
    const d = new Date(patch.date);
    if (isNaN(d.getTime())) throw new Error("Invalid date");
    set.date = d;
  }
  if (patch.views !== undefined) {
    set.views = patch.views >= 0 ? Math.trunc(patch.views) : 0;
  }

  const doc = await db
    .collection<ResultDocument>(RESULT_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as ResultDocument) : null;
}

export async function deleteResult(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ResultDocument>(RESULT_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureResultIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<ResultDocument>(RESULT_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { slug: 1 }, name: "uniq_slug", unique: true },
        { key: { status: 1, date: -1 }, name: "status_date_desc" },
        { key: { program: 1 }, name: "program" },
        { key: { title: "text" }, name: "text_search" },
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
