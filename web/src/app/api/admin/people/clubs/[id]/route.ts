import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteClub,
  getClubById,
  updateClub,
} from "@/repositories/club.repository";
import { requireApiSession } from "@/core/lib/api-guard";

const clubMemberSchema = z.object({
  photo: z.string(),
  name: z.string().min(1),
  position: z.string().min(1),
  program: z.string(),
});

const updateSchema = z
  .object({
    name: z.string().min(2).max(200),
    icon: z.string().min(1).max(20),
    tagline: z.string().min(1).max(300),
    image: z.string(),
    desc: z.string(),
    members: z.array(clubMemberSchema),
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
    const item = await getClubById(id);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch club" },
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
    const updated = await updateClub(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate entry" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update club" },
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
    const deleted = await deleteClub(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete club" },
      { status: 500 }
    );
  }
}
