import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import * as z from "zod";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getChatbotEntryById,
  updateChatbotEntry,
  deleteChatbotEntry,
  restoreChatbotEntry,
  hardDeleteChatbotEntry,
  ensureChatbotIndexes,
} from "@/repositories/chatbot.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  CHATBOT_CHANNELS,
  ChatbotChannel,
  ChatbotUpdateInput,
} from "@/app/admin/system/chat-bot/types/chatbot";

const updateSchema = z.object({
  channel: z.enum(CHATBOT_CHANNELS as unknown as [string, ...string[]]).optional(),
  question: z.string().min(3).max(300).optional(),
  keywords: z.array(z.string()).min(1).optional(),
  answer: z.string().min(1).max(10000).optional(),
  active: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireApiSession(["admin", "editor", "viewer"]);
  const { id } = await params;

  await ensureChatbotIndexes();
  const item = await getChatbotEntryById(id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "restore" || action === "permanent-delete") {
    const guard = await requireApiSession(["admin"]);
    if (!guard.ok) return guard.response;

    await ensureChatbotIndexes();

    if (action === "restore") {
      try {
        const restored = await restoreChatbotEntry(id);
        if (!restored) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateTag(CACHE_TAGS.chatbot, "max");
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to restore chatbot entry" },
          { status: 500 }
        );
      }
    }

    if (action === "permanent-delete") {
      try {
        const deleted = await hardDeleteChatbotEntry(id);
        if (!deleted) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateTag(CACHE_TAGS.chatbot, "max");
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to permanently delete chatbot entry" },
          { status: 500 }
        );
      }
    }
  }

  const session = await requireApiSession(["admin", "editor"]);
  if (!session.ok) return session.response;

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 422 });

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  await ensureChatbotIndexes();
  const patch: ChatbotUpdateInput = {
    ...parsed.data,
    channel: parsed.data.channel as ChatbotChannel | undefined,
  };
  const updated = await updateChatbotEntry(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  revalidateTag(CACHE_TAGS.chatbot, "max");
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireApiSession(["admin"]);
  if (!session.ok) return session.response;
  const { id } = await params;

  await ensureChatbotIndexes();
  const deleted = await deleteChatbotEntry(id, session.session.user.id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  revalidateTag(CACHE_TAGS.chatbot, "max");
  return NextResponse.json({ ok: true });
}


