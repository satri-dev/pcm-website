import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getPlacementsPageSettings,
  updatePlacementsPageSettings,
} from "@/repositories/placements-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const partnerSchema = z.object({
  id: z.string().min(1).max(100),
  sector: z.string().min(1).max(200),
  iconType: z.enum(["bank", "tech", "corporate"]),
  iconBg: z.string().max(50),
  iconColor: z.string().max(50),
  companies: z.string().min(1).max(500),
  description: z.string().min(1).max(1000),
});

const serviceSchema = z.object({
  id: z.string().min(1).max(100),
  text: z.string().min(1).max(500),
});

const statSchema = z.object({
  id: z.string().min(1).max(100),
  value: z.string().min(1).max(50),
  label: z.string().min(1).max(200),
});

const settingsSchema = z.object({
  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),

  classEyebrow: z.string().min(1).max(200),
  classTitle: z.string().min(1).max(300),
  classParagraphs: z.array(z.string().max(2000)).max(10),
  classPills: z.array(z.string().max(200)).max(10),
  classImageSrc: z.string().max(1000),
  classImageAlt: z.string().max(500),
  badgeValue: z.string().min(1).max(50),
  badgeLabel: z.string().min(1).max(200),

  partnersEyebrow: z.string().min(1).max(200),
  partnersTitle: z.string().min(1).max(300),
  partnersSubtitle: z.string().min(1).max(1000),
  partners: z.array(partnerSchema).max(20),

  guidanceEyebrow: z.string().min(1).max(200),
  guidanceTitle: z.string().min(1).max(300),
  guidanceParagraph: z.string().min(1).max(2000),
  guidanceImageSrc: z.string().max(1000),
  guidanceImageAlt: z.string().max(500),
  services: z.array(serviceSchema).max(20),

  stats: z.array(statSchema).max(10),

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
  const settings = await getPlacementsPageSettings();
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
    const updated = await updatePlacementsPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.placementsSettings, { expire: 0 });
    revalidatePath("/placements");
    revalidatePath("/");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update placements page settings" },
      { status: 500 }
    );
  }
}
