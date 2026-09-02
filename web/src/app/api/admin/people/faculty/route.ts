import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  createFaculty,
  ensureFacultyIndexes,
  listFaculty,
} from "@/repositories/faculty.repository";
import { FACULTY_GROUPS, type FacultyCreateInput } from "@/types/faculty";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

const createSchema = z.object({
  name: z.string().min(2).max(200),
  role: z.string().min(2).max(200),
  group: z.enum(FACULTY_GROUPS as unknown as [string, ...string[]]),
  photo: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export async function GET(request: NextRequest) {
  await ensureFacultyIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "50") || 50)
  );
  const group = searchParams.get("group");
  const search = searchParams.get("search");

  const result = await listFaculty({
    page,
    pageSize,
    search: search || undefined,
    group: FACULTY_GROUPS.find((g) => g === group) || undefined,
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
    const created = await createFaculty(parsed.data as FacultyCreateInput);
    revalidateTag(CACHE_TAGS.facultyList, "max");
    revalidatePath("/about/faculty");
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create faculty member" },
      { status: 500 }
    );
  }
}
