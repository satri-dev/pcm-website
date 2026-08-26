import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  Club,
  ClubDocument,
  ClubCreateInput,
  ClubUpdateInput,
  CLUBS_COLLECTION,
} from "@/types/clubs";

function fromDocument(doc: ClubDocument): Club {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    icon: doc.icon || "",
    tagline: doc.tagline || "",
    image: doc.image || "",
    desc: doc.desc || "",
    members: (doc.members || []).map((m) => ({
      photo: m.photo || "",
      name: m.name || "",
      position: m.position || "",
      program: m.program || "",
    })),
  };
}

function toDocument(input: ClubCreateInput): Omit<ClubDocument, "_id"> {
  const now = new Date();
  return clean({
    name: input.name.trim(),
    icon: input.icon || "",
    tagline: input.tagline || "",
    image: input.image || "",
    desc: input.desc || "",
    members: (input.members || []).map((m) => ({
      photo: m.photo || "",
      name: m.name || "",
      position: m.position || "",
      program: m.program || "",
    })),
    createdAt: now,
    updatedAt: now,
  } as unknown as Omit<ClubDocument, "_id">);
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) delete obj[key];
  }
  return obj;
}

export interface ListClubsOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listClubs(options: ListClubsOptions = {}) {
  const db = await getDb();
  const { search, page = 1, pageSize = 50, sort } = options;

  const filter: Filter<ClubDocument> = {};
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { tagline: rx }];
  }

  const collection = db.collection<ClubDocument>(CLUBS_COLLECTION);

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

export async function getClubById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<ClubDocument>(CLUBS_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createClub(input: ClubCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<ClubDocument>(CLUBS_COLLECTION)
    .insertOne(doc as ClubDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateClub(id: string, patch: ClubUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof ClubCreateInput)[] = [
    "name", "icon", "tagline", "image", "desc", "members",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }

  const doc = await db
    .collection<ClubDocument>(CLUBS_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as ClubDocument) : null;
}

export async function deleteClub(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ClubDocument>(CLUBS_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureClubIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      try {
        const db = await getDb();
        const col = db.collection<ClubDocument>(CLUBS_COLLECTION);
        const wanted: IndexDescription[] = [
          { key: { name: 1 }, name: "name" },
          { key: { name: "text", tagline: "text" }, name: "text_search" },
        ];

        const collections = await db.listCollections({ name: CLUBS_COLLECTION }).toArray();
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
