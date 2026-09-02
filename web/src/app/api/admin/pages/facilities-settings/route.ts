import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getFacilitiesPageSettings,
  updateFacilitiesPageSettings,
} from "@/repositories/facilities-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const settingsSchema = z.object({
  seoTitle: z.string().min(1).max(300),
  seoDescription: z.string().min(1).max(1000),
  seoKeywords: z.array(z.string().max(100)).max(20),
  ogImage: z.string().max(1000),

  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),

  campusEyebrow: z.string().min(1).max(200),
  campusTitle: z.string().min(1).max(300),
  campusSubtitle: z.string().min(1).max(1500),

  mapButtonLabel: z.string().min(1).max(200),
  mapButtonHref: z.string().min(1).max(500),

  designedEyebrow: z.string().min(1).max(200),
  designedTitle: z.string().min(1).max(300),
  designedParagraph: z.string().min(1).max(3000),
  designedChecklist: z.array(z.string().min(1).max(500)).max(20),
  designedImage: z.string().max(1000),
  designedImageAlt: z.string().max(500),
  designedBadgeValue: z.string().min(1).max(20),
  designedBadgeLabel: z.string().min(1).max(200),

  ctaTitle: z.string().min(1).max(300),
  ctaText: z.string().min(1).max(1500),
  ctaPrimaryLabel: z.string().min(1).max(200),
  ctaPrimaryHref: z.string().min(1).max(500),
  ctaSecondaryLabel: z.string().min(1).max(200),
  ctaSecondaryHref: z.string().min(1).max(500),
});

export async function GET() {
  const settings = await getFacilitiesPageSettings();
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
    const updated = await updateFacilitiesPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.facilitiesSettings, "max");
    revalidatePath("/about/facility");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update campus & facilities page settings" },
      { status: 500 }
    );
  }
}
