import { NextRequest, NextResponse } from "next/server";
import { createSurveyResponse } from "@/repositories/survey-responses.repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { surveyId, answers, respondent } = body;

    if (!surveyId?.trim())
      return NextResponse.json({ success: false, error: "Survey is required." }, { status: 400 });
    if (!answers || typeof answers !== "object")
      return NextResponse.json({ success: false, error: "Answers are required." }, { status: 400 });

    const created = await createSurveyResponse({
      surveyId: String(surveyId),
      respondent: typeof respondent === "string" ? respondent : undefined,
      answers: answers as Record<string, string | string[] | number | number[]>,
    });

    if (!created) {
      return NextResponse.json(
        { success: false, error: "This survey is not currently accepting responses." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Response recorded. Thank you!" });
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
