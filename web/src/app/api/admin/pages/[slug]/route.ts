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
  params: Promise<{ slug: string }>;
}

function publicPath(slug: string): string {
  return slug === "home" ? "/" : `/${slug}`;
}

export async function GET(_request: NextRequest, ctx: RouteCtx) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  const { slug } = await ctx.params;
  await ensurePageContentsReady();

  try {
    const content = await getPageContentBySlug(slug);
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: "Failed to load page content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  const { slug } = await ctx.params;
  await ensurePageContentsReady();

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
    const existing = await getPageContentBySlug(slug);
    const saved = await upsertPageContent(slug, parsed.data, existing);
    revalidateTag(CACHE_TAGS.pageContent, "max");
    revalidateTag(pageContentTag(slug), "max");
    revalidatePath(publicPath(slug), "page");
    return NextResponse.json({ content: saved });
  } catch {
    return NextResponse.json(
      { error: "Failed to save page content" },
      { status: 500 }
    );
  }
}