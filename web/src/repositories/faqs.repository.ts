// src/repositories/faqs.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Faq,
  FaqDocument,
  FaqCreateInput,
  FaqUpdateInput,
  FAQ_COLLECTION,
} from "@/types/faqs";

function fromDocument(doc: FaqDocument): Faq {
  return {
    id: doc._id!.toString(),
    question: doc.question,
    slug: doc.slug,
    category: doc.category,
    answer: doc.answer,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

function toDocument(input: FaqCreateInput): Omit<FaqDocument, "_id"> {
  const now = new Date();
  return clean({
    question: input.question.trim(),
    slug: input.slug.trim(),
    category: input.category,
    answer: input.answer,
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

export interface ListFaqsOptions {
  category?: Faq["category"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listFaqs(options: ListFaqsOptions = {}) {
  const db = await getDb();
  const { category, search, page = 1, pageSize = 8, sort } = options;

  const filter: Filter<FaqDocument> = {};
  if (category) filter.category = category;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ question: rx }, { answer: rx }];
  }

  const collection = db.collection<FaqDocument>(FAQ_COLLECTION);

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

export async function getFaqById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<FaqDocument>(FAQ_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createFaq(input: FaqCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<FaqDocument>(FAQ_COLLECTION)
    .insertOne(doc as FaqDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateFaq(id: string, patch: FaqUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof FaqCreateInput)[] = [
    "question",
    "slug",
    "category",
    "answer",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }

  const doc = await db
    .collection<FaqDocument>(FAQ_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as FaqDocument) : null;
}

export async function deleteFaq(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<FaqDocument>(FAQ_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureFaqIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<FaqDocument>(FAQ_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { slug: 1 }, name: "uniq_slug", unique: true },
        { key: { category: 1 }, name: "category" },
        { key: { question: "text", answer: "text" }, name: "text_search" },
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
