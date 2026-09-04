import { NextRequest, NextResponse } from "next/server";
import {
  deleteTestimonial,
  getTestimonialById,
  updateTestimonial,
  restoreTestimonial,
  hardDeleteTestimonial,
} from "@/repositories/testimonial.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { TESTIMONIAL_STATUSES } from "@/types/testimonial";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const testimonial = await getTestimonialById(id);
    if (!testimonial) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "restore" || action === "permanent-delete") {
    const guard = await requireApiSession(["admin"]);
    if (!guard.ok) return guard.response;

    if (action === "restore") {
      try {
        const restored = await restoreTestimonial(id);
        if (!restored) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateTag(CACHE_TAGS.testimonialsList, "max");
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to restore testimonial" },
          { status: 500 }
        );
      }
    }

    if (action === "permanent-delete") {
      try {
        const deleted = await hardDeleteTestimonial(id);
        if (!deleted) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        revalidateTag(CACHE_TAGS.testimonialsList, "max");
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to permanently delete testimonial" },
          { status: 500 }
        );
      }
    }
  }

  // Status changes (approve / reject / set pending) — admin only.
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const requestedStatus = body?.status;
  if (
    typeof requestedStatus !== "string" ||
    !TESTIMONIAL_STATUSES.includes(
      requestedStatus as (typeof TESTIMONIAL_STATUSES)[number]
    )
  ) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  }

  try {
    const updated = await updateTestimonial(id, {
      status: requestedStatus as (typeof TESTIMONIAL_STATUSES)[number],
    });
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.testimonialsList, "max");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const deleted = await deleteTestimonial(id, guard.session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.testimonialsList, "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
