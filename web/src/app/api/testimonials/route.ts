import { NextRequest, NextResponse } from "next/server";
import {
  createTestimonial,
  ensureTestimonialIndexes,
  listApprovedTestimonials,
} from "@/repositories/testimonial.repository";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

function text(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// GET /api/testimonials — public. Returns only approved, non-deleted
// testimonials, served fast by the status+createdAt index.
export async function GET() {
  try {
    const items = await listApprovedTestimonials();
    return NextResponse.json({ success: true, items });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load testimonials." },
      { status: 500 }
    );
  }
}

// POST /api/testimonials — public. Accepts a new testimonial and stores it as
// "pending" so an admin can review/approve it before it shows on the site.
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const name = text(body.name);
  const content = text(body.content);

  if (!name) {
    return NextResponse.json(
      { success: false, error: "Your name is required." },
      { status: 400 }
    );
  }
  if (!content) {
    return NextResponse.json(
      { success: false, error: "Your testimonial is required." },
      { status: 400 }
    );
  }

  try {
    await ensureTestimonialIndexes();
    await createTestimonial({
      name,
      content,
      batch: text(body.batch) || undefined,
      position: text(body.position) || undefined,
      program: text(body.program) || undefined,
      photo: text(body.photo) || undefined,
      status: "pending",
    });
    revalidateTag(CACHE_TAGS.testimonialsList, "max");
    return NextResponse.json({
      success: true,
      message:
        "Thank you! Your testimonial has been submitted and is now pending review by our team.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
