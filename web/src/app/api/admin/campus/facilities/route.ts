import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createFacility,
  ensureFacilityIndexes,
  listFacilities,
} from "@/repositories/facilities.repository";
import { FACILITY_CATEGORIES, FACILITY_STATUSES} from "@/app/admin/campus/facilities/types/facilities";
import { requireApiSession } from "@/core/lib/api-guard";

const createSchema = z.object({
  name: z.string().min(2).max(200),
  category: z.enum([
    "Learning",
    "Library",
    "IT",
    "Sports",
    "Student Life",
  ]),
  icon: z.string().min(1).max(20),
  image: z.string().optional(),
  description: z.string().min(1).max(5000),
  status: z.enum(["published", "draft"]),
  order: z.number().int().min(0).optional(),
});

export async function GET(request: NextRequest) {
  await ensureFacilityIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "50") || 50)
  );
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const result = await listFacilities({
    page,
    pageSize,
    search: search || undefined,
    status: FACILITY_STATUSES.find((s) => s === status) || undefined,
    category:
      FACILITY_CATEGORIES.find((c) => c === category) || undefined,
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
    const created = await createFacility(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create facility" },
      { status: 500 }
    );
  }
}
