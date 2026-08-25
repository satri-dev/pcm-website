import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createNotice,
  ensureNoticeIndexes,
  listNotices,
} from "@/repositories/notices.repository";
import { NOTICE_CATEGORIES, NOTICE_STATUSES } from "@/types/notices";
import { requireApiSession } from "@/core/lib/api-guard";

const createSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  description: z.string().min(1).max(2000),
  category: z.enum([
    "General",
    "Academic",
    "Examination",
    "Administrative",
    "Event",
    "Circular",
  ]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  status: z.enum(["published", "draft"]),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  views: z.number().int().min(0).optional(),
});

export async function GET(request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  await ensureNoticeIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "8") || 8)
  );
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const result = await listNotices({
    page,
    pageSize,
    search: search || undefined,
    status: NOTICE_STATUSES.find((s) => s === status) || undefined,
    category: NOTICE_CATEGORIES.find((c) => c === category) || undefined,
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor"]);
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
    const created = await createNotice(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create notice" },
      { status: 500 }
    );
  }
}
