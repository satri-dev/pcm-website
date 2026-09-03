import { NextRequest, NextResponse } from "next/server";
import {
  ensureApplicationIndexes,
  listApplications,
} from "@/repositories/application.repository";
import { requireApiSession } from "@/core/lib/api-guard";
import { APPLICATION_STATUSES } from "@/types/application";

export async function GET(request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  await ensureApplicationIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "10") || 10)
  );
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const result = await listApplications({
    page,
    pageSize,
    search: search || undefined,
    status:
      APPLICATION_STATUSES.find((s) => s === status) || undefined,
  });

  return NextResponse.json(result);
}
