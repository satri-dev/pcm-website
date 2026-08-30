import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createProgram,
  ensureProgramIndexes,
  listPrograms,
} from "@/repositories/programs.repository";
import { PROGRAM_LEVELS, PROGRAM_STATUSES } from "@/types/programs";
import { requireApiSession } from "@/core/lib/api-guard";

const createSchema = z.object({
  name: z.string().min(3).max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  code: z.string().min(1).max(50),
  level: z.enum(["Bachelor", "Bachelor (Finance)", "Bachelor (IT)"]),
  duration: z.string().min(1).max(50),
  seats: z.number().int().min(0),
  status: z.enum(["open", "closed"]),
  image: z.string().optional(),
  intro: z.string().min(1).max(5000),
  eligibility: z.string().min(1).max(5000),
  views: z.number().int().min(0).optional(),
});

export async function GET(request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  await ensureProgramIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "8") || 8)
  );
  const status = searchParams.get("status");
  const level = searchParams.get("level");
  const search = searchParams.get("search");

  const result = await listPrograms({
    page,
    pageSize,
    search: search || undefined,
    status: PROGRAM_STATUSES.find((s) => s === status) || undefined,
    level: PROGRAM_LEVELS.find((l) => l === level) || undefined,
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
    const created = await createProgram(parsed.data);
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
      { error: "Failed to create program" },
      { status: 500 }
    );
  }
}
