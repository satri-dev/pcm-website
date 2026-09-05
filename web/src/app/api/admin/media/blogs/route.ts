import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  createBlog,
  ensureBlogIndexes,
  listBlogs,
} from "@/repositories/blog.repository";
import { BLOG_STATUSES } from "@/app/admin/media/blogs/types/blog";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

const createSchema = z.object({
  slug: z.string().max(120).optional(),
  title: z.string().min(3).max(200),
  author: z.string().min(2).max(100),
  category: z.string().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  status: z.enum(["published", "draft"]),
  excerpt: z.string().min(10),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  thumbnail: z.string().optional(),
});

export async function GET(request: NextRequest) {
  await ensureBlogIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "8") || 8)
  );
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const result = await listBlogs({
    page,
    pageSize,
    search: search || undefined,
    category: category || undefined,
    status: BLOG_STATUSES.find((s) => s === status) || undefined,
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
    const input = {
      ...parsed.data,
      slug: parsed.data.slug || parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    };
    const created = await createBlog(input);
    revalidateTag(CACHE_TAGS.blogsList, "max");
    if (created.status === "published") {
      revalidateTag(CACHE_TAGS.blog(created.slug), "max");
    }
    revalidatePath("/blogs");
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
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
