import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getPageContentBySlug,
  upsertPageContent,
} from "@/repositories/page-content.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  PROGRAMS_PAGE_SCHEMA,
  filterEditableFields,
} from "@/types/page-content";

type ProgramsSchema = typeof PROGRAMS_PAGE_SCHEMA;

/**
 * PUT /api/admin/pages/programs
 * Updates the Programs page content (hero, intro, comparison table, CTA, featured program refs).
 * Two modes:
 *  - Full save: the whole content object is stored (no "section" key).
 *  - Section save: { section, content } — only that section is merged into the
 *    existing page content so the rest of the page stays untouched.
 * Only accepts fields marked as "editable" in PROGRAMS_PAGE_SCHEMA
 */
export async function PUT(req: NextRequest) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  try {
    const body = (await req.json()) as {
      section?: string;
      content?: unknown;
    };

    const { section, content } = body;

    if (section) {
      const fieldSchema = PROGRAMS_PAGE_SCHEMA[section as keyof ProgramsSchema];
      if (!fieldSchema) {
        return NextResponse.json(
          { error: `Unknown section: ${section}` },
          { status: 400 }
        );
      }

      // Server-side enforcement: strip any locked fields from this section.
      // Top-level "editable" sections (e.g. featuredProgramRefs arrays) pass through.
      let safeSection: unknown;
      if (fieldSchema === "editable") {
        safeSection = content;
      } else {
        safeSection = filterEditableFields(
          (content || {}) as Record<string, unknown>,
          fieldSchema as unknown as ProgramsSchema
        );
      }

      // Merge only this section into the existing page content
      const existing = await getPageContentBySlug("programs");
      const current = (existing?.content || {}) as Record<string, unknown>;
      const safeContent = { ...current, [section]: safeSection };

      await upsertPageContent("programs", safeContent);
    } else {
      // Full-page save — the payload is the section data itself
      const safeContent = filterEditableFields(
        (content ?? body) as Record<string, unknown>,
        PROGRAMS_PAGE_SCHEMA
      );

      await upsertPageContent("programs", safeContent);
    }

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
