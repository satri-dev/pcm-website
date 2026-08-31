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
<<<<<<< HEAD

  return NextResponse.json(content);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

<<<<<<< HEAD:web/src/app/api/admin/pages/[slug]/route.ts
  const { slug } = await params;
=======
  const { slug } = await ctx.params;
  const slugString = normalizeSlug(slug);

>>>>>>> 4759ccc (feat: enhance about page and board of directors section with dynamic metadata and content management):web/src/app/api/admin/pages/[...slug]/route.ts
  let body: unknown;

=======
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  const { slug } = await ctx.params;
  const slugString = normalizeSlug(slug);

  let body: unknown;
>>>>>>> 4759ccc98020e972b33cac1a93eb632d1831c83f
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

<<<<<<< HEAD
  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Request body must be an object" },
      { status: 400 }
    );
  }

  // Filter out locked fields based on schema
  let filteredContent = body as Record<string, unknown>;
  
  if (slug === "programs") {
    filteredContent = filterEditableFields(body as Record<string, unknown>, PROGRAMS_PAGE_SCHEMA);
  }

=======
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

>>>>>>> 4759ccc98020e972b33cac1a93eb632d1831c83f
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
<<<<<<< HEAD
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { slug } = await params;

  try {
    const { deletePageContent } = await import("@/repositories/page-content.repository");
    const success = await deletePageContent(slug);

    if (!success) {
      return NextResponse.json(
        { error: "Page content not found" },
        { status: 404 }
      );
    }

    // Invalidate cache
    revalidateTag(CACHE_TAGS.pageContent(slug), "max");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting page content:", err);
    return NextResponse.json(
      { error: "Failed to delete page content" },
      { status: 500 }
    );
  }
}
=======
}
>>>>>>> 4759ccc98020e972b33cac1a93eb632d1831c83f
