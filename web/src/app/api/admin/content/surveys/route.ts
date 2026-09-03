import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  createSurvey,
  ensureSurveyIndexes,
  listSurveys,
} from "@/repositories/surveys.repository";
import { SURVEY_CATEGORIES, SURVEY_STATUSES, SurveyQuestion } from "@/types/surveys";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

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

const createSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  excerpt: z.string().min(1).max(1000),
  content: z.string().optional().default(""),
  category: z.string().min(1).max(100),
  icon: z.string().min(1).max(10),
  status: z.enum(["published", "draft"]),
  featured: z.boolean().optional(),
  endsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date").optional(),
  questions: z.array(questionSchema).default([]),
  tags: z.array(z.string()).optional(),
  seo: seoSchema.optional(),
});

export async function GET(request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  await ensureSurveyIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "8") || 8)
  );
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const result = await listSurveys({
    page,
    pageSize,
    search: search || undefined,
    status: SURVEY_STATUSES.find((s) => s === status) || undefined,
    category: SURVEY_CATEGORIES.find((c) => c === category) || undefined,
  });

  return NextResponse.json(result);
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
    const created = await createSurvey(parsed.data);
    revalidateTag(CACHE_TAGS.surveysList, "max");
    revalidateTag(CACHE_TAGS.survey(created.slug), "max");
    revalidatePath("/survey");
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create survey" },
      { status: 500 }
    );
  }
}