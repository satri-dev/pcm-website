import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createBlog,
  ensureBlogIndexes,
  listBlogs,
} from "@/repositories/blog.repository";
import { BLOG_CATEGORIES, BLOG_STATUSES } from "@/app/admin/blogs/types/blog";
import { requireApiSession } from "@/core/lib/api-guard";

const createSchema = z.object({
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
  excerpt: z.string().min(10).max(5000),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
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
    category: BLOG_CATEGORIES.find((c) => c === category) || undefined,
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
    const created = await createBlog(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
