import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  createCampusMap,
  ensureCampusMapIndexes,
  listCampusMap,
} from "@/repositories/campus-map.repository";
import {
  CAMPUS_MAP_CATEGORIES,
  CAMPUS_MAP_STATUSES,
} from "@/app/admin/campus/campus-map/types/campus";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

const createSchema = z.object({
  name: z.string().min(2).max(200),
  category: z.enum(["Academic", "Administration", "Student Life", "Sports", "Library", "IT"]),
  icon: z.string().min(1).max(20),
  positionX: z.number().min(0).max(100),
  positionY: z.number().min(0).max(100),
  description: z.string().min(1).max(5000),
  status: z.enum(["published", "draft"]),
});

export async function GET(request: NextRequest) {
  await ensureCampusMapIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "50") || 50)
  );
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const result = await listCampusMap({
    page,
    pageSize,
    search: search || undefined,
    status: CAMPUS_MAP_STATUSES.find((s) => s === status) || undefined,
    category: CAMPUS_MAP_CATEGORIES.find((c) => c === category) || undefined,
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
    const created = await createCampusMap(parsed.data);
    revalidateTag(CACHE_TAGS.campusMapList, "max");
    revalidatePath("/about/campus-map");
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create landmark" },
      { status: 500 }
    );
  }
}
