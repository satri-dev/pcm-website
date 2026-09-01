import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getCareersPageSettings,
  updateCareersPageSettings,
} from "@/repositories/careers-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const jobSchema = z.object({
  id: z.string().min(1).max(100),
  title: z.string().min(1).max(300),
  department: z.string().min(1).max(200),
  type: z.enum(["Full-time", "Part-time", "Contract"]),
  iconType: z.enum(["management", "tech", "lab", "admin"]),
  iconBg: z.string().max(50),
  iconColor: z.string().max(50),
  description: z.string().min(1).max(1000),
  requirements: z.string().min(1).max(1000),
  applyEmail: z.string().min(1).max(300),
  applySubject: z.string().min(1).max(500),
});

const stepSchema = z.object({
  id: z.string().min(1).max(100),
  text: z.string().min(1).max(500),
});

const benefitSchema = z.object({
  id: z.string().min(1).max(100),
  iconType: z.enum(["culture", "growth", "impact"]),
  iconBg: z.string().max(50),
  iconColor: z.string().max(50),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(1000),
});

const settingsSchema = z.object({
  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),

  openingsEyebrow: z.string().min(1).max(200),
  openingsTitle: z.string().min(1).max(300),
  openingsSubtitle: z.string().min(1).max(1000),
  openings: z.array(jobSchema).max(20),

  applyEyebrow: z.string().min(1).max(200),
  applyTitle: z.string().min(1).max(300),
  applyParagraph: z.string().min(1).max(1500),
  applySteps: z.array(stepSchema).max(20),
  applyPills: z.array(z.string().max(100)).max(10),
  applyImageSrc: z.string().max(1000),
  applyImageAlt: z.string().max(500),

  benefitsEyebrow: z.string().min(1).max(200),
  benefitsTitle: z.string().min(1).max(300),
  benefitsSubtitle: z.string().min(1).max(1000),
  benefits: z.array(benefitSchema).max(20),

  ctaEyebrow: z.string().min(1).max(300),
  ctaTitle: z.string().min(1).max(300),
  ctaText: z.string().min(1).max(1500),
  ctaEmailAddress: z.string().min(1).max(300),
  ctaEmailSubject: z.string().min(1).max(500),
  ctaPrimaryLabel: z.string().min(1).max(300),
  ctaSecondaryLabel: z.string().min(1).max(200),
  ctaSecondaryHref: z.string().min(1).max(500),

  seoTitle: z.string().min(1).max(300),
  seoDescription: z.string().min(1).max(1000),
  seoKeywords: z.array(z.string().max(100)).max(20),
  ogImage: z.string().max(1000),
});

export async function GET() {
  const settings = await getCareersPageSettings();
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
    const updated = await updateCareersPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.careersSettings, "max");
    revalidatePath("/career");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update careers page settings" },
      { status: 500 }
    );
  }
}
