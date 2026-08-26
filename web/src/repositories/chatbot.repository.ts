import { ObjectId, Filter, Sort, IndexDescription } from "mongodb";
import { getDb } from "@/core/lib/db";
import {
  ChatbotEntry,
  ChatbotDocument,
  ChatbotCreateInput,
  ChatbotUpdateInput,
  CHATBOT_COLLECTION,
} from "@/app/admin/system/chat-bot/types/chatbot";

function fromDocument(doc: ChatbotDocument): ChatbotEntry {
  return {
    id: doc._id!.toString(),
    channel: doc.channel,
    question: doc.question,
    keywords: doc.keywords ?? [],
    answer: doc.answer,
    active: doc.active ?? true,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
    updatedAt: (doc.updatedAt ?? new Date()).toISOString(),
  };
}

function toDocument(input: ChatbotCreateInput): Omit<ChatbotDocument, "_id"> {
  const now = new Date();
  return clean({
    channel: input.channel,
    question: input.question.trim(),
    keywords: input.keywords.map((k) => k.trim()).filter(Boolean),
    answer: input.answer,
    active: input.active,
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

export interface ListChatbotOptions {
  channel?: ChatbotEntry["channel"];
  active?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
}

export async function listChatbotEntries(options: ListChatbotOptions = {}) {
  const db = await getDb();
  const { channel, active, search, page = 1, pageSize = 8, sort } = options;

  const filter: Filter<ChatbotDocument> = {};
  if (channel) filter.channel = channel;
  if (active !== undefined) filter.active = active;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ question: rx }, { keywords: rx }, { answer: rx }];
  }

  const collection = db.collection<ChatbotDocument>(CHATBOT_COLLECTION);

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

export async function getChatbotEntryById(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<ChatbotDocument>(CHATBOT_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? fromDocument(doc) : null;
}

export async function createChatbotEntry(input: ChatbotCreateInput) {
  const db = await getDb();
  const doc = toDocument(input);
  const result = await db
    .collection<ChatbotDocument>(CHATBOT_COLLECTION)
    .insertOne(doc as ChatbotDocument);
  return fromDocument({ ...doc, _id: result.insertedId });
}

export async function updateChatbotEntry(id: string, patch: ChatbotUpdateInput) {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();

  const set: Record<string, unknown> = { updatedAt: new Date() };
  const allowed: (keyof ChatbotCreateInput)[] = [
    "channel",
    "question",
    "keywords",
    "answer",
    "active",
  ];
  for (const key of allowed) {
    if (key in patch && patch[key] !== undefined) {
      if (key === "keywords" && Array.isArray(patch[key])) {
        set[key] = patch[key].map((k: string) => k.trim()).filter(Boolean);
      } else {
        set[key] = patch[key];
      }
    }
  }

  const doc = await db
    .collection<ChatbotDocument>(CHATBOT_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return doc ? fromDocument(doc as ChatbotDocument) : null;
}

export async function deleteChatbotEntry(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db
    .collection<ChatbotDocument>(CHATBOT_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

let indexesReady: Promise<void> | null = null;
export function ensureChatbotIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      const col = db.collection<ChatbotDocument>(CHATBOT_COLLECTION);
      const wanted: IndexDescription[] = [
        { key: { channel: 1 }, name: "channel" },
        { key: { active: 1 }, name: "active" },
        { key: { question: "text", keywords: "text", answer: "text" }, name: "text_search" },
      ];

      try {
        const existing = await col.listIndexes().toArray();
        for (const idx of existing) {
          if (idx.name === "_id_") continue;
          const match = wanted.find((w) => w.name === idx.name);
          if (!match || JSON.stringify(match.key) !== JSON.stringify(idx.key)) {
            await col.dropIndex(idx.name).catch(() => {});
          }
        }
      } catch {
        // Collection may not exist yet; createIndexes will create it
      }

      await col.createIndexes(wanted);
    })();
  }
  return indexesReady;
}
