import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Faculty,
  FacultyDocument,
  FacultyCreateInput,
  FacultyUpdateInput,
  FacultyGroup,
  FACULTY_COLLECTION,
} from "@/types/faculty";

function fromDocument(doc: FacultyDocument): Faculty {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    role: doc.role,
    group: doc.group,
    photo: doc.photo || "",
    email: doc.email || "",
    phone: doc.phone || "",
  };
}

function toDocument(input: FacultyCreateInput): Omit<FacultyDocument, "_id"> {
  const now = new Date();
  return clean({
    name: input.name.trim(),
    role: input.role.trim(),
    group: input.group,
    photo: input.photo || "",
    email: input.email || "",
    phone: input.phone || "",
    createdAt: now,
    updatedAt: now,
  } as unknown as Omit<FacultyDocument, "_id">);
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) delete obj[key];
  }
  return obj;
}

export interface ListFacultyOptions {
  group?: FacultyGroup;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listFaculty(options: ListFacultyOptions = {}) {
  const db = await getDb();
  const { group, search, page = 1, pageSize = 50, sort } = options;

  const filter: Filter<FacultyDocument> = {};
  if (group) filter.group = group;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { role: rx }, { email: rx }];
  }

  const collection = db.collection<FacultyDocument>(FACULTY_COLLECTION);

  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort(sort ?? { name: 1 })
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

export async function getFacultyById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<FacultyDocument>(FACULTY_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createFaculty(input: FacultyCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<FacultyDocument>(FACULTY_COLLECTION)
    .insertOne(doc as FacultyDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateFaculty(id: string, patch: FacultyUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof FacultyCreateInput)[] = [
    "name", "role", "group", "photo", "email", "phone",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }

  const doc = await db
    .collection<FacultyDocument>(FACULTY_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as FacultyDocument) : null;
}

export async function deleteFaculty(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<FacultyDocument>(FACULTY_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureFacultyIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      try {
        const db = await getDb();
        const col = db.collection<FacultyDocument>(FACULTY_COLLECTION);
        const wanted: IndexDescription[] = [
          { key: { group: 1 }, name: "group" },
          { key: { name: 1 }, name: "name" },
          { key: { name: "text", role: "text" }, name: "text_search" },
        ];

        const collections = await db.listCollections({ name: FACULTY_COLLECTION }).toArray();
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
