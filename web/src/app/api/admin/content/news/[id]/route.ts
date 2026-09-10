import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  deleteNews,
  getNewsById,
  updateNews,
  restoreNews,
  hardDeleteNews,
} from "@/repositories/news.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { NEWS_CATEGORIES } from "@/types/news";

const seoSchema = z.object({
  title: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
});

const updateSchema = z
  .object({
    title: z.string().min(3).max(200),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
    excerpt: z.string().min(1).max(1000),
    content: z.string().optional().default(""),
    category: z.string().min(1).max(100),
    image: z.string().optional(),
    author: z.string().min(1),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
    status: z.enum(["published", "draft"]),
    featured: z.boolean(),
    views: z.number().int().min(0).optional(),
    tags: z.array(z.string()).optional(),
    seo: seoSchema.optional(),
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
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const news = await getNewsById(id);
    if (!news) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(news);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch news article" },
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
        const restored = await restoreNews(id);
        if (!restored) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateTag(CACHE_TAGS.newsList, "max");
        revalidateTag(CACHE_TAGS.tickerItems, "max");
        revalidatePath("/news");
        revalidatePath("/");
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to restore news article" },
          { status: 500 }
        );
      }
    }

    if (action === "permanent-delete") {
      try {
        const deleted = await hardDeleteNews(id);
        if (!deleted) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateTag(CACHE_TAGS.newsList, "max");
        revalidateTag(CACHE_TAGS.tickerItems, "max");
        revalidatePath("/news");
        revalidatePath("/");
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to permanently delete news article" },
          { status: 500 }
        );
      }
    }
  }

  const guard = await requireApiSession(["admin", "editor"]);
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
    const updated = await updateNews(id, parsed.data as Partial<import("@/types/news").NewsCreateInput>);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.newsList, "max");
    revalidateTag(CACHE_TAGS.news(updated.slug), "max");
    revalidateTag(CACHE_TAGS.tickerItems, "max");
    revalidatePath("/news");
    revalidatePath("/");
    return NextResponse.json(updated);
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update news article" },
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
    const deleted = await deleteNews(id, guard.session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.newsList, "max");
    revalidateTag(CACHE_TAGS.tickerItems, "max");
    revalidatePath("/news");
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete news article" },
      { status: 500 }
    );
  }
}


