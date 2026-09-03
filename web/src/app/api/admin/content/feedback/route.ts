import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/core/lib/api-guard";
import {
  ensureFeedbackIndexes,
  listFeedback,
} from "@/repositories/feedback.repository";

export async function GET(request: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  await ensureFeedbackIndexes();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1) || 1;
  const pageSize = Number(searchParams.get("pageSize") ?? 50) || 50;

  try {
    const result = await listFeedback({ search, page, pageSize });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
