import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createTopBarLink, listAllTopBarLinks } from "@/repositories/topbar.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { TopBarLinkCreateInput } from "@/types/topbar";

export async function GET() {
  try {
    const links = await listAllTopBarLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error("Failed to fetch topbar links:", error);
    return NextResponse.json({ error: "Failed to fetch topbar links" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: TopBarLinkCreateInput = await request.json();
    const link = await createTopBarLink(body);
    
    // Invalidate cache immediately for admin operations
    revalidateTag(CACHE_TAGS.topBarLinks, { expire: 0 });
    // Also revalidate all pages that might display the topbar
    revalidatePath('/', 'layout');
    
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Failed to create topbar link:", error);
    return NextResponse.json({ error: "Failed to create topbar link" }, { status: 500 });
  }
}
