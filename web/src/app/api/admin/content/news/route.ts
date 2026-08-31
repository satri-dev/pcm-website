import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  createNews,
  ensureNewsIndexes,
  listNews,
} from "@/repositories/news.repository";
import { NEWS_CATEGORIES, NEWS_STATUSES } from "@/types/news";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

const seoSchema = z.object({
  title: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
});

const createSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  excerpt: z.string().min(1).max(1000),
  content: z.string(),
  category: z.enum(["News", "Event", "Student Blog", "Achievement"]),
  image: z.string().optional(),
  author: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  status: z.enum(["published", "draft"]),
  featured: z.boolean().optional(),
  views: z.number().int().min(0).optional(),
  tags: z.array(z.string()).optional(),
  seo: seoSchema.optional(),
});

export async function GET(request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  await ensureNewsIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "8") || 8)
  );
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const result = await listNews({
    page,
    pageSize,
    search: search || undefined,
    status: NEWS_STATUSES.find((s) => s === status) || undefined,
    category: NEWS_CATEGORIES.find((c) => c === category) || undefined,
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
    const created = await createNews(parsed.data);
    revalidateTag(CACHE_TAGS.newsList, "max");
    revalidateTag(CACHE_TAGS.news(created.slug), "max");
    revalidatePath("/news");
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
      { error: "Failed to create news article" },
      { status: 500 }
    );
  }
}
