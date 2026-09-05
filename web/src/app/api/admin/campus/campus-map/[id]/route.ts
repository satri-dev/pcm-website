import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  deleteCampusMap,
  getCampusMapById,
  updateCampusMap,
  restoreCampusMap,
  hardDeleteCampusMap,
} from "@/repositories/campus-map.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

function revalidateCampusMap() {
  revalidateTag(CACHE_TAGS.campusMapList, "max");
  revalidatePath("/about/campus-map");
}

const updateSchema = z
  .object({
    name: z.string().min(2).max(200),
    category: z.string().min(1).max(100),
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
  const { id } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "restore" || action === "permanent-delete") {
    const guard = await requireApiSession(["admin"]);
    if (!guard.ok) return guard.response;

    if (action === "restore") {
      try {
        const restored = await restoreCampusMap(id);
        if (!restored) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateCampusMap();
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to restore landmark" },
          { status: 500 }
        );
      }
    }

    if (action === "permanent-delete") {
      try {
        const deleted = await hardDeleteCampusMap(id);
        if (!deleted) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateCampusMap();
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to permanently delete landmark" },
          { status: 500 }
        );
      }
    }
  }

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

  try {
    const updated = await updateCampusMap(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateCampusMap();
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
    const deleted = await deleteCampusMap(id, guard.session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateCampusMap();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete landmark" },
      { status: 500 }
    );
  }
}


