import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getAboutPageSettings,
  updateAboutPageSettings,
} from "@/repositories/about-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const vmvSchema = z.object({
  id: z.string().min(1).max(100),
  iconType: z.enum(["vision", "mission", "values"]),
  iconBg: z.string().max(50),
  iconColor: z.string().max(50),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(2000),
});

const diffSchema = z.object({
  id: z.string().min(1).max(100),
  iconType: z.enum([
    "faculty",
    "lectures",
    "it-courses",
    "extracurriculars",
    "industry",
    "student-care",
  ]),
  iconBg: z.string().max(50),
  iconColor: z.string().max(50),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(1000),
});

const statSchema = z.object({
  id: z.string().min(1).max(100),
  value: z.string().min(1).max(50),
  label: z.string().min(1).max(200),
});

const settingsSchema = z.object({
  seoTitle: z.string().min(1).max(300),
  seoDescription: z.string().min(1).max(1000),
  seoKeywords: z.array(z.string().max(100)).max(20),
  ogImage: z.string().max(1000),

  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),

  whoEyebrow: z.string().min(1).max(200),
  whoTitle: z.string().min(1).max(300),
  whoParagraphs: z.array(z.string().max(2000)).max(10),
  whoPills: z.array(z.string().max(200)).max(10),
  whoImageSrc: z.string().max(1000),
  whoImageAlt: z.string().max(500),
  whoBadgeValue: z.string().min(1).max(50),
  whoBadgeLabel: z.string().min(1).max(200),

  whyEyebrow: z.string().min(1).max(200),
  whyTitle: z.string().min(1).max(300),
  whyParagraphs: z.array(z.string().max(2000)).max(10),
  whyImageSrc: z.string().max(1000),
  whyImageAlt: z.string().max(500),
  whyCtaLabel: z.string().min(1).max(200),
  whyCtaHref: z.string().min(1).max(500),

  vmvEyebrow: z.string().min(1).max(200),
  vmvTitle: z.string().min(1).max(300),
  vmvCards: z.array(vmvSchema).max(20),

  diffEyebrow: z.string().min(1).max(200),
  diffTitle: z.string().min(1).max(300),
  diffItems: z.array(diffSchema).max(30),

  statsEyebrow: z.string().min(1).max(200),
  statsTitle: z.string().min(1).max(300),
  stats: z.array(statSchema).max(12),

  voicesEyebrow: z.string().min(1).max(200),
  voicesTitle: z.string().min(1).max(300),
  voicesSubtitle: z.string().min(1).max(1000),
  voicesPerPage: z.number().int().min(1).max(12),

  ctaEyebrow: z.string().min(1).max(300),
  ctaTitle: z.string().min(1).max(300),
  ctaText: z.string().min(1).max(1500),
  ctaPrimaryLabel: z.string().min(1).max(200),
  ctaPrimaryHref: z.string().min(1).max(500),
  ctaSecondaryLabel: z.string().min(1).max(200),
  ctaSecondaryHref: z.string().min(1).max(500),
});

export async function GET() {
  const settings = await getAboutPageSettings();
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
    const updated = await updateAboutPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.aboutSettings, "max");
    revalidatePath("/about");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update about page settings" },
      { status: 500 }
    );
  }
}
