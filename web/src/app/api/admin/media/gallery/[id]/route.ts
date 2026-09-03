import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  deleteGallery,
  getGalleryById,
  updateGallery,
  restoreGallery,
  hardDeleteGallery,
} from "@/repositories/gallery.repository";
import { requireApiSession } from "@/core/lib/api-guard";

const updateSchema = z
  .object({
    title: z.string().min(3).max(200),
    category: z.string().min(1, "Category is required").max(100),
    type: z.enum(["photo", "video"]).optional(),
    image: z.string().optional(),
    photos: z.array(
      z.object({
        url: z.string().min(1),
        title: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    ).optional(),
    videos: z.array(
      z.object({
        url: z.string().min(1),
        title: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    ).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
    photoCount: z.number().int().min(0).optional(),
    views: z.number().int().min(0).optional(),
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

function revalidateGalleryPaths() {
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  try {
    const gallery = await getGalleryById(id);
    if (!gallery) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(gallery);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch gallery item" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "restore" || action === "permanent-delete") {
    const guard = await requireApiSession(["admin"]);
    if (!guard.ok) return guard.response;

    if (action === "restore") {
      try {
        const restored = await restoreGallery(id);
        if (!restored) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateGalleryPaths();
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to restore gallery item" },
          { status: 500 }
        );
      }
    }

    if (action === "permanent-delete") {
      try {
        const deleted = await hardDeleteGallery(id);
        if (!deleted) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateGalleryPaths();
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to permanently delete gallery item" },
          { status: 500 }
        );
      }
    }
  }

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

  try {
    const updated = await updateGallery(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateGalleryPaths();
    return NextResponse.json(updated);
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate gallery entry" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update gallery item" },
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
    const deleted = await deleteGallery(id, guard.session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateGalleryPaths();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}


