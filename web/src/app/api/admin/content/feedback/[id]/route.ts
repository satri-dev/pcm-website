import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  getFeedbackById,
  deleteFeedback,
  restoreFeedback,
  hardDeleteFeedback,
} from "@/repositories/feedback.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const feedback = await getFeedbackById(id);
    if (!feedback) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(feedback);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
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

  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  if (action === "restore") {
    try {
      const restored = await restoreFeedback(id);
      if (!restored) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      revalidateTag(CACHE_TAGS.feedbackList, "max");
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json(
        { error: "Failed to restore feedback" },
        { status: 500 }
      );
    }
  }

  if (action === "permanent-delete") {
    try {
      const deleted = await hardDeleteFeedback(id);
      if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      revalidateTag(CACHE_TAGS.feedbackList, "max");
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json(
        { error: "Failed to permanently delete feedback" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const deleted = await deleteFeedback(id, guard.session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateTag(CACHE_TAGS.feedbackList, "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete feedback" },
      { status: 500 }
    );
  }
}
