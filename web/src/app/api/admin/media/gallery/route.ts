import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  createGallery,
  ensureGalleryIndexes,
  listGallery,
} from "@/repositories/gallery.repository";
import { requireApiSession } from "@/core/lib/api-guard";
const videoSchema = z.object({
  url: z.string().min(1),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const createSchema = z.object({
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
  videos: z.array(videoSchema).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  photoCount: z.number().int().min(0).optional(),
  views: z.number().int().min(0).optional(),
});

export async function GET(request: NextRequest) {
  await ensureGalleryIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "8") || 8)
  );
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const result = await listGallery({
    page,
    pageSize,
    search: search || undefined,
    category: category || undefined,
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
    const created = await createGallery(parsed.data);
    revalidateGalleryPaths();
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}

function revalidateGalleryPaths() {
  revalidatePath("/gallery");
  revalidatePath("/");
}
