import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getFacultyPageSettings,
  updateFacultyPageSettings,
} from "@/repositories/faculty-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const statSchema = z.object({
  id: z.string().min(1).max(100),
  count: z.number().int().min(0).max(1000000),
  suffix: z.string().max(10),
  label: z.string().min(1).max(200),
});

const settingsSchema = z.object({
  seoTitle: z.string().min(1).max(300),
  seoDescription: z.string().min(1).max(1000),
  seoKeywords: z.array(z.string().max(100)).max(20),
  ogImage: z.string().max(1000),

  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),

  leadershipEyebrow: z.string().min(1).max(200),
  leadershipTitle: z.string().min(1).max(300),

  teamEyebrow: z.string().min(1).max(200),
  teamTitle: z.string().min(1).max(300),

  statsEyebrow: z.string().min(1).max(200),
  statsTitle: z.string().min(1).max(300),
  stats: z.array(statSchema).max(12),

  ctaTitle: z.string().min(1).max(300),
  ctaText: z.string().min(1).max(1500),
  ctaPrimaryLabel: z.string().min(1).max(200),
  ctaPrimaryHref: z.string().min(1).max(500),
  ctaSecondaryLabel: z.string().min(1).max(200),
  ctaSecondaryHref: z.string().min(1).max(500),
});

export async function GET() {
  const settings = await getFacultyPageSettings();
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
    const updated = await updateFacultyPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.facultySettings, "max");
    revalidatePath("/about/faculty");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update faculty page settings" },
      { status: 500 }
    );
  }
}
