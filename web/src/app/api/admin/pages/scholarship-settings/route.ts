import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getScholarshipPageSettings,
  updateScholarshipPageSettings,
} from "@/repositories/scholarship-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const stepSchema = z.object({
  id: z.string().min(1).max(100),
  text: z.string().min(1).max(500),
});

const faqSchema = z.object({
  id: z.string().min(1).max(100),
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(2000),
});

const settingsSchema = z.object({
  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),

  supportEyebrow: z.string().min(1).max(200),
  supportTitle: z.string().min(1).max(300),
  supportSubtitle: z.string().min(1).max(1000),

  applyEyebrow: z.string().min(1).max(200),
  applyTitle: z.string().min(1).max(300),
  applySubtitle: z.string().min(1).max(1000),
  applySteps: z.array(stepSchema).max(20),
  applyImageSrc: z.string().max(2000),
  applyImageAlt: z.string().max(500),
  applyCtaLabel: z.string().min(1).max(200),
  applyCtaHref: z.string().min(1).max(500),

  faqEyebrow: z.string().min(1).max(200),
  faqTitle: z.string().min(1).max(300),
  faqSubtitle: z.string().min(1).max(1000),
  faqs: z.array(faqSchema).max(30),

  ctaEyebrow: z.string().min(1).max(300),
  ctaTitle: z.string().min(1).max(300),
  ctaText: z.string().min(1).max(1500),
  ctaPrimaryLabel: z.string().min(1).max(200),
  ctaPrimaryHref: z.string().min(1).max(500),
  ctaSecondaryLabel: z.string().min(1).max(200),
  ctaSecondaryHref: z.string().min(1).max(500),

  seoTitle: z.string().min(1).max(300),
  seoDescription: z.string().min(1).max(1000),
  seoKeywords: z.array(z.string().max(100)).max(20),
  ogImage: z.string().max(2000),
});

export async function GET() {
  const settings = await getScholarshipPageSettings();
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
    const updated = await updateScholarshipPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.scholarshipPageSettings, "max");
    revalidatePath("/scholarship");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update scholarship page settings" },
      { status: 500 }
    );
  }
}
