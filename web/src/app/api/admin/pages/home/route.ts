import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  getHomepage,
  updateHomepage,
} from "@/repositories/homepage.repository";
import { HomepageUpdateInput } from "@/types/homepage";

export async function GET() {
  const guard = await requireApiSession();
  if (!guard.ok) return guard.response;

  try {
    const data = await getHomepage();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch homepage:", err);
    return NextResponse.json(
      { error: "Failed to fetch homepage data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  try {
    const body = await req.json();
    const patch: HomepageUpdateInput = {};

    if (body.heroSlides !== undefined) {
      patch.heroSlides = Array.isArray(body.heroSlides) ? body.heroSlides : [];
    }
    if (body.welcomeStats !== undefined) patch.welcomeStats = body.welcomeStats;
    if (body.whyChooseReasons !== undefined)
      patch.whyChooseReasons = body.whyChooseReasons;
    if (body.testimonials !== undefined)
      patch.testimonials = body.testimonials;
    if (body.admission !== undefined) patch.admission = body.admission;
    if (body.cta !== undefined) patch.cta = body.cta;

    const data = await updateHomepage(patch);
    revalidateTag(CACHE_TAGS.homepage, "max");
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to update homepage:", err);
    return NextResponse.json(
      { error: "Failed to update homepage data" },
      { status: 500 }
    );
  }
}
