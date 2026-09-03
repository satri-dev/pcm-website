import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getSurveyPageSettings,
  updateSurveyPageSettings,
} from "@/repositories/survey-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const settingsSchema = z.object({
  seoTitle: z.string().min(1).max(300),
  seoDescription: z.string().min(1).max(1000),
  seoKeywords: z.array(z.string().max(100)).max(20),

  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),

  listEyebrow: z.string().min(1).max(200),
  listTitle: z.string().min(1).max(300),
  listSubtitle: z.string().min(1).max(1000),
  perPage: z.number().int().min(1).max(12),

  detailEyebrow: z.string().min(1).max(200),
  detailTitle: z.string().min(1).max(300),
  detailSubtitle: z.string().min(1).max(1000),
  submitLabel: z.string().min(1).max(200),
  backToListLabel: z.string().min(1).max(200),
  thankYouTitle: z.string().min(1).max(200),
  thankYouText: z.string().min(1).max(1000),
  respondentLabel: z.string().min(1).max(200),
  respondentHint: z.string().min(1).max(300),

  emptyTitle: z.string().min(1).max(200),
  emptyText: z.string().min(1).max(600),

  ctaEyebrow: z.string().min(1).max(300),
  ctaTitle: z.string().min(1).max(300),
  ctaText: z.string().min(1).max(1500),
  ctaLabel: z.string().min(1).max(200),
  ctaHref: z.string().min(1).max(500),
});

export async function GET() {
  const settings = await getSurveyPageSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 422 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const updated = await updateSurveyPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.surveysSettings, { expire: 0 });
    revalidatePath("/survey");
    revalidatePath("/");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update survey page settings" },
      { status: 500 }
    );
  }
}
