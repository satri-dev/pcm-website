import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rating, message } = body;

    if (!rating || rating < 1 || rating > 5)
      return NextResponse.json({ success: false, error: "A rating between 1 and 5 is required." }, { status: 400 });
    if (!message?.trim())
      return NextResponse.json({ success: false, error: "Feedback message is required." }, { status: 400 });

    // TODO: persist to DB (feedback collection)
    console.log("[feedback]", { category: body.category, rating, anonymous: body.anonymous, messageLen: message.length });

    return NextResponse.json({ success: true, message: "Thank you for your feedback!" });
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
