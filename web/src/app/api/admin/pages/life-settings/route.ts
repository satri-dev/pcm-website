import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getLifePageSettings,
  updateLifePageSettings,
} from "@/repositories/life-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const featureCardSchema = z.object({
  title: z.string().min(1).max(300),
  desc: z.string().min(1).max(1500),
});

const settingsSchema = z.object({
  seoTitle: z.string().min(1).max(300),
  seoDescription: z.string().min(1).max(1000),
  seoKeywords: z.array(z.string().max(100)).max(20),
  ogImage: z.string().max(1000),

  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),

  eventsEyebrow: z.string().min(1).max(200),
  eventsTitle: z.string().min(1).max(300),
  eventsSubtitle: z.string().min(1).max(1500),
  eventCards: z.array(featureCardSchema).max(12),

  workshopsEyebrow: z.string().min(1).max(200),
  workshopsTitle: z.string().min(1).max(300),
  workshopsSubtitle: z.string().min(1).max(1500),
  workshopCards: z.array(featureCardSchema).max(12),

  clubsEyebrow: z.string().min(1).max(200),
  clubsTitle: z.string().min(1).max(300),
  clubsSubtitle: z.string().min(1).max(1500),
  clubCards: z.array(featureCardSchema).max(12),

  galleryEyebrow: z.string().min(1).max(200),
  galleryTitle: z.string().min(1).max(300),
  gallerySubtitle: z.string().min(1).max(1500),
  galleryButtonLabel: z.string().min(1).max(200),
  galleryButtonHref: z.string().min(1).max(500),

  ctaTitle: z.string().min(1).max(300),
  ctaText: z.string().min(1).max(1500),
  ctaPrimaryLabel: z.string().min(1).max(200),
  ctaPrimaryHref: z.string().min(1).max(500),
  ctaSecondaryLabel: z.string().min(1).max(200),
  ctaSecondaryHref: z.string().min(1).max(500),
});

export async function GET() {
  const settings = await getLifePageSettings();
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
    const updated = await updateLifePageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.lifeSettings, "max");
    revalidatePath("/life");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update life at PCM page settings" },
      { status: 500 }
    );
  }
}
