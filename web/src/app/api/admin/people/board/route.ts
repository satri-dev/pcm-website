import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createBoard,
  ensureBoardIndexes,
  listBoard,
} from "@/repositories/board.repository";
import { requireApiSession } from "@/core/lib/api-guard";

const createSchema = z.object({
  name: z.string().min(2).max(200),
  role: z.string().min(2).max(200),
  order: z.number().int().min(0).optional(),
  photo: z.string().optional(),
});

export async function GET(request: NextRequest) {
  await ensureBoardIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "50") || 50)
  );
  const search = searchParams.get("search");

  const result = await listBoard({
    page,
    pageSize,
    search: search || undefined,
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const created = await createBoard(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create board member" },
      { status: 500 }
    );
  }
}
