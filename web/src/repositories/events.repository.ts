// src/repositories/events.repository.ts
import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  EventItem,
  EventDocument,
  EventCreateInput,
  EventUpdateInput,
  EVENT_COLLECTION,
} from "@/types/events";

function fromDocument(doc: EventDocument): EventItem {
  return {
    id: doc._id!.toString(),
    title: doc.title,
    slug: doc.slug,
    type: doc.type,
    date: doc.date.toISOString().slice(0, 10),
    location: doc.location,
    seats: doc.seats ?? 0,
    description: doc.description,
    image: doc.image,
    status: doc.status,
    views: doc.views ?? 0,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

function toDocument(input: EventCreateInput): Omit<EventDocument, "_id"> {
  const now = new Date();
  const date = new Date(input.date);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  return clean({
    title: input.title.trim(),
    slug: input.slug.trim(),
    type: input.type,
    date,
    location: input.location.trim(),
    seats: input.seats >= 0 ? Math.trunc(input.seats) : 0,
    description: input.description,
    image: input.image || undefined,
    status: input.status,
    views: input.views && input.views >= 0 ? Math.trunc(input.views) : 0,
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

export interface ListEventsOptions {
  status?: EventItem["status"];
  type?: EventItem["type"];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listEvents(options: ListEventsOptions = {}) {
  const db = await getDb();
  const { status, type, search, page = 1, pageSize = 8, sort } = options;

  const filter: Filter<EventDocument> = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: rx }, { location: rx }];
  }

  const collection = db.collection<EventDocument>(EVENT_COLLECTION);

  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter)
      .sort(sort ?? { date: -1, createdAt: -1 })
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

export async function getEventById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<EventDocument>(EVENT_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createEvent(input: EventCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<EventDocument>(EVENT_COLLECTION)
    .insertOne(doc as EventDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateEvent(id: string, patch: EventUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof EventCreateInput)[] = [
    "title",
    "slug",
    "type",
    "location",
    "seats",
    "description",
    "image",
    "status",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) set[key] = patch[key];
  }
  if (patch.date !== undefined) {
    const d = new Date(patch.date);
    if (isNaN(d.getTime())) throw new Error("Invalid date");
    set.date = d;
  }
  if (patch.views !== undefined) {
    set.views = patch.views >= 0 ? Math.trunc(patch.views) : 0;
  }
  if (patch.seats !== undefined) {
    set.seats = patch.seats >= 0 ? Math.trunc(patch.seats) : 0;
  }

  const doc = await db
    .collection<EventDocument>(EVENT_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as EventDocument) : null;
}

export async function deleteEvent(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<EventDocument>(EVENT_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureEventIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<EventDocument>(EVENT_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { slug: 1 }, name: "uniq_slug", unique: true },
        { key: { status: 1, date: -1 }, name: "status_date_desc" },
        { key: { type: 1 }, name: "type" },
        { key: { title: "text", location: "text" }, name: "text_search" },
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
