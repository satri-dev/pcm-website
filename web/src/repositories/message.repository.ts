import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  LeadershipMessage,
  LeadershipMessageDocument,
  LeadershipMessageCreateInput,
  LeadershipMessageUpdateInput,
  LEADERSHIP_MESSAGE_COLLECTION,
} from "@/types/leadership-message";

function fromDocument(doc: LeadershipMessageDocument): LeadershipMessage {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    author: doc.author,
    role: doc.role || "",
    order: doc.order ?? 0,
    excerpt: doc.excerpt || "",
    photo: doc.photo || "",
  };
}

function toDocument(input: LeadershipMessageCreateInput): Omit<LeadershipMessageDocument, "_id"> {
  const now = new Date();
  return clean({
    title: input.title.trim(),
    author: input.author.trim(),
    role: input.role || "",
    order: input.order ?? 0,
    excerpt: input.excerpt || "",
    photo: input.photo || "",
    createdAt: now,
    updatedAt: now,
  } as unknown as Omit<LeadershipMessageDocument, "_id">);
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) delete obj[key];
  }
  return obj;
}

export interface ListMessagesOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listMessages(options: ListMessagesOptions = {}) {
  const db = await getDb();
  const { search, page = 1, pageSize = 50, sort } = options;

  const filter: Filter<LeadershipMessageDocument> = {};
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { author: rx }, { role: rx }];
  }

  const collection = db.collection<LeadershipMessageDocument>(LEADERSHIP_MESSAGE_COLLECTION);

  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort(sort ?? { order: 1, author: 1 })
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

export async function getMessageById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<LeadershipMessageDocument>(LEADERSHIP_MESSAGE_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function findMessageByOrder(order: number) {
  const db = await getDb();
  const doc = await db
    .collection<LeadershipMessageDocument>(LEADERSHIP_MESSAGE_COLLECTION)
    .findOne({ order });
  return doc ? fromDocument(doc) : null;
}

export async function createMessage(input: LeadershipMessageCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<LeadershipMessageDocument>(LEADERSHIP_MESSAGE_COLLECTION)
    .insertOne(doc as LeadershipMessageDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateMessage(id: string, patch: LeadershipMessageUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof LeadershipMessageCreateInput)[] = [
    "title", "author", "role", "order", "excerpt", "photo",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }

  const doc = await db
    .collection<LeadershipMessageDocument>(LEADERSHIP_MESSAGE_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as LeadershipMessageDocument) : null;
}

export async function deleteMessage(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<LeadershipMessageDocument>(LEADERSHIP_MESSAGE_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureMessageIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      try {
        const db = await getDb();
        const col = db.collection<LeadershipMessageDocument>(LEADERSHIP_MESSAGE_COLLECTION);
        const wanted: IndexDescription[] = [
          { key: { order: 1 }, name: "order" },
          { key: { createdAt: -1 }, name: "created_at_desc" },
          { key: { title: "text", author: "text" }, name: "text_search" },
        ];

        const collections = await db.listCollections({ name: LEADERSHIP_MESSAGE_COLLECTION }).toArray();
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
