import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import {
  deleteNavMenu,
  hardDeleteNavMenu,
  restoreNavMenu,
  updateNavMenu,
} from "@/repositories/nav-menu.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

const linkItemSchema = z.object({
  label: z.string().trim().min(1).max(200),
  href: z.string().trim().min(1).max(500),
});

const columnSchema = z.object({
  label: z.string().trim().min(1).max(200),
  links: z.array(linkItemSchema),
});

const updateSchema = z
  .object({
    label: z.string().trim().min(1).max(100),
    type: z.enum(["link", "dropdown", "mega"]),
    href: z.string().trim().max(500).optional(),
    children: z.array(linkItemSchema).optional(),
    columns: z.array(columnSchema).optional(),
    order: z.number().int().min(0).optional(),
    active: z.boolean().optional(),
  })
  .partial();

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
        const restored = await restoreNavMenu(id);
        if (!restored) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateTag(CACHE_TAGS.navMenu, "max");
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to restore navbar item" },
          { status: 500 }
        );
      }
    }

    try {
      const deleted = await hardDeleteNavMenu(id);
      if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      revalidateTag(CACHE_TAGS.navMenu, "max");
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json(
        { error: "Failed to permanently delete navbar item" },
        { status: 500 }
      );
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
    const updated = await updateNavMenu(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.navMenu, "max");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update navbar item" },
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
    const deleted = await deleteNavMenu(id, guard.session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.navMenu, "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete navbar item" },
      { status: 500 }
    );
  }
}