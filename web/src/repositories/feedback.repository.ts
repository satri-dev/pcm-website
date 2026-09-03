// src/repositories/feedback.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Feedback,
  FeedbackDocument,
  FeedbackValue,
  FEEDBACK_COLLECTION,
} from "@/types/feedback";

function fromDocument(doc: FeedbackDocument): Feedback {
  const fieldValues: Record<string, FeedbackValue> =
    (doc.fields as Record<string, FeedbackValue>) ?? {};

  // Legacy submissions stored values at the top level instead of nested under
  // `fields`. Reconstruct those into the canonical nested shape.
  const reserved = new Set([
    "_id",
    "fieldSchema",
    "fields",
    "anonymous",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "deletedBy",
  ]);
  for (const key of Object.keys(doc)) {
    if (reserved.has(key)) continue;
    if (fieldValues[key] === undefined) {
      fieldValues[key] = doc[key] as FeedbackValue;
    }
  }

  return {
    id: doc._id!.toString(),
    fieldSchema: (doc.fieldSchema as Feedback["fieldSchema"]) ?? [],
    fields: fieldValues,
    anonymous: Boolean(doc.anonymous),
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? doc.createdAt ?? new Date()).toISOString(),
    deletedAt: doc.deletedAt?.toISOString(),
    deletedBy: doc.deletedBy,
  };
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) delete obj[key];
  }
  return obj;
}

export interface ListFeedbackOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listFeedback(options: ListFeedbackOptions = {}) {
  const db = await getDb();
  const { search, page = 1, pageSize = 20, sort, includeDeleted } = options;

  const filter: Filter<FeedbackDocument> = {};
  if (!includeDeleted) filter.deletedAt = { $exists: false };
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ "fields.name": rx }, { "fields.email": rx }];
  }

  const collection = db.collection<FeedbackDocument>(FEEDBACK_COLLECTION);

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

export async function getFeedbackById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<FeedbackDocument>(FEEDBACK_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function countFeedback() {
  const db = await getDb();
  return db
    .collection<FeedbackDocument>(FEEDBACK_COLLECTION)
    .countDocuments({ deletedAt: { $exists: false } });
}

export async function deleteFeedback(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<FeedbackDocument>(FEEDBACK_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreFeedback(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<FeedbackDocument>(FEEDBACK_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteFeedback(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<FeedbackDocument>(FEEDBACK_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureFeedbackIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<FeedbackDocument>(FEEDBACK_COLLECTION);
      const wanted: IndexDescription[] = [
        // Serve the admin list: filter non-deleted + sort by createdAt desc.
        { key: { deletedAt: 1, createdAt: -1 }, name: "deletedAt_createdAt_desc" },
        // Serve the trash list.
        { key: { deletedAt: 1 }, name: "deletedAt" },
        // Serve un-filtered date ordering (public counts / plain listing).
        { key: { createdAt: -1 }, name: "createdAt_desc" },
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
