import { NextRequest, NextResponse } from "next/server";
import {
  createSurveyResponse,
  ensureSurveyResponseIndexes,
} from "@/repositories/survey-responses.repository";
import type { SurveyAnswerValue } from "@/types/survey-response";
import { guardPublicWrite } from "@/core/lib/rate-limit";
import { capString, sanitizeUntrustedObject } from "@/lib/sanitize";

// Public endpoint — intentionally unauthenticated so any visitor can submit.
export async function POST(req: NextRequest) {
  const limited = guardPublicWrite(req, { limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const body = await req.json();
    // The responder posts `surveySlug` (falls back to the legacy `surveyId`
    // field which historically carried the slug).
    if (typeof body.surveySlug !== "string" && typeof body.surveyId !== "string") {
      return NextResponse.json({ success: false, error: "Survey is required." }, { status: 400 });
    }
    const surveySlug = String(body.surveySlug ?? body.surveyId).trim();

    const rawAnswers = body.answers;
    if (!rawAnswers || typeof rawAnswers !== "object" || Array.isArray(rawAnswers)) {
      return NextResponse.json({ success: false, error: "Answers are required." }, { status: 400 });
    }

    await ensureSurveyResponseIndexes();

    // Bound the answer payload and strip Mongo-DSL keys before persisting.
    const answers = sanitizeUntrustedObject(rawAnswers as Record<string, unknown>, {
      maxDepth: 3,
      maxEntries: 200,
    });

    const created = await createSurveyResponse({
      surveySlug,
      respondent:
        typeof body.respondent === "string" ? capString(body.respondent.trim(), 200) : undefined,
      answers: (answers ?? {}) as Record<string, SurveyAnswerValue>,
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
