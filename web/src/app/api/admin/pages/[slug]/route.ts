// src/app/api/admin/pages/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import { upsertPageContent, getPageContentBySlug } from "@/repositories/page-content.repository";
import { filterEditableFields, PROGRAMS_PAGE_SCHEMA } from "@/types/page-content";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  const { slug } = await params;
  const content = await getPageContentBySlug(slug);

  if (!content) {
    return NextResponse.json(
      { error: "Page content not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(content);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  const { slug } = await params;
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

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

  try {
    const updated = await upsertPageContent(slug, filteredContent);
    
    // Invalidate cache for this page content
    updateTag(CACHE_TAGS.pageContent(slug));

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating page content:", err);
    return NextResponse.json(
      { error: "Failed to update page content" },
      { status: 500 }
    );
  }
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
    updateTag(CACHE_TAGS.pageContent(slug));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting page content:", err);
    return NextResponse.json(
      { error: "Failed to delete page content" },
      { status: 500 }
    );
  }
}
