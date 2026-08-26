import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteCampusMap,
  getCampusMapById,
  updateCampusMap,
} from "@/repositories/campus-map.repository";
import { requireApiSession } from "@/core/lib/api-guard";

const updateSchema = z
  .object({
    name: z.string().min(2).max(200),
    category: z.enum(["Academic", "Administration", "Student Life", "Sports", "Library", "IT"]),
    icon: z.string().min(1).max(20),
    positionX: z.number().min(0).max(100),
    positionY: z.number().min(0).max(100),
    description: z.string().min(1).max(5000),
    status: z.enum(["published", "draft"]),
  })
  .partial();

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  try {
    const landmark = await getCampusMapById(id);
    if (!landmark) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(landmark);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch landmark" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin", "editor"]);
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
    const updated = await updateCampusMap(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update landmark" },
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
    const deleted = await deleteCampusMap(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete landmark" },
      { status: 500 }
    );
  }
}
