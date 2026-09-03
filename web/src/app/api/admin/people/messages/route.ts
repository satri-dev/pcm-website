import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  createMessage,
  ensureMessageIndexes,
  listMessages,
} from "@/repositories/message.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

const createSchema = z.object({
  title: z.string().min(2).max(200),
  author: z.string().min(2).max(200),
  role: z.string().optional(),
  excerpt: z.string().optional(),
  photo: z.string().optional(),
});

export async function GET(request: NextRequest) {
  await ensureMessageIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "50") || 50)
  );
  const search = searchParams.get("search");

  const result = await listMessages({
    page,
    pageSize,
    search: search || undefined,
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const created = await createMessage(parsed.data);
    revalidateTag(CACHE_TAGS.messageList, "max");
    revalidatePath("/about/message");
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
