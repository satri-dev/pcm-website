import { NextResponse } from "next/server";
import {
  listTrashedChatbotEntries,
  autoPurgeTrashedChatbotEntries,
} from "@/repositories/chatbot.repository";

export async function GET() {
  await autoPurgeTrashedChatbotEntries();

  const result = await listTrashedChatbotEntries({ pageSize: 200 });

  const items = result.items.map((i) => ({
    id: i.id,
    name: i.question,
    collection: "chatbot_entries",
    deletedAt: i.deletedAt,
  }));

  return NextResponse.json({ items, total: items.length });
}
