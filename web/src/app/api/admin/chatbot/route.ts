import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  listChatbotEntries,
  createChatbotEntry,
  ensureChatbotIndexes,
} from "@/repositories/chatbot.repository";
import {
  CHATBOT_CHANNELS,
  ChatbotChannel,
} from "@/app/admin/system/chat-bot/types/chatbot";

const createSchema = z.object({
  channel: z.enum(CHATBOT_CHANNELS as unknown as [string, ...string[]]),
  question: z.string().min(3).max(300),
  keywords: z.array(z.string()).min(1),
  answer: z.string().min(1).max(10000),
  active: z.boolean(),
});

export async function GET(req: NextRequest) {
  await requireApiSession(["admin", "editor", "viewer"]);
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || "50")));
  const channel = (searchParams.get("channel") || undefined) as ChatbotChannel | undefined;
  const activeParam = searchParams.get("active");
  const active = activeParam !== null ? activeParam === "true" : undefined;
  const search = searchParams.get("search") || undefined;

  await ensureChatbotIndexes();
  const result = await listChatbotEntries({ page, pageSize, channel, active, search });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await requireApiSession(["admin", "editor"]);
  if (!session.ok) return session.response;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 422 });

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  await ensureChatbotIndexes();
  const data = parsed.data;
  const created = await createChatbotEntry({
    ...data,
    channel: data.channel as ChatbotChannel,
  });
  return NextResponse.json(created, { status: 201 });
}
