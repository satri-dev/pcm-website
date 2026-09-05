import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import {
  createBlogStudent,
  ensureBlogStudentIndexes,
  listApprovedBlogStudents,
} from "@/repositories/blog-student.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const createSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().max(120).regex(slugRe, "Slug must be lowercase letters, numbers and hyphens").optional(),
  excerpt: z.string().min(10),
  body: z.string().optional(),
  image: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  tag: z.string().max(200).optional(),
  author: z.string().min(2).max(100),
  category: z.string().min(1).max(100).optional(),
});

// GET /api/blog-student — public. Returns only approved, non-deleted
// student blogs.
export async function GET() {
  try {
    const items = await listApprovedBlogStudents();
    return NextResponse.json({ success: true, items });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load student blogs." },
      { status: 500 }
    );
  }
}

// POST /api/blog-student — public. Accepts a new article and stores it as
// "pending" so an admin can review/approve it before it appears on the site.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        issues: parsed.error.flatten(),
      },
      { status: 422 }
    );
  }

  try {
    await ensureBlogStudentIndexes();
    const created = await createBlogStudent(parsed.data, "pending");
    revalidateTag(CACHE_TAGS.blogStudentList, "max");
    return NextResponse.json({
      success: true,
      message:
        "Thank you! Your article has been submitted and is now pending review by our team. It will appear here once approved.",
      item: created,
    });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: "An article with that slug already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}