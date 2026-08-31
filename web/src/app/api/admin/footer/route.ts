import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getFooterSettings, updateFooterSettings } from "@/repositories/footer.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { FooterSettingsUpdateInput } from "@/types/footer";

export async function GET() {
  try {
    const settings = await getFooterSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch footer settings:", error);
    return NextResponse.json({ error: "Failed to fetch footer settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body: FooterSettingsUpdateInput = await request.json();
    const settings = await updateFooterSettings(body);
    
    if (!settings) {
      return NextResponse.json({ error: "Footer settings not found" }, { status: 404 });
    }
    
    // Invalidate footer settings cache
    revalidateTag(CACHE_TAGS.footerSettings, 'max');
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update footer settings:", error);
    return NextResponse.json({ error: "Failed to update footer settings" }, { status: 500 });
  }
}
