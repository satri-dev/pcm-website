import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  CampusMapItem,
  CampusMapDocument,
  CampusMapCreateInput,
  CampusMapUpdateInput,
  CAMPUS_MAP_COLLECTION,
} from "@/app/admin/campus/campus-map/types/campus";

function fromDocument(doc: CampusMapDocument): CampusMapItem {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    category: doc.category,
    icon: doc.icon,
    positionX: doc.positionX,
    positionY: doc.positionY,
    description: doc.description,
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

function toDocument(
  input: CampusMapCreateInput
): Omit<CampusMapDocument, "_id"> {
  const now = new Date();
  return clean({
    name: input.name.trim(),
    category: input.category,
    icon: input.icon.trim(),
    positionX: clampPercent(input.positionX),
    positionY: clampPercent(input.positionY),
    description: input.description,
    status: input.status,
    createdAt: now,
    updatedAt: now,
  });
}

function clampPercent(value: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export interface ListCampusMapOptions {
  status?: CampusMapItem["status"];
  category?: CampusMapItem["category"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  includeDeleted?: boolean;
}

export async function listCampusMap(options: ListCampusMapOptions = {}) {
  const db = await getDb();
  const { status, category, search, page = 1, pageSize = 50, sort, includeDeleted } = options;

  const filter: Filter<CampusMapDocument> = {};
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

  const collection = db.collection<CampusMapDocument>(CAMPUS_MAP_COLLECTION);

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

export async function getCampusMapById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<CampusMapDocument>(CAMPUS_MAP_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createCampusMap(input: CampusMapCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<CampusMapDocument>(CAMPUS_MAP_COLLECTION)
    .insertOne(doc as CampusMapDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateCampusMap(
  id: string,
  patch: CampusMapUpdateInput
) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof CampusMapCreateInput)[] = [
    "name",
    "category",
    "icon",
    "positionX",
    "positionY",
    "description",
    "status",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }
  if (patch.positionX !== undefined) set.positionX = clampPercent(patch.positionX);
  if (patch.positionY !== undefined) set.positionY = clampPercent(patch.positionY);

  const doc = await db
    .collection<CampusMapDocument>(CAMPUS_MAP_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as CampusMapDocument) : null;
}

export async function deleteCampusMap(id: string, deletedBy?: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<CampusMapDocument>(CAMPUS_MAP_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date(), deletedBy, updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function restoreCampusMap(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<CampusMapDocument>(CAMPUS_MAP_COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      { $unset: { deletedAt: "", deletedBy: "" }, $set: { updatedAt: new Date() } }
    );
  return result.modifiedCount > 0;
}

export async function hardDeleteCampusMap(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<CampusMapDocument>(CAMPUS_MAP_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function listTrashedCampusMap(options: { page?: number; pageSize?: number; search?: string } = {}) {
  const db = await getDb();
  const { page = 1, pageSize = 20, search } = options;

  const filter: Filter<CampusMapDocument> = { deletedAt: { $exists: true } };
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { description: rx }];
  }

  const collection = db.collection<CampusMapDocument>(CAMPUS_MAP_COLLECTION);
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

export async function autoPurgeTrashedCampusMap() {
  const db = await getDb();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const result = await db
    .collection<CampusMapDocument>(CAMPUS_MAP_COLLECTION)
    .deleteMany({ deletedAt: { $exists: true, $lt: thirtyDaysAgo } });
  return result.deletedCount;
}

let indexesReady: Promise<void> | null = null;
export function ensureCampusMapIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<CampusMapDocument>(CAMPUS_MAP_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { status: 1 }, name: "status" },
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
