import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  createClub,
  ensureClubIndexes,
  listClubs,
} from "@/repositories/club.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

const clubMemberSchema = z.object({
  photo: z.string(),
  name: z.string().min(1),
  position: z.string().min(1),
  program: z.string(),
});

const createSchema = z.object({
  name: z.string().min(2).max(200),
  icon: z.string().min(1).max(20),
  tagline: z.string().min(1).max(300),
  image: z.string().optional(),
  desc: z.string().optional(),
  members: z.array(clubMemberSchema).optional(),
});

export async function GET(request: NextRequest) {
  await ensureClubIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "50") || 50)
  );
  const search = searchParams.get("search");

  const result = await listClubs({
    page,
    pageSize,
    search: search || undefined,
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
    const created = await createClub(parsed.data);
    revalidateTag(CACHE_TAGS.clubsList, "max");
    revalidatePath("/clubs");
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create club" },
      { status: 500 }
    );
  }
}
