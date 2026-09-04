import { NextRequest, NextResponse } from "next/server";
import {
  createSurveyResponse,
  ensureSurveyResponseIndexes,
} from "@/repositories/survey-responses.repository";

// Public endpoint — intentionally unauthenticated so any visitor can submit.
// The POST is intentionally fast: indexes are ensured once, then we do a single
// indexed survey lookup + a single insert (no auth round-trips, no heavy work).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // The responder posts `surveySlug` (falls back to the legacy `surveyId`
    // field which historically carried the slug).
    const surveySlug = (body.surveySlug ?? body.surveyId ?? "").trim();
    const answers = body.answers;

    if (!surveySlug)
      return NextResponse.json({ success: false, error: "Survey is required." }, { status: 400 });
    if (!answers || typeof answers !== "object")
      return NextResponse.json({ success: false, error: "Answers are required." }, { status: 400 });

    await ensureSurveyResponseIndexes();

    const created = await createSurveyResponse({
      surveySlug,
      respondent: typeof body.respondent === "string" ? body.respondent : undefined,
      answers,
    });

    if (!created) {
      return NextResponse.json(
        { success: false, error: "This survey is not currently accepting responses." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Response recorded. Thank you!" });
  } catch (err) {
    console.error("[survey] POST failed:", err);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
