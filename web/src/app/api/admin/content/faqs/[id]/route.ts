import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteFaq,
  getFaqById,
  updateFaq,
  restoreFaq,
  hardDeleteFaq,
} from "@/repositories/faqs.repository";
import { requireApiSession } from "@/core/lib/api-guard";

const updateSchema = z
  .object({
    question: z.string().min(3).max(200),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
    category: z.enum(["Admission", "Scholarship", "Programs", "Campus", "General"]),
    answer: z.string().min(1).max(5000),
  })
  .partial();

function isMongoError(err: unknown): err is { code?: number } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code?: unknown }).code === "number"
  );
}

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin", "editor", "viewer"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const faq = await getFaqById(id);
    if (!faq) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(faq);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch FAQ" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "restore" || action === "permanent-delete") {
    const guard = await requireApiSession(["admin"]);
    if (!guard.ok) return guard.response;

    if (action === "restore") {
      try {
        const restored = await restoreFaq(id);
        if (!restored) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to restore FAQ" },
          { status: 500 }
        );
      }
    }

    if (action === "permanent-delete") {
      try {
        const deleted = await hardDeleteFaq(id);
        if (!deleted) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json(
          { error: "Failed to permanently delete FAQ" },
          { status: 500 }
        );
      }
    }
  }

  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const updated = await updateFaq(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;

  const { id } = await ctx.params;
  try {
    const deleted = await deleteFaq(id, guard.session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}


