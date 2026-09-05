import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/core/lib/api-guard";
import { ensureBlogStudentIndexes, listBlogStudents } from "@/repositories/blog-student.repository";
import { BLOG_STUDENT_STATUSES } from "@/types/blog-student";

// GET /api/admin/content/blog-student — admin only. Returns all student
// blogs across every status so admins can moderate the approval queue.
export async function GET(request: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  try {
    await ensureBlogStudentIndexes();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") ?? "50") || 50)
    );
    const search = searchParams.get("search");
    const statusParam = searchParams.get("status");
    const status = BLOG_STUDENT_STATUSES.find((s) => s === statusParam);
    const category = searchParams.get("category");

    const result = await listBlogStudents({
      page,
      pageSize,
      search: search || undefined,
      status,
      category: category || undefined,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch student blogs" },
      { status: 500 }
    );
  }
}