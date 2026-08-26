// src/repositories/blog.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Blog,
  BlogDocument,
  BlogCreateInput,
  BlogUpdateInput,
  BLOG_COLLECTION,
} from "@/app/admin/media/blogs/types/blog";

function fromDocument(doc: BlogDocument): Blog {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    author: doc.author,
    category: doc.category,
    date: doc.date.toISOString().slice(0, 10),
    status: doc.status,
    excerpt: doc.excerpt,
    fileUrl: doc.fileUrl,
    fileName: doc.fileName,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
    deletedAt: doc.deletedAt?.toISOString(),
    deletedBy: doc.deletedBy,
  };
}

function toDocument(input: BlogCreateInput): Omit<BlogDocument, "_id"> {
  const now = new Date();
  const date = new Date(input.date);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  return clean({
    title: input.title.trim(),
    author: input.author.trim(),
    category: input.category,
    date,
    status: input.status,
    excerpt: input.excerpt,
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

export interface ListBlogsOptions {
  category?: Blog["category"];
  status?: Blog["status"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listBlogs(options: ListBlogsOptions = {}) {
  const db = await getDb();
  const { category, status, search, page = 1, pageSize = 8, sort, includeDeleted } = options;

  const filter: Filter<BlogDocument> = {};
  if (!includeDeleted) {
    filter.deletedAt = { $exists: false };
  }
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { author: rx }, { excerpt: rx }];
  }

  const collection = db.collection<BlogDocument>(BLOG_COLLECTION);

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

export async function getBlogById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<BlogDocument>(BLOG_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createBlog(input: BlogCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<BlogDocument>(BLOG_COLLECTION)
    .insertOne(doc as BlogDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateBlog(id: string, patch: BlogUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof BlogCreateInput)[] = [
    "title",
    "author",
    "category",
    "date",
    "status",
    "excerpt",
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

  const doc = await db
    .collection<BlogDocument>(BLOG_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as BlogDocument) : null;
}

export async function deleteBlog(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<BlogDocument>(BLOG_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreBlog(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<BlogDocument>(BLOG_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteBlog(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<BlogDocument>(BLOG_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function listTrashedBlogs(options: { page?: number; pageSize?: number; search?: string } = {}) {
  const db = await getDb();
  const { page = 1, pageSize = 20, search } = options;

  const filter: Filter<BlogDocument> = { deletedAt: { $exists: true } };
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { author: rx }, { excerpt: rx }];
  }

  const collection = db.collection<BlogDocument>(BLOG_COLLECTION);
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

export async function autoPurgeTrashedBlogs() {
  const db = await getDb();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const result = await db
    .collection<BlogDocument>(BLOG_COLLECTION)
    .deleteMany({ deletedAt: { $exists: true, $lt: thirtyDaysAgo } });
  return result.deletedCount;
}

let indexesReady: Promise<void> | null = null;
export function ensureBlogIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      try {
        const db = await getDb();
        const col = db.collection<BlogDocument>(BLOG_COLLECTION);
        const wanted: IndexDescription[] = [
          { key: { category: 1 }, name: "category" },
          { key: { status: 1 }, name: "status" },
          { key: { date: -1 }, name: "date_desc" },
          { key: { createdAt: -1 }, name: "created_at_desc" },
          { key: { title: "text", author: "text", excerpt: "text" }, name: "text_search" },
        ];

        const collections = await db.listCollections({ name: BLOG_COLLECTION }).toArray();
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
