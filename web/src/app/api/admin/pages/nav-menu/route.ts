import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import {
  createNavMenu,
  ensureNavMenusReady,
  listNavMenu,
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

const createSchema = z.object({
  label: z.string().trim().min(1).max(100),
  type: z.enum(["link", "dropdown", "mega"]),
  href: z.string().trim().max(500).optional(),
  children: z.array(linkItemSchema).optional(),
  columns: z.array(columnSchema).optional(),
  order: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export async function GET(_request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  await ensureNavMenusReady();

  try {
    const items = await listNavMenu();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json(
      { error: "Failed to load navbar menu" },
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
    const created = await createNavMenu(parsed.data);
    revalidateTag(CACHE_TAGS.navMenu, "max");
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create navbar item" },
      { status: 500 }
    );
  }
}