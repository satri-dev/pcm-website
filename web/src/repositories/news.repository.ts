// src/repositories/news.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  News,
  NewsDocument,
  NewsCreateInput,
  NewsUpdateInput,
  NEWS_COLLECTION,
} from "@/types/news";

function fromDocument(doc: NewsDocument): News {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    category: doc.category,
    image: doc.image,
    author: doc.author,
    publishedAt: doc.publishedAt.toISOString().slice(0, 10),
    status: doc.status,
    views: doc.views ?? 0,
    featured: !!doc.featured,
    tags: doc.tags ?? [],
    seo: doc.seo,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

function toDocument(input: NewsCreateInput): Omit<NewsDocument, "_id"> {
  const now = new Date();
  const publishedAt = new Date(input.publishedAt);
  if (isNaN(publishedAt.getTime())) {
    throw new Error("Invalid publishedAt date");
  }
  // Undefined values are stripped: the Mongo driver would otherwise
  // store them as null and trip the collection validator's bsonTypes.
  return clean({
    title: input.title.trim(),
    slug: input.slug.trim(),
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    image: input.image || undefined,
    author: input.author.trim(),
    publishedAt,
    status: input.status,
    views: input.views && input.views >= 0 ? Math.trunc(input.views) : 0,
    featured: !!input.featured,
    tags: Array.isArray(input.tags) ? input.tags : undefined,
    seo: input.seo,
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

export interface ListNewsOptions {
  status?: News["status"];
  category?: News["category"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listNews(options: ListNewsOptions = {}) {
  const db = await getDb();
  const { status, category, search, page = 1, pageSize = 8, sort } = options;

  const filter: Filter<NewsDocument> = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    // Simple contains-match; swap for $text after the text index exists
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { excerpt: rx }, { author: rx }];
  }

  const collection = db.collection<NewsDocument>(NEWS_COLLECTION);

  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort(sort ?? { publishedAt: -1, createdAt: -1 })
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

export async function getNewsById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<NewsDocument>(NEWS_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createNews(input: NewsCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<NewsDocument>(NEWS_COLLECTION)
    .insertOne(doc as NewsDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateNews(id: string, patch: NewsUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof NewsCreateInput)[] = [
    "title",
    "slug",
    "excerpt",
    "content",
    "category",
    "image",
    "author",
    "status",
    "featured",
    "tags",
    "seo",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }
  if (patch.publishedAt !== undefined) {
    const d = new Date(patch.publishedAt);
    if (isNaN(d.getTime())) throw new Error("Invalid publishedAt date");
    set.publishedAt = d;
  }
  if (patch.views !== undefined) {
    set.views = patch.views >= 0 ? Math.trunc(patch.views) : 0;
  }

  const doc = await db
    .collection<NewsDocument>(NEWS_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as NewsDocument) : null;
}

export async function deleteNews(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<NewsDocument>(NEWS_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

// Called lazily so indexes exist even if scripts/create-news-collection.js
// was never run. Unique-slug violations surface on insert.
let indexesReady: Promise<void> | null = null;
export function ensureNewsIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<NewsDocument>(NEWS_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { slug: 1 }, name: "uniq_slug", unique: true },
        {
          key: { status: 1, publishedAt: -1 },
          name: "status_published_desc",
        },
        { key: { category: 1 }, name: "category" },
        { key: { featured: 1 }, name: "featured" },
        { key: { title: "text", excerpt: "text" }, name: "text_search" },
      ];

      // Drop indexes whose definition no longer matches (renamed fields etc.)
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
