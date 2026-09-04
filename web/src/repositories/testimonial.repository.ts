// src/repositories/testimonial.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Testimonial,
  TestimonialDocument,
  TestimonialCreateInput,
  TestimonialUpdateInput,
  TestimonialStatus,
  TESTIMONIALS_COLLECTION,
} from "@/types/testimonial";

function fromDocument(doc: TestimonialDocument): Testimonial {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    batch: doc.batch,
    position: doc.position,
    program: doc.program,
    photo: doc.photo,
    content: doc.content,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
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

export interface ListTestimonialsOptions {
  search?: string;
  status?: TestimonialStatus;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listTestimonials(
  options: ListTestimonialsOptions = {}
) {
  const db = await getDb();
  const {
    search,
    status,
    page = 1,
    pageSize = 10,
    sort,
    includeDeleted,
  } = options;

  const filter: Filter<TestimonialDocument> = {};
  if (!includeDeleted) filter.deletedAt = { $exists: false };
  if (status) filter.status = status;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { name: rx },
      { program: rx },
      { position: rx },
      { content: rx },
    ];
  }

  const collection = db.collection<TestimonialDocument>(TESTIMONIALS_COLLECTION);

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

// Public-facing list: only approved, non-deleted testimonials. Served by the
// `status_createdAt_desc` index so the public GET is fast.
export async function listApprovedTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  const docs = await db
    .collection<TestimonialDocument>(TESTIMONIALS_COLLECTION)
    .find({ status: "approved", deletedAt: { $exists: false } })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(fromDocument);
}

export async function getTestimonialById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<TestimonialDocument>(TESTIMONIALS_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createTestimonial(input: TestimonialCreateInput) {
  const db = await getDb();
  const now = new Date();
  const doc = clean({
    name: input.name?.trim() || "Anonymous",
    batch: input.batch?.trim() || undefined,
    position: input.position?.trim() || undefined,
    program: input.program?.trim() || undefined,
    photo: input.photo?.trim() || undefined,
    content: input.content || "",
    status: (input.status || "pending") as TestimonialStatus,
    createdAt: now,
    updatedAt: now,
  });
  const result = await db
    .collection<TestimonialDocument>(TESTIMONIALS_COLLECTION)
    .insertOne(doc as TestimonialDocument);
  return fromDocument({ ...doc, _id: result.insertedId } as TestimonialDocument);
}

export async function updateTestimonial(
  id: string,
  patch: TestimonialUpdateInput
) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof TestimonialUpdateInput)[] = [
    "name",
    "batch",
    "position",
    "program",
    "photo",
    "content",
    "status",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }

  const doc = await db
    .collection<TestimonialDocument>(TESTIMONIALS_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as TestimonialDocument) : null;
}

export async function deleteTestimonial(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<TestimonialDocument>(TESTIMONIALS_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreTestimonial(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<TestimonialDocument>(TESTIMONIALS_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteTestimonial(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<TestimonialDocument>(TESTIMONIALS_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

// Count pending testimonials (the moderation queue) for the sidebar badge.
export async function countPendingTestimonials(): Promise<number> {
  const db = await getDb();
  return db
    .collection<TestimonialDocument>(TESTIMONIALS_COLLECTION)
    .countDocuments({ status: "pending", deletedAt: { $exists: false } });
}

let indexesReady: Promise<void> | null = null;
export function ensureTestimonialIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<TestimonialDocument>(TESTIMONIALS_COLLECTION);
      const wanted: IndexDescription[] = [
        // Public approved list (fast GET) + moderation queue sorted by time.
        { key: { status: 1, createdAt: -1 }, name: "status_createdAt_desc" },
        // Admin list: non-deleted docs by status and time.
        { key: { status: 1, deletedAt: 1, createdAt: -1 }, name: "status_deleted_created_desc" },
        // Trash list.
        { key: { deletedAt: 1 }, name: "deletedAt" },
        // Fast un-filtered date ordering (plain listing).
        { key: { createdAt: -1 }, name: "createdAt_desc" },
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
        // Without this guard, listIndexes() throws "ns not found" on the very
        // first insert and a stale rejected promise would break every request.
      }

      await col.createIndexes(wanted);
    })();
  }
  return indexesReady;
}
