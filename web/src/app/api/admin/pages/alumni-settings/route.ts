import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getAlumniPageSettings,
  updateAlumniPageSettings,
} from "@/repositories/alumni-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const pathSchema = z.object({
  id: z.string().min(1).max(100),
  iconType: z.enum(["bank", "tech", "entrepreneurship", "education"]),
  iconBg: z.string().max(50),
  iconColor: z.string().max(50),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(1000),
});

const settingsSchema = z.object({
  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),

  familyEyebrow: z.string().min(1).max(200),
  familyTitle: z.string().min(1).max(300),
  familyParagraphs: z.array(z.string().max(2000)).max(10),
  familyPills: z.array(z.string().max(200)).max(10),
  familyImageSrc: z.string().max(1000),
  familyImageAlt: z.string().max(500),
  badgeValue: z.string().min(1).max(50),
  badgeLabel: z.string().min(1).max(200),

  spotlightEyebrow: z.string().min(1).max(200),
  spotlightTitle: z.string().min(1).max(300),
  spotlightSubtitle: z.string().min(1).max(1000),

  pathsEyebrow: z.string().min(1).max(200),
  pathsTitle: z.string().min(1).max(300),
  careerPaths: z.array(pathSchema).max(20),

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
  ogImage: z.string().max(1000),
});

export async function GET() {
  const settings = await getAlumniPageSettings();
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
    const updated = await updateAlumniPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.alumniSettings, "max");
    revalidatePath("/alumni");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update alumni page settings" },
      { status: 500 }
    );
  }
}