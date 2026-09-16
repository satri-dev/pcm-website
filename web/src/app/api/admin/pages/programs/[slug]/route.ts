// src/app/api/admin/pages/programs/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireApiSession } from "@/core/lib/api-guard";
import { getPageContentBySlug, upsertPageContent } from "@/repositories/page-content.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const heroSchema = z.object({
  tagline: z.string().optional(),
});
const overviewSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
});
const concentrationsSchema = z.array(
  z.object({ title: z.string(), description: z.string() })
);
const careersSchema = z.array(z.string());
const admissionRequirementsSchema = z.array(
  z.object({ title: z.string(), detail: z.string() })
);
const quickFactsSchema = z.object({
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
});
const curriculumSchema = z.array(
  z.object({
    label: z.string(),
    courses: z.array(
      z.object({
        code: z.string(),
        description: z.string(),
        credits: z.string(),
      })
    ),
  })
);
const curriculumSectionSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});
const coordinatorSchema = z.object({
  name: z.string().optional(),
  initials: z.string().optional(),
  image: z.string().optional(),
  role: z.string().optional(),
  quote: z.string().optional(),
});
const growthSectionSchema = z.object({
  title: z.string().optional(),
  items: z.array(
    z.object({ title: z.string(), description: z.string() })
  ).optional(),
});
const calloutSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
});
const ctaSchema = z.object({
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
});

const contentSchema = z.object({
  hero: heroSchema.optional(),
  overview: overviewSchema.optional(),
  concentrations: concentrationsSchema.optional(),
  careers: careersSchema.optional(),
  admissionRequirements: admissionRequirementsSchema.optional(),
  quickFacts: quickFactsSchema.optional(),
  curriculum: curriculumSchema.optional(),
  totalCredits: z.string().optional(),
  curriculumSection: curriculumSectionSchema.optional(),
  coordinator: coordinatorSchema.optional(),
  growthSection: growthSectionSchema.optional(),
  callout: calloutSchema.optional(),
  cta: ctaSchema.optional(),
});

const updateSchema = z.object({
  programSlug: z.string(),
  section: z.string().optional(),
  content: contentSchema,
});

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Deep merge so a partial section save never drops sibling fields it didn't edit
// (e.g. saving "quickFacts" keeps existing cta.title/body while updating buttons).
function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (isPlainObject(value) && isPlainObject(out[key])) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

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
    const { programSlug, section, content } = parsed.data;

    if (Object.keys(content).length === 0) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    // Get existing page content for programs
    const existing = await getPageContentBySlug("programs");
    const programPages = (existing?.content?.programPages ||
      {}) as Record<string, Record<string, unknown>>;

    let nextProgramContent: Record<string, unknown>;
    if (section) {
      // Partial save — only this section is merged into the existing content
      nextProgramContent = deepMerge(
        programPages[programSlug] || {},
        content as unknown as Record<string, unknown>
      );
    } else {
      // Full save — replaces the whole program page content
      nextProgramContent = content as unknown as Record<string, unknown>;
    }

    const mergedProgramPages = {
      ...programPages,
      [programSlug]: nextProgramContent,
    };

    const updated = await upsertPageContent("programs", {
      ...(existing?.content || {}),
      programPages: mergedProgramPages,
    });

    // Invalidate caches
    revalidateTag(CACHE_TAGS.pageContent("programs"), "max");
    revalidateTag(CACHE_TAGS.program(slug), "max");

    return NextResponse.json({ ok: true, updated });
  } catch (err) {
    console.error("[PUT /api/admin/pages/programs/[slug]]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 500 }
    );
  }
}