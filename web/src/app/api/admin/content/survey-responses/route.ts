import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/core/lib/api-guard";
import { getSurveyBySlug } from "@/repositories/surveys.repository";
import {
  ensureSurveyResponseIndexes,
  listSurveyResponseGroups,
  listSurveyResponses,
} from "@/repositories/survey-responses.repository";

// Admin-only. Reading responses is authorisation-protected (public users can
// only POST to /api/survey; they can never reach this route).
const ALLOWED = ["admin", "editor", "viewer"] as const;

export async function GET(request: NextRequest) {
  const guard = await requireApiSession(ALLOWED);
  if (!guard.ok) return guard.response;

  await ensureSurveyResponseIndexes();

  const { searchParams } = new URL(request.url);
  const surveySlug = searchParams.get("survey")?.trim() || undefined;
  const page = Number(searchParams.get("page") ?? 1) || 1;
  const pageSize = Math.min(Number(searchParams.get("pageSize") ?? 100) || 100, 200);

  try {
    // If a specific survey is requested, return that survey's responses plus
    // its question schema so the UI can render answers Google-Forms style.
    if (surveySlug) {
      const survey = await getSurveyBySlug(surveySlug);
      if (!survey) {
        return NextResponse.json({ error: "Survey not found" }, { status: 404 });
      }
      const result = await listSurveyResponses({ surveySlug, page, pageSize });
      return NextResponse.json({ survey, ...result });
    }

    const groups = await listSurveyResponseGroups({ page, pageSize });
    return NextResponse.json(groups);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch survey responses" },
      { status: 500 }
    );
  }
}
