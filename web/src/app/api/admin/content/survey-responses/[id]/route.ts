import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  getSurveyResponseById,
  deleteSurveyResponse,
  restoreSurveyResponse,
  hardDeleteSurveyResponse,
} from "@/repositories/survey-responses.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const response = await getSurveyResponseById(id);
    if (!response) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch survey response" },
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

  try {
    if (action === "restore") {
      const restored = await restoreSurveyResponse(id);
      if (!restored) return NextResponse.json({ error: "Not found" }, { status: 404 });
      revalidateTag(CACHE_TAGS.surveyResponses, "max");
      return NextResponse.json({ ok: true });
    }
    if (action === "permanent-delete") {
      const deleted = await hardDeleteSurveyResponse(id);
      if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
      revalidateTag(CACHE_TAGS.surveyResponses, "max");
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Failed to update survey response" },
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
    const deleted = await deleteSurveyResponse(id, guard.session.user.id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateTag(CACHE_TAGS.surveyResponses, "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete survey response" },
      { status: 500 }
    );
  }
}
