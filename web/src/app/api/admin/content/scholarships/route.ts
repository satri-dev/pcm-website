import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createScholarship,
  ensureScholarshipIndexes,
  listScholarships,
} from "@/repositories/scholarships.repository";
import { SCHOLARSHIP_TYPES } from "@/types/scholarships";
import { requireApiSession } from "@/core/lib/api-guard";

const createSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  type: z.enum(["Merit", "Need-based", "University", "Category"]),
  desc: z.string().max(5000).default(""),
  active: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  await ensureScholarshipIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "8") || 8)
  );
  const type = searchParams.get("type");
  const search = searchParams.get("search");

  const result = await listScholarships({
    page,
    pageSize,
    search: search || undefined,
    type: SCHOLARSHIP_TYPES.find((t) => t === type) || undefined,
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
    const created = await createScholarship(parsed.data);
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
      { error: "Failed to create scholarship" },
      { status: 500 }
    );
  }
}
