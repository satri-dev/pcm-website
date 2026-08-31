import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import { getResultsPageSettings, updateResultsPageSettings } from "@/repositories/results-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const settingsSchema = z.object({
  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),
  sectionEyebrow: z.string().min(1).max(200),
  sectionTitle: z.string().min(1).max(300),
  portalTitle: z.string().min(1).max(300),
  portalText: z.string().min(1).max(1500),
  portalUrl: z.string().min(1).max(500),
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
});

export async function GET() {
  const settings = await getResultsPageSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 422 });
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 422 });
  try {
    const updated = await updateResultsPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.resultsSettings, { expire: 0 });
    revalidatePath("/results");
    revalidatePath("/");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
