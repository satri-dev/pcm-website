// src/repositories/notices.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Notice,
  NoticeDocument,
  NoticeCreateInput,
  NoticeUpdateInput,
  NOTICE_COLLECTION,
} from "@/types/notices";

function fromDocument(doc: NoticeDocument): Notice {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    category: doc.category,
    date: doc.date.toISOString().slice(0, 10),
    status: doc.status,
    views: doc.views ?? 0,
    fileUrl: doc.fileUrl,
    fileName: doc.fileName,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
    deletedAt: doc.deletedAt?.toISOString(),
    deletedBy: doc.deletedBy,
  };
}

function toDocument(input: NoticeCreateInput): Omit<NoticeDocument, "_id"> {
  const now = new Date();
  const date = new Date(input.date);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  return clean({
    title: input.title.trim(),
    slug: input.slug.trim(),
    description: input.description,
    category: input.category,
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

export interface ListNoticesOptions {
  status?: Notice["status"];
  category?: Notice["category"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listNotices(options: ListNoticesOptions = {}) {
  const db = await getDb();
  const { status, category, search, page = 1, pageSize = 8, sort, includeDeleted } = options;

  const filter: Filter<NoticeDocument> = {};
  if (!includeDeleted) {
    filter.deletedAt = { $exists: false };
  }
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { description: rx }];
  }

  const collection = db.collection<NoticeDocument>(NOTICE_COLLECTION);

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

export async function getNoticeById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<NoticeDocument>(NOTICE_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createNotice(input: NoticeCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<NoticeDocument>(NOTICE_COLLECTION)
    .insertOne(doc as NoticeDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateNotice(id: string, patch: NoticeUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof NoticeCreateInput)[] = [
    "title",
    "slug",
    "description",
    "category",
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
    .collection<NoticeDocument>(NOTICE_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as NoticeDocument) : null;
}

export async function deleteNotice(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<NoticeDocument>(NOTICE_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreNotice(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<NoticeDocument>(NOTICE_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteNotice(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<NoticeDocument>(NOTICE_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function listTrashedNotices(options: { page?: number; pageSize?: number; search?: string } = {}) {
  const db = await getDb();
  const { page = 1, pageSize = 20, search } = options;

  const filter: Filter<NoticeDocument> = { deletedAt: { $exists: true } };
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { description: rx }];
  }

  const collection = db.collection<NoticeDocument>(NOTICE_COLLECTION);
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

export async function autoPurgeTrashedNotices() {
  const db = await getDb();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const result = await db
    .collection<NoticeDocument>(NOTICE_COLLECTION)
    .deleteMany({ deletedAt: { $exists: true, $lt: thirtyDaysAgo } });
  return result.deletedCount;
}

let indexesReady: Promise<void> | null = null;
export function ensureNoticeIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<NoticeDocument>(NOTICE_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { slug: 1 }, name: "uniq_slug", unique: true },
        { key: { status: 1, date: -1 }, name: "status_date_desc" },
        { key: { category: 1 }, name: "category" },
        { key: { title: "text", description: "text" }, name: "text_search" },
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
