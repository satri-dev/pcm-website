import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { upsertPageContent } from "@/repositories/page-content.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { PROGRAMS_PAGE_SCHEMA, filterEditableFields } from "@/types/page-content";

/**
 * PUT /api/admin/pages/programs
 * Updates the Programs page content (hero, intro, comparison table, CTA, featured program refs)
 * Only accepts fields marked as "editable" in PROGRAMS_PAGE_SCHEMA
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Server-side enforcement: strip any locked fields
    const safeContent = filterEditableFields(body, PROGRAMS_PAGE_SCHEMA);

    // Upsert page content
    await upsertPageContent("programs", safeContent);

    // Invalidate page content cache (does NOT invalidate programs cache)
    revalidateTag(CACHE_TAGS.pageContent("programs"), "max");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/admin/pages/programs] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save page content" },
      { status: 500 }
    );
  }
}
