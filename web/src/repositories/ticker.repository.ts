// src/repositories/ticker.repository.ts

import { ObjectId } from "mongodb";
import { getDb } from "@/core/lib/db";
import type {
  Ticker,
  TickerDocument,
  TickerCreateInput,
  TickerUpdateInput,
  TICKER_COLLECTION,
} from "@/types/ticker";

const COLLECTION = "tickers" as typeof TICKER_COLLECTION;

function fromDocument(doc: TickerDocument): Ticker {
  return {
    id: doc._id!.toHexString(),
    message: doc.message,
    linkText: doc.linkText,
    linkUrl: doc.linkUrl,
    status: doc.status,
    order: doc.order,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function toDocument(input: TickerCreateInput): Omit<TickerDocument, "_id"> {
  const now = new Date();
  return {
    message: input.message,
    linkText: input.linkText,
    linkUrl: input.linkUrl,
    status: input.status,
    order: input.order,
    createdAt: now,
    updatedAt: now,
  };
}

export async function listTickers() {
  const db = await getDb();
  const docs = await db
    .collection<TickerDocument>(COLLECTION)
    .find({ deletedAt: { $exists: false }, status: "active" })
    .sort({ order: 1 })
    .toArray();
  return docs.map(fromDocument);
}

export async function listAllTickers() {
  const db = await getDb();
  const docs = await db
    .collection<TickerDocument>(COLLECTION)
    .find({ deletedAt: { $exists: false } })
    .sort({ order: 1 })
    .toArray();
  return docs.map(fromDocument);
}

export async function getTickerById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<TickerDocument>(COLLECTION)
    .findOne({ _id: new ObjectId(id), deletedAt: { $exists: false } });
  return doc ? fromDocument(doc) : null;
}

export async function createTicker(input: TickerCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<TickerDocument>(COLLECTION)
    .insertOne(doc as TickerDocument);
  return result.insertedId.toHexString();
}

export async function updateTicker(id: string, input: TickerUpdateInput) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const update: Partial<TickerDocument> = {
    ...input,
    updatedAt: new Date(),
  };
  const result = await db
    .collection<TickerDocument>(COLLECTION)
    .updateOne({ _id: new ObjectId(id), deletedAt: { $exists: false } }, { $set: update });
  return result.modifiedCount > 0;
}

export async function deleteTicker(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<TickerDocument>(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date() } });
  return result.modifiedCount > 0;
}
