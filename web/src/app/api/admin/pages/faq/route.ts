import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getFaqPageSettings,
  updateFaqPageSettings,
} from "@/repositories/faq-content.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const settingsSchema = z.object({
  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1000),
  eyebrow: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  subtitle: z.string().min(1).max(1000),
  searchPlaceholder: z.string().min(1).max(200),
  ctaEyebrow: z.string().min(1).max(200),
  ctaTitle: z.string().min(1).max(200),
  ctaText: z.string().min(1).max(1000),
  ctaPrimaryLabel: z.string().min(1).max(200),
  ctaPrimaryHref: z.string().min(1).max(500),
  ctaSecondaryLabel: z.string().min(1).max(200),
  ctaSecondaryHref: z.string().min(1).max(500),
});

export async function GET() {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const settings = await getFaqPageSettings();
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
    const updated = await updateFaqPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.faqPage, "max");
    revalidatePath("/faq");
    revalidatePath("/");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update FAQ page settings" },
      { status: 500 }
    );
  }
}
