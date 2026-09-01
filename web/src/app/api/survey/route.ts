import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { surveyId, answers } = body;

    if (!surveyId?.trim())
      return NextResponse.json({ success: false, error: "Survey ID is required." }, { status: 400 });
    if (!answers || typeof answers !== "object")
      return NextResponse.json({ success: false, error: "Answers are required." }, { status: 400 });

    // TODO: persist to DB (survey_responses collection)
    console.log("[survey] response for", surveyId, "by", body.respondent || "anonymous", "—", Object.keys(answers).length, "answers");

    return NextResponse.json({ success: true, message: "Response recorded. Thank you!" });
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
