import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getAbout, updateAbout } from "@/repositories/about.repository";
import { AboutUpdateInput } from "@/types/about";

export async function GET() {
  const guard = await requireApiSession();
  if (!guard.ok) return guard.response;

  try {
    const data = await getAbout();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch about page:", err);
    return NextResponse.json(
      { error: "Failed to fetch about page data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  try {
    const body = await req.json();
    const patch: AboutUpdateInput = {};

    const allowed: (keyof AboutUpdateInput)[] = [
      "hero",
      "whoWeAre",
      "whyStudy",
      "vision",
      "difference",
      "stats",
      "achievers",
      "cta",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) (patch as Record<string, unknown>)[key] = body[key];
    }

    const data = await updateAbout(patch);
    revalidateTag(CACHE_TAGS.about, "max");
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to update about page:", err);
    return NextResponse.json(
      { error: "Failed to update about page data" },
      { status: 500 }
    );
  }
}
