import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  ensurePageContentsReady,
  getPageContentBySlug,
  upsertPageContent,
} from "@/repositories/page-content.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS, pageContentTag } from "@/lib/cache-tags";

const sectionSchema = z.object({
  key: z.string().trim().min(1).max(200),
  eyebrow: z.string().trim().max(300).optional(),
  title: z.string().trim().max(300).optional(),
  subtitle: z.string().trim().max(600).optional(),
  paragraphs: z.array(z.string().trim().max(5000)).optional(),
  checklist: z.array(z.string().trim().max(500)).optional(),
});

const bodySchema = z.object({
  label: z.string().trim().min(1).max(200).optional(),
  hero: z
    .object({
      title: z.string().trim().min(1).max(300),
      subtitle: z.string().trim().max(600),
    })
    .optional(),
  sections: z.array(sectionSchema).optional(),
});

interface RouteCtx {
  params: Promise<{ slug: string | string[] }>;
}

function normalizeSlug(slug: string | string[]): string {
  return Array.isArray(slug) ? slug.join("/") : slug;
}

function publicPath(slug: string): string {
  return slug === "home" ? "/" : `/${slug}`;
}

function errorResponse(err: unknown, fallback: string) {
  const message =
    err instanceof Error && err.message && err.message.length < 300
      ? err.message
      : fallback;
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(_request: NextRequest, ctx: RouteCtx) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  const { slug } = await ctx.params;
  const slugString = normalizeSlug(slug);

  try {
    await ensurePageContentsReady();
    const content = await getPageContentBySlug(slugString);
    return NextResponse.json({ content });
  } catch (err) {
    console.error(`GET /api/admin/pages/${slugString}`, err);
    return errorResponse(err, "Failed to load page content");
  }
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  const { slug } = await ctx.params;
  const slugString = normalizeSlug(slug);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    await ensurePageContentsReady();
    const existing = await getPageContentBySlug(slugString);
    const saved = await upsertPageContent(slugString, parsed.data, existing);
    revalidateTag(CACHE_TAGS.pageContent, { expire: 0 });
    revalidateTag(pageContentTag(slugString), { expire: 0 });
    revalidatePath(publicPath(slugString), "page");
    return NextResponse.json({ content: saved });
  } catch (err) {
    console.error(`PUT /api/admin/pages/${slugString}`, err);
    return errorResponse(err, "Failed to save page content");
  }
}