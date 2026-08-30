import { NextResponse } from "next/server";
import {
  listTrashedChatbotEntries,
  autoPurgeTrashedChatbotEntries,
} from "@/repositories/chatbot.repository";
import { getDb } from "@/core/lib/db";
import {
  USER_COLLECTION,
  type UserDocument,
} from "@/app/admin/system/users/types";

export interface TrashItem {
  id: string;
  name: string;
  collection: string;
  deletedAt: string;
  type: "chatbot" | "user";
}

export async function GET() {
  await autoPurgeTrashedChatbotEntries();

  // Fetch trashed chatbot entries
  const chatbotResult = await listTrashedChatbotEntries({ pageSize: 200 });
  const chatbotItems: TrashItem[] = chatbotResult.items.map((i) => ({
    id: i.id,
    name: i.question,
    collection: "chatbot_entries",
    deletedAt: i.deletedAt ?? "",
    type: "chatbot" as const,
  }));

  // Fetch banned users (soft-deleted users)
  const db = await getDb();
  const bannedDocs = await db
    .collection<UserDocument>(USER_COLLECTION)
    .find({ banned: true })
    .sort({ updatedAt: -1 })
    .limit(200)
    .toArray();

  const userItems: TrashItem[] = bannedDocs.map((doc) => ({
    id: String(doc._id),
    name: `${doc.name} (@${doc.username})`,
    collection: "user",
    deletedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : String(doc.updatedAt),
    type: "user" as const,
  }));

  // Combine and sort by deletedAt
  const items = [...chatbotItems, ...userItems].sort(
    (a, b) =>
      new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
  );

  return NextResponse.json({ items, total: items.length });
}
