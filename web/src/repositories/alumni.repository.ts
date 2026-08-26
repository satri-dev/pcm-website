import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Alumni,
  AlumniDocument,
  AlumniCreateInput,
  AlumniUpdateInput,
  AlumniSector,
  ALUMNI_COLLECTION,
} from "@/types/alumni";

function fromDocument(doc: AlumniDocument): Alumni {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    batch: doc.batch,
    program: doc.program,
    sector: doc.sector,
    role: doc.role,
    location: doc.location || "",
    photo: doc.photo || "",
  };
}

function toDocument(input: AlumniCreateInput): Omit<AlumniDocument, "_id"> {
  const now = new Date();
  return clean({
    name: input.name.trim(),
    batch: input.batch.trim(),
    program: input.program,
    sector: input.sector,
    role: input.role.trim(),
    location: input.location || "",
    photo: input.photo || "",
    createdAt: now,
    updatedAt: now,
  } as unknown as Omit<AlumniDocument, "_id">);
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) delete obj[key];
  }
  return obj;
}

export interface ListAlumniOptions {
  sector?: AlumniSector;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listAlumni(options: ListAlumniOptions = {}) {
  const db = await getDb();
  const { sector, search, page = 1, pageSize = 50, sort } = options;

  const filter: Filter<AlumniDocument> = {};
  if (sector) filter.sector = sector;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { role: rx }, { batch: rx }];
  }

  const collection = db.collection<AlumniDocument>(ALUMNI_COLLECTION);

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

export async function getAlumniById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<AlumniDocument>(ALUMNI_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createAlumni(input: AlumniCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<AlumniDocument>(ALUMNI_COLLECTION)
    .insertOne(doc as AlumniDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateAlumni(id: string, patch: AlumniUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof AlumniCreateInput)[] = [
    "name", "batch", "program", "sector", "role", "location", "photo",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }

  const doc = await db
    .collection<AlumniDocument>(ALUMNI_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as AlumniDocument) : null;
}

export async function deleteAlumni(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<AlumniDocument>(ALUMNI_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureAlumniIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      try {
        const db = await getDb();
        const col = db.collection<AlumniDocument>(ALUMNI_COLLECTION);
        const wanted: IndexDescription[] = [
          { key: { sector: 1 }, name: "sector" },
          { key: { batch: 1 }, name: "batch" },
          { key: { name: 1 }, name: "name" },
          { key: { name: "text", role: "text" }, name: "text_search" },
        ];

        const collections = await db.listCollections({ name: ALUMNI_COLLECTION }).toArray();
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
