// src/repositories/download.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Download,
  DownloadDocument,
  DownloadCreateInput,
  DownloadUpdateInput,
  DOWNLOAD_COLLECTION,
} from "@/app/admin/media/downloads/types/download";

function fromDocument(doc: DownloadDocument): Download {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    description: doc.description,
    category: doc.category,
    fileUrl: doc.fileUrl,
    fileName: doc.fileName,
    fileSize: doc.fileSize,
    fileType: doc.fileType,
    date: doc.date.toISOString().slice(0, 10),
    status: doc.status,
    downloadCount: doc.downloadCount ?? 0,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

function toDocument(input: DownloadCreateInput): Omit<DownloadDocument, "_id"> {
  const now = new Date();
  const date = new Date(input.date);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  return clean({
    title: input.title.trim(),
    description: input.description,
    category: input.category,
    fileUrl: input.fileUrl,
    fileName: input.fileName,
    fileSize: input.fileSize || undefined,
    fileType: input.fileType || undefined,
    date,
    status: input.status,
    downloadCount: input.downloadCount ?? 0,
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

export interface ListDownloadsOptions {
  category?: Download["category"];
  status?: Download["status"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listDownloads(options: ListDownloadsOptions = {}) {
  const db = await getDb();
  const { category, status, search, page = 1, pageSize = 8, sort } = options;

  const filter: Filter<DownloadDocument> = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { fileName: rx }, { description: rx }];
  }

  const collection = db.collection<DownloadDocument>(DOWNLOAD_COLLECTION);

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

export async function getDownloadById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<DownloadDocument>(DOWNLOAD_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createDownload(input: DownloadCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<DownloadDocument>(DOWNLOAD_COLLECTION)
    .insertOne(doc as DownloadDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateDownload(id: string, patch: DownloadUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof DownloadCreateInput)[] = [
    "title",
    "description",
    "category",
    "fileUrl",
    "fileName",
    "fileSize",
    "fileType",
    "date",
    "status",
    "downloadCount",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }
  if (patch.date !== undefined) {
    const d = new Date(patch.date);
    if (isNaN(d.getTime())) throw new Error("Invalid date");
    set.date = d;
  }
  if (patch.downloadCount !== undefined) {
    set.downloadCount = Math.max(0, Math.trunc(patch.downloadCount));
  }

  const doc = await db
    .collection<DownloadDocument>(DOWNLOAD_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as DownloadDocument) : null;
}

export async function deleteDownload(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<DownloadDocument>(DOWNLOAD_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureDownloadIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      try {
        const db = await getDb();
        const col = db.collection<DownloadDocument>(DOWNLOAD_COLLECTION);
        const wanted: IndexDescription[] = [
          { key: { category: 1 }, name: "category" },
          { key: { status: 1 }, name: "status" },
          { key: { date: -1 }, name: "date_desc" },
          { key: { createdAt: -1 }, name: "created_at_desc" },
          { key: { downloadCount: -1 }, name: "download_count_desc" },
          {
            key: { title: "text", fileName: "text", description: "text" },
            name: "text_search",
          },
        ];

        const collections = await db
          .listCollections({ name: DOWNLOAD_COLLECTION })
          .toArray();
        if (collections.length === 0) {
          return;
        }

        const existing = await col.listIndexes().toArray();
        for (const idx of existing) {
          if (idx.name === "_id_") continue;
          const match = wanted.find((w) => w.name === idx.name);
          if (!match || JSON.stringify(match.key) !== JSON.stringify(idx.key)) {
            await col.dropIndex(idx.name).catch(() => {});
          }
        }

        await col.createIndexes(wanted);
      } catch {
        // Collection may not exist yet; indexes will be created on first insert.
      }
    })();
  }
  return indexesReady;
}
