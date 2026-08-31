import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import { getNewsPageSettings, updateNewsPageSettings } from "@/repositories/news-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const settingsSchema = z.object({
  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),
  featuredEyebrow: z.string().min(1).max(200),
  featuredTitle: z.string().min(1).max(300),
  storiesEyebrow: z.string().min(1).max(200),
  storiesTitle: z.string().min(1).max(300),
  sidebarNoticesTitle: z.string().min(1).max(200),
  sidebarNotices: z.array(z.object({ day: z.string().max(10), month: z.string().max(20), title: z.string().max(500), ago: z.string().max(100) })).max(20),
  newsletterTitle: z.string().min(1).max(200),
  newsletterText: z.string().min(1).max(1000),
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
  const settings = await getNewsPageSettings();
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
    const updated = await updateNewsPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.newsSettings, { expire: 0 });
    revalidatePath("/news");
    revalidatePath("/");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
