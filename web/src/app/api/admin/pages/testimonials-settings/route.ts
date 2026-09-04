import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getTestimonialPageSettings,
  updateTestimonialPageSettings,
} from "@/repositories/testimonial-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const formSchema = z.object({
  modalTitle: z.string().min(1).max(300),
  modalDescription: z.string().min(1).max(1000),
  successTitle: z.string().min(1).max(300),
  successText: z.string().min(1).max(1000),
  successDone: z.string().min(1).max(100),
  requiredName: z.string().min(1).max(300),
  requiredContent: z.string().min(1).max(300),
  submitError: z.string().min(1).max(300),
  nameLabel: z.string().min(1).max(100),
  programLabel: z.string().min(1).max(100),
  batchLabel: z.string().min(1).max(100),
  positionLabel: z.string().min(1).max(200),
  photoLabel: z.string().min(1).max(100),
  contentLabel: z.string().min(1).max(100),
  submitLabel: z.string().min(1).max(100),
  submittingLabel: z.string().min(1).max(100),
  cancelLabel: z.string().min(1).max(100),
  uploadLabel: z.string().min(1).max(100),
  removePhotoLabel: z.string().min(1).max(100),
  noPhotoText: z.string().min(1).max(200),
});

const settingsSchema = z.object({
  addEnabled: z.boolean(),

  heroEyebrow: z.string().min(1).max(200),
  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),

  headEyebrow: z.string().min(1).max(200),
  headTitle: z.string().min(1).max(300),
  headSubtitle: z.string().min(1).max(1000),

  addButtonLabel: z.string().min(1).max(200),
  emptyText: z.string().min(1).max(600),

  form: formSchema,

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
  canonical: z.string().min(1).max(500),
  robotsIndex: z.boolean(),
  robotsFollow: z.boolean(),
});

export async function GET() {
  const settings = await getTestimonialPageSettings();
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
    const updated = await updateTestimonialPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.testimonialsSettings, { expire: 0 });
    revalidateTag(CACHE_TAGS.testimonialsList, { expire: 0 });
    revalidatePath("/testimonials");
    revalidatePath("/");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update testimonials page settings" },
      { status: 500 }
    );
  }
}
