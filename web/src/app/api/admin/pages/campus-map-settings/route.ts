import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getCampusMapPageSettings,
  updateCampusMapPageSettings,
} from "@/repositories/campus-map-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const settingsSchema = z.object({
  seoTitle: z.string().min(1).max(300),
  seoDescription: z.string().min(1).max(1000),
  seoKeywords: z.array(z.string().max(100)).max(20),
  ogImage: z.string().max(1000),

  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),

  exploreEyebrow: z.string().min(1).max(200),
  exploreTitle: z.string().min(1).max(300),
  exploreSubtitle: z.string().min(1).max(1500),
  facilitiesButtonLabel: z.string().min(1).max(200),
  facilitiesButtonHref: z.string().min(1).max(500),

  locationEyebrow: z.string().min(1).max(200),
  locationTitle: z.string().min(1).max(300),
  locationParagraph: z.string().min(1).max(3000),
  locationChecklist: z.array(z.string().min(1).max(500)).max(20),
  locationImage: z.string().max(1000),
  locationImageAlt: z.string().max(500),
  locationBadgeValue: z.string().min(1).max(20),
  locationBadgeLabel: z.string().min(1).max(200),
  directionsButtonLabel: z.string().min(1).max(200),
  directionsButtonHref: z.string().min(1).max(1000),

  ctaTitle: z.string().min(1).max(300),
  ctaText: z.string().min(1).max(1500),
  ctaPrimaryLabel: z.string().min(1).max(200),
  ctaPrimaryHref: z.string().min(1).max(500),
  ctaSecondaryLabel: z.string().min(1).max(200),
  ctaSecondaryHref: z.string().min(1).max(500),
});

export async function GET() {
  const settings = await getCampusMapPageSettings();
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
    const updated = await updateCampusMapPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.campusMapSettings, "max");
    revalidatePath("/about/campus-map");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update campus map page settings" },
      { status: 500 }
    );
  }
}
