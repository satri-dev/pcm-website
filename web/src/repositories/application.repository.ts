// src/repositories/application.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Application,
  ApplicationDocument,
  ApplicationCreateInput,
  ApplicationUpdateInput,
  APPLICATIONS_COLLECTION,
} from "@/types/application";

function fromDocument(doc: ApplicationDocument): Application {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    program: doc.program,
    shift: doc.shift,
    status: doc.status,
    data: doc.data,
    submittedAt: doc.submittedAt.toISOString(),
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

export interface ListApplicationsOptions {
  search?: string;
  status?: Application["status"];
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listApplications(
  options: ListApplicationsOptions = {}
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

  const filter: Filter<ApplicationDocument> = {};
  if (!includeDeleted) filter.deletedAt = { $exists: false };
  if (status) filter.status = status;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { program: rx }];
  }

  const collection = db.collection<ApplicationDocument>(APPLICATIONS_COLLECTION);

  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort(sort ?? { submittedAt: -1 })
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

export async function getApplicationById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<ApplicationDocument>(APPLICATIONS_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createApplication(input: ApplicationCreateInput) {
  const db = await getDb();
  const now = new Date();
  const doc = clean({
    name: input.name?.trim() || "Unknown",
    email: input.email?.trim().toLowerCase() || "",
    phone: input.phone?.trim() || "",
    program: input.program || "",
    shift: input.shift || "",
    status: (input.status || "new") as Application["status"],
    data: input.data || {},
    submittedAt: now,
    updatedAt: now,
  });
  const result = await db
    .collection<ApplicationDocument>(APPLICATIONS_COLLECTION)
    .insertOne(doc as ApplicationDocument);
  return fromDocument({ ...doc, _id: result.insertedId } as ApplicationDocument);
}

export async function updateApplication(
  id: string,
  patch: ApplicationUpdateInput
) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof ApplicationUpdateInput)[] = [
    "name",
    "email",
    "phone",
    "program",
    "shift",
    "status",
    "data",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }

  const doc = await db
    .collection<ApplicationDocument>(APPLICATIONS_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as ApplicationDocument) : null;
}

export async function deleteApplication(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ApplicationDocument>(APPLICATIONS_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreApplication(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ApplicationDocument>(APPLICATIONS_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteApplication(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ApplicationDocument>(APPLICATIONS_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureApplicationIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<ApplicationDocument>(APPLICATIONS_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { submittedAt: -1 }, name: "submittedAt_desc" },
        { key: { status: 1 }, name: "status" },
        { key: { email: 1 }, name: "email" },
        { key: { name: "text", email: "text", phone: "text" }, name: "text_search" },
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
