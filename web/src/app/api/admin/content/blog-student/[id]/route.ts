import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import {
  deleteBlogStudent,
  getBlogStudentById,
  updateBlogStudent,
} from "@/repositories/blog-student.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { BLOG_STUDENT_STATUSES, BlogStudentStatus } from "@/types/blog-student";
import { CACHE_TAGS } from "@/lib/cache-tags";

const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const updateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z.string().max(120).regex(slugRe, "Slug must be lowercase letters, numbers and hyphens").optional(),
  excerpt: z.string().min(10).optional(),
  body: z.string().optional(),
  image: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date").optional(),
  tag: z.string().max(200).optional(),
  author: z.string().min(2).max(100).optional(),
  category: z.string().min(1).max(100).optional(),
  status: z.enum(BLOG_STUDENT_STATUSES).optional(),
});

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const item = await getBlogStudentById(id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to fetch student blog" }, { status: 500 });
  }
}

// PATCH — admin only. Status changes: approve / set back to pending.
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const requestedStatus = body?.status;
  if (
    typeof requestedStatus !== "string" ||
    !BLOG_STUDENT_STATUSES.includes(requestedStatus as BlogStudentStatus)
  ) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  }

  try {
    const updated = await updateBlogStudent(id, {
      status: requestedStatus as BlogStudentStatus,
    });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateTag(CACHE_TAGS.blogStudentList, "max");
    revalidateTag(CACHE_TAGS.blogStudent(id), "max");
    revalidateTag(CACHE_TAGS.blogStudentBySlug(updated.slug), "max");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update student blog" }, { status: 500 });
  }
}

// PUT — admin only. Full content update (from the admin edit form).
export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
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
    const existing = await getBlogStudentById(id);
    const updated = await updateBlogStudent(id, parsed.data);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateTag(CACHE_TAGS.blogStudentList, "max");
    revalidateTag(CACHE_TAGS.blogStudent(id), "max");
    revalidateTag(CACHE_TAGS.blogStudentBySlug(updated.slug), "max");
    if (existing && existing.slug !== updated.slug) {
      revalidateTag(CACHE_TAGS.blogStudentBySlug(existing.slug), "max");
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update student blog" }, { status: 500 });
  }
}

// DELETE — admin only. Soft-deletes the article.
export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const existing = await getBlogStudentById(id);
    const deleted = await deleteBlogStudent(id, guard.session.user.id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateTag(CACHE_TAGS.blogStudentList, "max");
    if (existing) revalidateTag(CACHE_TAGS.blogStudentBySlug(existing.slug), "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete student blog" }, { status: 500 });
  }
}