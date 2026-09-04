import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  deleteBlog,
  getBlogById,
  updateBlog,
  restoreBlog,
  hardDeleteBlog,
} from "@/repositories/blog.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

const updateSchema = z
  .object({
    slug: z.string().min(1).max(120),
    title: z.string().min(3).max(200),
    author: z.string().min(2).max(100),
    category: z.enum([
      "Career",
      "Finance",
      "Technology",
      "Student Life",
      "Admissions",
      "Events",
      "Achievement",
      "Other",
    ]),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
    status: z.enum(["published", "draft"]),
    excerpt: z.string().min(10),
    fileUrl: z.string().optional(),
    fileName: z.string().optional(),
    thumbnail: z.string().optional(),
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
    const blog = await getBlogById(id);
    if (!blog) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
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
        const restored = await restoreBlog(id);
        if (!restored) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateTag(CACHE_TAGS.blogsList, "max");
        revalidatePath("/blogs");
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to restore blog post" },
          { status: 500 }
        );
      }
    }

    if (action === "permanent-delete") {
      try {
        const deleted = await hardDeleteBlog(id);
        if (!deleted) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateTag(CACHE_TAGS.blogsList, "max");
        revalidatePath("/blogs");
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to permanently delete blog post" },
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
    const updated = await updateBlog(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.blogsList, "max");
    if (updated.status === "published") {
      revalidateTag(CACHE_TAGS.blog(updated.slug), "max");
    }
    revalidatePath("/blogs");
    return NextResponse.json(updated);
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update blog post" },
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
    const deleted = await deleteBlog(id, guard.session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.blogsList, "max");
    revalidatePath("/blogs");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}


