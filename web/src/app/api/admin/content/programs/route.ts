// src/app/api/admin/content/programs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  listPrograms,
  createProgram,
  ensureProgramIndexes,
} from "@/repositories/programs.repository";
import { PROGRAM_LEVELS, PROGRAM_STATUSES } from "@/types/programs";
import { CACHE_TAGS } from "@/lib/cache-tags";

const createSchema = z.object({
  name: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  code: z.string().max(50),
  level: z.enum(PROGRAM_LEVELS as unknown as [string, ...string[]]),
  duration: z.string().max(50),
  semesters: z.number().int().min(1),
  creditHours: z.number().int().min(0),
  seats: z.number().int().min(0),
  status: z.enum(PROGRAM_STATUSES as unknown as [string, ...string[]]),
  image: z.string().optional(),
  intro: z.string().max(5000),
  eligibility: z.string().max(5000),
  affiliation: z.string().max(200),
});

export async function GET(request: NextRequest) {
  try {
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

    // Debug: log the IDs being returned
    console.log("[GET /api/admin/content/programs] Returning", result.items.length, "programs");
    console.log("[GET /api/admin/content/programs] Sample IDs:", result.items.slice(0, 3).map(p => p.id));

    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/admin/content/programs] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch programs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch (err) {
    console.error("[POST /api/admin/content/programs] JSON parse error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    console.error("[POST /api/admin/content/programs] Validation error:", parsed.error.flatten());
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const created = await createProgram(parsed.data as any);
    
    // Invalidate programs list cache
    revalidateTag(CACHE_TAGS.programsList, "max");
    revalidateTag(CACHE_TAGS.program(created.slug), "max");
    revalidateTag(CACHE_TAGS.navMenu, "max"); // Navbar shows programs list

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/content/programs] Create error:", err);
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
      { error: err instanceof Error ? err.message : "Failed to create program" },
      { status: 500 }
    );
  }
}
