import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import { CACHE_TAGS } from "@/lib/cache-tags";
import {
  getNavbarSettings,
  updateNavbarSettings,
} from "@/repositories/navbar-settings.repository";
import type { NavbarSettings } from "@/types/nav-menu";

export async function GET() {
  const guard = await requireApiSession();
  if (!guard.ok) return guard.response;

  try {
    const data = await getNavbarSettings();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch navbar settings:", err);
    return NextResponse.json(
      { error: "Failed to fetch navbar settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  try {
    const body = await req.json();
    const settings: Partial<NavbarSettings> = {};

    if (body.logoUrl !== undefined) settings.logoUrl = body.logoUrl;
    if (body.ctaLabel !== undefined) settings.ctaLabel = body.ctaLabel;
    if (body.ctaHref !== undefined) settings.ctaHref = body.ctaHref;
    if (body.ctaEnabled !== undefined) settings.ctaEnabled = body.ctaEnabled;

    const data = await updateNavbarSettings(settings);
    
    // Invalidate cache immediately for admin operations
    revalidateTag(CACHE_TAGS.navbar, { expire: 0 });
    // Also revalidate all pages that might display the navbar
    revalidatePath('/', 'layout');
    
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to update navbar settings:", err);
    return NextResponse.json(
      { error: "Failed to update navbar settings" },
      { status: 500 }
    );
  }
}
