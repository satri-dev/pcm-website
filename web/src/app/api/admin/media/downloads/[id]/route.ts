import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteDownload,
  getDownloadById,
  updateDownload,
} from "@/repositories/download.repository";
import { requireApiSession } from "@/core/lib/api-guard";

const updateSchema = z
  .object({
    title: z.string().min(3).max(200),
    description: z.string().min(5).max(5000),
    category: z.enum([
      "Forms",
      "Syllabus",
      "Reports",
      "Certificates",
      "Brochures",
      "Applications",
      "Fee Structures",
      "Others",
    ]),
    fileUrl: z.string().min(1),
    fileName: z.string().min(1),
    fileSize: z.string().optional(),
    fileType: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
    status: z.enum(["published", "draft"]),
    downloadCount: z.number().int().min(0).optional(),
  })
  .partial();

function isMongoError(err: unknown): err is { code?: number } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code?: unknown }).code === "number"
  );
}

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  try {
    const download = await getDownloadById(id);
    if (!download) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(download);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch download" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { id } = await ctx.params;
  try {
    const updated = await updateDownload(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate download entry" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update download" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const deleted = await deleteDownload(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete download" },
      { status: 500 }
    );
  }
}
