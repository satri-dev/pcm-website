import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createEvent,
  ensureEventIndexes,
  listEvents,
} from "@/repositories/events.repository";
import { EVENT_TYPES, EVENT_STATUSES } from "@/types/events";
import { requireApiSession } from "@/core/lib/api-guard";

const createSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  type: z.enum(["Workshop", "Seminar", "Festival", "Tour", "Sports"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  location: z.string().min(1).max(200),
  seats: z.number().int().min(0),
  description: z.string().min(1).max(2000),
  image: z.string().optional(),
  status: z.enum(["published", "draft"]),
  views: z.number().int().min(0).optional(),
});

export async function GET(request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  await ensureEventIndexes();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "8") || 8)
  );
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const search = searchParams.get("search");

  const result = await listEvents({
    page,
    pageSize,
    search: search || undefined,
    status: EVENT_STATUSES.find((s) => s === status) || undefined,
    type: EVENT_TYPES.find((t) => t === type) || undefined,
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor"]);
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
    const created = await createEvent(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
