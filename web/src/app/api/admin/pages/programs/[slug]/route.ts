// src/app/api/admin/pages/programs/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireApiSession } from "@/core/lib/api-guard";
import { getPageContentBySlug, upsertPageContent } from "@/repositories/page-content.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const updateSchema = z.object({
  programSlug: z.string(),
  content: z.object({
    hero: z.object({
      tagline: z.string().optional(),
    }).optional(),
    overview: z.object({
      title: z.string().optional(),
      body: z.array(z.string()).optional(),
    }).optional(),
    concentrations: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
    careers: z.array(z.string()).optional(),
    admissionRequirements: z.array(z.object({
      title: z.string(),
      detail: z.string(),
    })).optional(),
    quickFacts: z.object({
      level: z.string().optional(),
      duration: z.string().optional(),
      semesters: z.number().optional(),
      creditHours: z.number().optional(),
      eligibility: z.string().optional(),
      affiliation: z.string().optional(),
      labels: z.object({
        heading: z.string().optional(),
        level: z.string().optional(),
        duration: z.string().optional(),
        semesters: z.string().optional(),
        creditHours: z.string().optional(),
        eligibility: z.string().optional(),
        affiliation: z.string().optional(),
      }).optional(),
    }).optional(),
    curriculum: z.array(z.object({
      label: z.string(),
      courses: z.array(z.object({
        code: z.string(),
        description: z.string(),
        credits: z.string(),
      })),
    })).optional(),
    totalCredits: z.string().optional(),
    curriculumSection: z.object({
      eyebrow: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
    coordinator: z.object({
      name: z.string().optional(),
      initials: z.string().optional(),
      image: z.string().optional(),
      role: z.string().optional(),
      quote: z.string().optional(),
    }).optional(),
    growthSection: z.object({
      title: z.string().optional(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
      })).optional(),
    }).optional(),
    callout: z.object({
      title: z.string().optional(),
      body: z.string().optional(),
    }).optional(),
    cta: z.object({
      title: z.string().optional(),
      body: z.string().optional(),
      buttons: z.object({
        primary: z.object({
          text: z.string().optional(),
          url: z.string().optional(),
        }).optional(),
        secondary: z.object({
          text: z.string().optional(),
          url: z.string().optional(),
        }).optional(),
      }).optional(),
    }).optional(),
  }),
});

export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  const { slug } = await ctx.params;

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
    // Get existing page content for programs
    const existing = await getPageContentBySlug("programs");
    
    console.log("[PUT /api/admin/pages/programs/[slug]] Existing content:", existing);
    console.log("[PUT /api/admin/pages/programs/[slug]] New content for", parsed.data.programSlug, ":", parsed.data.content);
    
    // Merge the new program-specific content
    const programPages = {
      ...(existing?.content?.programPages || {}),
      [parsed.data.programSlug]: parsed.data.content,
    };

    console.log("[PUT /api/admin/pages/programs/[slug]] Merged programPages:", programPages);

    // Update the page content with the merged programPages
    const updated = await upsertPageContent("programs", {
      ...(existing?.content || {}),
      programPages,
    });

    console.log("[PUT /api/admin/pages/programs/[slug]] Update result:", updated);

    // Invalidate caches
    revalidateTag(CACHE_TAGS.pageContent("programs"));
    revalidateTag(CACHE_TAGS.program(slug));
    
    console.log("[PUT /api/admin/pages/programs/[slug]] Cache invalidated for:", CACHE_TAGS.pageContent("programs"), CACHE_TAGS.program(slug));

    return NextResponse.json({ ok: true, updated });
  } catch (err) {
    console.error("[PUT /api/admin/pages/programs/[slug]]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 500 }
    );
  }
}
