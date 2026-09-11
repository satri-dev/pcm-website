// src/repositories/blog-student.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  BlogStudent,
  BlogStudentCreateInput,
  BlogStudentDocument,
  BlogStudentStatus,
  BlogStudentUpdateInput,
  BLOG_STUDENT_COLLECTION,
} from "@/types/blog-student";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);
}

function fromDocument(doc: BlogStudentDocument): BlogStudent {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    body: doc.body || "",
    image: doc.image,
    date: doc.date.toISOString().slice(0, 10),
    tag: doc.tag || "",
    author: doc.author,
    category: doc.category || "",
    status: doc.status,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
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

export interface ListBlogStudentsOptions {
  search?: string;
  status?: BlogStudentStatus;
  category?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listBlogStudents(
  options: ListBlogStudentsOptions = {}
) {
  const db = await getDb();
  const {
    search,
    status,
    category,
    page = 1,
    pageSize = 10,
    sort,
    includeDeleted,
  } = options;

  const filter: Filter<BlogStudentDocument> = {};
  if (!includeDeleted) filter.deletedAt = { $exists: false };
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { author: rx }, { tag: rx }, { category: rx }];
  }

  const collection = db.collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION);

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

// Public-facing: only approved, non-deleted student blogs.
export async function listApprovedBlogStudents(): Promise<BlogStudent[]> {
  const db = await getDb();
  const docs = await db
    .collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION)
    .find({ status: "approved", deletedAt: { $exists: false } })
    .sort({ date: -1, createdAt: -1 })
    .toArray();
  return docs.map(fromDocument);
}

function parseDate(value: string): Date {
  const d = new Date(value);
  if (isNaN(d.getTime())) throw new Error("Invalid date");
  return d;
}

export async function getBlogStudentById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function getBlogStudentBySlug(slug: string) {
  const db = await getDb();
  const doc = await db
    .collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION)
    .findOne({ slug });
  return doc ? fromDocument(doc) : null;
}

// Public-facing: only approved, non-deleted student blogs matching a slug.
export async function getApprovedBlogStudentBySlug(slug: string) {
  const db = await getDb();
  const doc = await db
    .collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION)
    .findOne({ slug, status: "approved", deletedAt: { $exists: false } });
  return doc ? fromDocument(doc) : null;
}

export async function createBlogStudent(
  input: BlogStudentCreateInput,
  status: BlogStudentStatus = "pending"
) {
  const db = await getDb();
  const now = new Date();
  const doc = clean({
    title: input.title.trim(),
    slug: slugify(input.slug || input.title),
    excerpt: input.excerpt,
    body: input.body || "",
    image: input.image || undefined,
    date: parseDate(input.date),
    tag: input.tag?.trim() || "",
    author: input.author.trim(),
    category: input.category?.trim() || "Other",
    status,
    createdAt: now,
    updatedAt: now,
  });
  const result = await db
    .collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION)
    .insertOne(doc as BlogStudentDocument);
  return fromDocument({ ...doc, _id: result.insertedId } as BlogStudentDocument);
}

export async function updateBlogStudent(
  id: string,
  patch: BlogStudentUpdateInput
) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof BlogStudentUpdateInput)[] = [
    "title",
    "slug",
    "excerpt",
    "body",
    "image",
    "date",
    "tag",
    "author",
    "category",
    "status",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) {
      if (key === "slug" && typeof patch.slug === "string") {
        set.slug = slugify(patch.slug);
      } else if (key === "date" && patch.date !== undefined) {
        set.date = parseDate(patch.date);
      } else {
        set[key] = patch[key];
      }
    }
  }

  const doc = await db
    .collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as BlogStudentDocument) : null;
}

export async function deleteBlogStudent(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreBlogStudent(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteBlogStudent(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function listTrashedBlogStudents(options: { page?: number; pageSize?: number; search?: string } = {}) {
  const db = await getDb();
  const { page = 1, pageSize = 20, search } = options;

  const filter: Filter<BlogStudentDocument> = { deletedAt: { $exists: true } };
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { author: rx }, { tag: rx }];
  }

  const collection = db.collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION);
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

export async function autoPurgeTrashedBlogStudents() {
  const db = await getDb();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const result = await db
    .collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION)
    .deleteMany({ deletedAt: { $exists: true, $lt: thirtyDaysAgo } });
  return result.deletedCount;
}

// Count of pending submissions for the admin moderation badge.
export async function countPendingBlogStudents(): Promise<number> {
  const db = await getDb();
  return db
    .collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION)
    .countDocuments({ status: "pending", deletedAt: { $exists: false } });
}

let indexesReady: Promise<void> | null = null;
export function ensureBlogStudentIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<BlogStudentDocument>(BLOG_STUDENT_COLLECTION);
      const wanted: IndexDescription[] = [
        // Public approved list + pending moderation queue sorted by date.
        { key: { status: 1, deletedAt: 1, date: -1 }, name: "status_deleted_date_desc" },
        { key: { slug: 1 }, name: "uniq_slug", unique: true },
        { key: { category: 1 }, name: "category" },
        { key: { date: -1 }, name: "date_desc" },
        { key: { createdAt: -1 }, name: "created_at_desc" },
        { key: { title: "text", author: "text", tag: "text", category: "text" }, name: "text_search" },
      ];

      try {
        const existing = await col.listIndexes().toArray();
        for (const idx of existing) {
          if (idx.name === "_id_") continue;
          const match = wanted.find((w) => w.name === idx.name);
          if (!match || JSON.stringify(match.key) !== JSON.stringify(idx.key)) {
            await col.dropIndex(idx.name).catch(() => {});
          }
        }
      } catch {
        // Collection may not exist yet; createIndexes will create it.
      }

      await col.createIndexes(wanted);
    })();
  }
  return indexesReady;
}