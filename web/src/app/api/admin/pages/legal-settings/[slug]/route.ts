import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import { updateLegalPageSettings } from "@/repositories/legal-page-settings.repository";
import { TERMS_PAGE_SETTINGS_KEY, PRIVACY_PAGE_SETTINGS_KEY } from "@/types/legal-page-settings";
import { CACHE_TAGS } from "@/lib/cache-tags";

const sectionSchema = z.object({
  heading: z.string().min(1).max(300),
  body: z.string().min(1).max(10000),
});

const settingsSchema = z.object({
  seoTitle: z.string().min(1).max(300),
  seoDescription: z.string().min(1).max(1000),
  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),
  lastUpdated: z.string().min(1).max(100),
  sections: z.array(sectionSchema).min(1).max(30),
  ctaEyebrow: z.string().min(1).max(300),
  ctaTitle: z.string().min(1).max(300),
  ctaText: z.string().min(1).max(1500),
  ctaPrimaryLabel: z.string().min(1).max(200),
  ctaPrimaryHref: z.string().min(1).max(500),
  ctaSecondaryLabel: z.string().min(1).max(200),
  ctaSecondaryHref: z.string().min(1).max(500),
});

const CACHE_KEY_MAP: Record<string, string> = {
  [TERMS_PAGE_SETTINGS_KEY]: CACHE_TAGS.termsPageSettings,
  [PRIVACY_PAGE_SETTINGS_KEY]: CACHE_TAGS.privacyPageSettings,
};

const PATH_MAP: Record<string, string> = {
  [TERMS_PAGE_SETTINGS_KEY]: "/terms",
  [PRIVACY_PAGE_SETTINGS_KEY]: "/privacy",
};

function resolveKey(slug: string): string | null {
  if (slug === "terms") return TERMS_PAGE_SETTINGS_KEY;
  if (slug === "privacy") return PRIVACY_PAGE_SETTINGS_KEY;
  return null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const key = resolveKey(slug);
  if (!key) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }
  const settings = await (
    await import("@/repositories/legal-page-settings.repository")
  ).getLegalPageSettings(key);
  return NextResponse.json(settings);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const key = resolveKey(slug);
  if (!key) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }

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
    const updated = await updateLegalPageSettings(key, parsed.data);
    revalidateTag(CACHE_KEY_MAP[key], "max");
    revalidatePath(PATH_MAP[key]);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update page settings" },
      { status: 500 }
    );
  }
}
