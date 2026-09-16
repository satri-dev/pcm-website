import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
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
    if (body.welcomeText !== undefined) patch.welcomeText = body.welcomeText;
    if (body.welcomeStats !== undefined) patch.welcomeStats = body.welcomeStats;
    if (body.whyChooseText !== undefined) patch.whyChooseText = body.whyChooseText;
    if (body.whyChooseReasons !== undefined)
      patch.whyChooseReasons = body.whyChooseReasons;
    if (body.programsText !== undefined) patch.programsText = body.programsText;
    if (body.facilitiesText !== undefined) patch.facilitiesText = body.facilitiesText;
    if (body.eventsText !== undefined) patch.eventsText = body.eventsText;
    if (body.galleryText !== undefined) patch.galleryText = body.galleryText;
    if (body.blogsText !== undefined) patch.blogsText = body.blogsText;
    if (body.newsText !== undefined) patch.newsText = body.newsText;
    if (body.testimonialsText !== undefined) patch.testimonialsText = body.testimonialsText;
    if (body.testimonials !== undefined)
      patch.testimonials = body.testimonials;
    if (body.admission !== undefined) patch.admission = body.admission;
    if (body.cta !== undefined) patch.cta = body.cta;

    const data = await updateHomepage(patch);
    revalidateTag(CACHE_TAGS.homepage, "max");
    revalidatePath("/about");
    revalidatePath("/");
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to update homepage:", err);
    return NextResponse.json(
      { error: "Failed to update homepage data" },
      { status: 500 }
    );
  }
}
