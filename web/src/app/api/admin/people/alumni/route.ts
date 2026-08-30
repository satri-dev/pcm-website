import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createAlumni,
  ensureAlumniIndexes,
  listAlumni,
} from "@/repositories/alumni.repository";
import { ALUMNI_SECTORS, ALUMNI_PROGRAMS, type AlumniCreateInput } from "@/types/alumni";
import { requireApiSession } from "@/core/lib/api-guard";

const createSchema = z.object({
  name: z.string().min(2).max(200),
  batch: z.string().min(1).max(50),
  program: z.enum(ALUMNI_PROGRAMS as unknown as [string, ...string[]]),
  sector: z.enum(ALUMNI_SECTORS as unknown as [string, ...string[]]),
  role: z.string().min(1).max(200),
  location: z.string().optional(),
  photo: z.string().optional(),
});

export async function GET(request: NextRequest) {
  await ensureAlumniIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "50") || 50)
  );
  const sector = searchParams.get("sector");
  const search = searchParams.get("search");

  const result = await listAlumni({
    page,
    pageSize,
    search: search || undefined,
    sector: ALUMNI_SECTORS.find((s) => s === sector) || undefined,
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
    const created = await createAlumni(parsed.data as AlumniCreateInput);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create alumni record" },
      { status: 500 }
    );
  }
}
