// src/repositories/facilities.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  FacilityItem,
  FacilityDocument,
  FacilityCreateInput,
  FacilityUpdateInput,
  FACILITY_COLLECTION,
} from "@/app/admin/campus/facilities/types/facilities";

function fromDocument(doc: FacilityDocument): FacilityItem {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    category: doc.category,
    icon: doc.icon,
    image: doc.image,
    description: doc.description,
    status: doc.status,
    order: doc.order ?? 0,
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

function toDocument(
  input: FacilityCreateInput
): Omit<FacilityDocument, "_id"> {
  const now = new Date();
  return clean({
    name: input.name.trim(),
    category: input.category,
    icon: input.icon.trim(),
    image: input.image || undefined,
    description: input.description,
    status: input.status,
    order: input.order && input.order >= 0 ? Math.trunc(input.order) : 0,
    createdAt: now,
    updatedAt: now,
  });
}

export interface ListFacilitiesOptions {
  status?: FacilityItem["status"];
  category?: FacilityItem["category"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listFacilities(options: ListFacilitiesOptions = {}) {
  const db = await getDb();
  const { status, category, search, page = 1, pageSize = 50, sort, includeDeleted } = options;

  const filter: Filter<FacilityDocument> = {};
  if (!includeDeleted) {
    filter.deletedAt = { $exists: false };
  }
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    const rx = new RegExp(
      search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    filter.$or = [{ name: rx }, { description: rx }];
  }

  const collection = db.collection<FacilityDocument>(FACILITY_COLLECTION);

  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort(sort ?? { order: 1, createdAt: -1 })
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

export async function getFacilityById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<FacilityDocument>(FACILITY_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createFacility(input: FacilityCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<FacilityDocument>(FACILITY_COLLECTION)
    .insertOne(doc as FacilityDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateFacility(id: string, patch: FacilityUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof FacilityCreateInput)[] = [
    "name",
    "category",
    "icon",
    "image",
    "description",
    "status",
    "order",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }
  if (patch.order !== undefined) {
    set.order = patch.order >= 0 ? Math.trunc(patch.order) : 0;
  }

  const doc = await db
    .collection<FacilityDocument>(FACILITY_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as FacilityDocument) : null;
}

export async function deleteFacility(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<FacilityDocument>(FACILITY_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreFacility(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<FacilityDocument>(FACILITY_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteFacility(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<FacilityDocument>(FACILITY_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function listTrashedFacilities(options: { page?: number; pageSize?: number; search?: string } = {}) {
  const db = await getDb();
  const { page = 1, pageSize = 20, search } = options;

  const filter: Filter<FacilityDocument> = { deletedAt: { $exists: true } };
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { description: rx }];
  }

  const collection = db.collection<FacilityDocument>(FACILITY_COLLECTION);
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

export async function autoPurgeTrashedFacilities() {
  const db = await getDb();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const result = await db
    .collection<FacilityDocument>(FACILITY_COLLECTION)
    .deleteMany({ deletedAt: { $exists: true, $lt: thirtyDaysAgo } });
  return result.deletedCount;
}

let indexesReady: Promise<void> | null = null;
export function ensureFacilityIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<FacilityDocument>(FACILITY_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { status: 1, order: 1 }, name: "status_order" },
        { key: { category: 1 }, name: "category" },
        { key: { name: "text", description: "text" }, name: "text_search" },
      ];

      const existing = await col.listIndexes().toArray();
      for (const idx of existing) {
        if (idx.name === "_id_") continue;
        const match = wanted.find((w) => w.name === idx.name);
        if (
          !match ||
          JSON.stringify(match.key) !== JSON.stringify(idx.key)
        ) {
          await col.dropIndex(idx.name).catch(() => {});
        }
      }

      await col.createIndexes(wanted);
    })();
  }
  return indexesReady;
}
