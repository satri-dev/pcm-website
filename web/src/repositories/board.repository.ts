import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Bod,
  BodDocument,
  BodCreateInput,
  BodUpdateInput,
  BOD_COLLECTION,
} from "@/types/bod";

function fromDocument(doc: BodDocument): Bod {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    role: doc.role,
    order: doc.order ?? 0,
    photo: doc.photo || "",
  };
}

function toDocument(input: BodCreateInput): Omit<BodDocument, "_id"> {
  const now = new Date();
  return clean({
    name: input.name.trim(),
    role: input.role.trim(),
    order: input.order ?? 0,
    photo: input.photo || "",
    createdAt: now,
    updatedAt: now,
  } as unknown as Omit<BodDocument, "_id">);
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) delete obj[key];
  }
  return obj;
}

export interface ListBoardOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listBoard(options: ListBoardOptions = {}) {
  const db = await getDb();
  const { search, page = 1, pageSize = 50, sort } = options;

  const filter: Filter<BodDocument> = {};
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { role: rx }];
  }

  const collection = db.collection<BodDocument>(BOD_COLLECTION);

  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort(sort ?? { order: 1, name: 1 })
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

export async function getBoardById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<BodDocument>(BOD_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createBoard(input: BodCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<BodDocument>(BOD_COLLECTION)
    .insertOne(doc as BodDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateBoard(id: string, patch: BodUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof BodCreateInput)[] = ["name", "role", "order", "photo"];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }

  const doc = await db
    .collection<BodDocument>(BOD_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as BodDocument) : null;
}

export async function deleteBoard(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<BodDocument>(BOD_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureBoardIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      try {
        const db = await getDb();
        const col = db.collection<BodDocument>(BOD_COLLECTION);
        const wanted: IndexDescription[] = [
          { key: { order: 1 }, name: "order" },
          { key: { name: 1 }, name: "name" },
          { key: { name: "text", role: "text" }, name: "text_search" },
        ];

        const collections = await db.listCollections({ name: BOD_COLLECTION }).toArray();
        if (collections.length === 0) return;

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
        // Collection may not exist yet
      }
    })();
  }
  return indexesReady;
}
