import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  deleteFaculty,
  getFacultyById,
  updateFaculty,
} from "@/repositories/faculty.repository";
import { FACULTY_GROUPS, type FacultyUpdateInput } from "@/types/faculty";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

const updateSchema = z
  .object({
    name: z.string().min(2).max(200),
    role: z.string().min(2).max(200),
    group: z.enum(FACULTY_GROUPS as unknown as [string, ...string[]]),
    photo: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
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
    const item = await getFacultyById(id);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch faculty member" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
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

  const { id } = await ctx.params;
  try {
    const updated = await updateFaculty(id, parsed.data as FacultyUpdateInput);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.facultyList, "max");
    revalidatePath("/about/faculty");
    return NextResponse.json(updated);
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate entry" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update faculty member" },
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
    const deleted = await deleteFaculty(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.facultyList, "max");
    revalidatePath("/about/faculty");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete faculty member" },
      { status: 500 }
    );
  }
}
