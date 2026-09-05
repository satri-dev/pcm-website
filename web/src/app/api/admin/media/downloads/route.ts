import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createDownload,
  ensureDownloadIndexes,
  listDownloads,
} from "@/repositories/download.repository";
import {
  DOWNLOAD_STATUSES,
} from "@/app/admin/media/downloads/types/download";
import { requireApiSession } from "@/core/lib/api-guard";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

const createSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(5).max(5000),
  category: z.string().min(1).max(100),
  fileUrl: z.string().min(1),
  fileName: z.string().min(1),
  fileSize: z.string().optional(),
  fileType: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  status: z.enum(["published", "draft"]),
  downloadCount: z.number().int().min(0).optional(),
});

export async function GET(request: NextRequest) {
  await ensureDownloadIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "8") || 8)
  );
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const result = await listDownloads({
    page,
    pageSize,
    search: search || undefined,
    category: category || undefined,
    status: DOWNLOAD_STATUSES.find((s) => s === status) || undefined,
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
    const created = await createDownload(parsed.data);
    revalidateTag(CACHE_TAGS.downloads, { expire: 0 });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create download" },
      { status: 500 }
    );
  }
}
