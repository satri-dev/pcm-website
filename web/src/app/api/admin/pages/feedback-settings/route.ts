import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  getFeedbackPageSettings,
  updateFeedbackPageSettings,
} from "@/repositories/feedback-page-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { FEEDBACK_FIELD_TYPES, type FeedbackFieldType } from "@/types/feedback-page-settings";

const fieldSchema = z.object({
  id: z.string().min(1).max(100),
  label: z.string().min(1).max(300),
  type: z.enum(FEEDBACK_FIELD_TYPES as [FeedbackFieldType, ...FeedbackFieldType[]]),
  required: z.boolean(),
  placeholder: z.string().max(300).optional(),
  hint: z.string().max(500).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  options: z.array(z.string().max(200)).max(50).optional(),
});

const settingsSchema = z.object({
  seoTitle: z.string().min(1).max(300),
  seoDescription: z.string().min(1).max(1000),
  seoKeywords: z.array(z.string().max(100)).max(20),
  ogImage: z.string().max(1000),

  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1500),
  breadcrumbLabel: z.string().min(1).max(200),

  formEyebrow: z.string().min(1).max(200),
  formTitle: z.string().min(1).max(300),
  formSubtitle: z.string().min(1).max(1500),

  submitLabel: z.string().min(1).max(200),
  successTitle: z.string().min(1).max(300),
  successMessage: z.string().min(1).max(1500),

  allowAnonymous: z.boolean(),
  anonymousLabel: z.string().min(1).max(300),
  anonymousHint: z.string().min(1).max(500),
  ratingEnabled: z.boolean(),
  ratingLabel: z.string().min(1).max(300),

  heroImage: z.string().max(1000),

  fields: z.array(fieldSchema).max(50),
});

export async function GET() {
  const settings = await getFeedbackPageSettings();
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

  const seenIds = new Set<string>();
  for (const f of parsed.data.fields) {
    if (seenIds.has(f.id)) {
      return NextResponse.json(
        { error: `Duplicate field id "${f.id}". Field ids must be unique.` },
        { status: 422 }
      );
    }
    seenIds.add(f.id);
  }

  try {
    const updated = await updateFeedbackPageSettings(parsed.data);
    revalidateTag(CACHE_TAGS.feedbackSettings, "max");
    revalidatePath("/feedback");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update feedback page settings" },
      { status: 500 }
    );
  }
}
