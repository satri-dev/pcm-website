import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  deleteSurvey,
  getSurveyById,
  updateSurvey,
  restoreSurvey,
  hardDeleteSurvey,
} from "@/repositories/surveys.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { SurveyQuestion } from "@/types/surveys";

const questionSchema: z.ZodType<SurveyQuestion> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    type: z.enum(["text", "textarea", "number", "email", "phone", "url", "radio", "checkbox", "select", "rating", "date", "time", "section", "description", "group"]),
    label: z.string().min(1),
    hint: z.string().optional(),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional(),
    maxRating: z.number().int().min(1).max(10).optional(),
    placeholder: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
    children: z.array(questionSchema).optional(),
    visibility: z
      .object({
        parentId: z.string().min(1),
        operator: z.enum(["equals", "notEquals", "contains", "notContains", "in", "notIn", "empty", "notEmpty"]),
        value: z.union([z.string(), z.array(z.string()), z.number()]).optional(),
      })
      .optional(),
  })
);

const seoSchema = z.object({
  title: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
});

const updateSchema = z
  .object({
    title: z.string().min(3).max(200),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
    excerpt: z.string().min(1).max(1000),
    content: z.string().optional().default(""),
    category: z.string().min(1).max(100),
    icon: z.string().min(1).max(10),
    status: z.enum(["published", "draft"]),
    featured: z.boolean(),
    endsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date").optional().nullable(),
    questions: z.array(questionSchema),
    tags: z.array(z.string()).optional(),
    seo: seoSchema.optional(),
  })
  .partial();

function isMongoError(err: unknown): err is { code?: number } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code?: unknown }).code === "number"
  );
}

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const survey = await getSurveyById(id);
    if (!survey) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(survey);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch survey" },
      { status: 500 }
    );
  }
}

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
        const restored = await restoreSurvey(id);
        if (!restored) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateTag(CACHE_TAGS.surveysList, "max");
        revalidatePath("/survey");
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to restore survey" },
          { status: 500 }
        );
      }
    }

    if (action === "permanent-delete") {
      try {
        const deleted = await hardDeleteSurvey(id);
        if (!deleted) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateTag(CACHE_TAGS.surveysList, "max");
        revalidatePath("/survey");
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to permanently delete survey" },
          { status: 500 }
        );
      }
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
    const updated = await updateSurvey(id, parsed.data as Partial<import("@/types/surveys").SurveyCreateInput>);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.surveysList, "max");
    revalidateTag(CACHE_TAGS.survey(updated.slug), "max");
    revalidatePath("/survey");
    return NextResponse.json(updated);
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update survey" },
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
    const deleted = await deleteSurvey(id, guard.session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.surveysList, "max");
    revalidatePath("/survey");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete survey" },
      { status: 500 }
    );
  }
}