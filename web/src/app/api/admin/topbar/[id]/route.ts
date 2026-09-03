import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { updateTopBarLink, deleteTopBarLink } from "@/repositories/topbar.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { TopBarLinkUpdateInput } from "@/types/topbar";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body: TopBarLinkUpdateInput = await request.json();
    const link = await updateTopBarLink(id, body);
    
    if (!link) {
      return NextResponse.json({ error: "TopBar link not found" }, { status: 404 });
    }
    
    // Invalidate cache immediately for admin operations
    revalidateTag(CACHE_TAGS.topBarLinks, { expire: 0 });
    // Also revalidate all pages that might display the topbar
    revalidatePath('/', 'layout');
    
    return NextResponse.json(link);
  } catch (error) {
    console.error("Failed to update topbar link:", error);
    return NextResponse.json({ error: "Failed to update topbar link" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const success = await deleteTopBarLink(id);
    
    if (!success) {
      return NextResponse.json({ error: "TopBar link not found" }, { status: 404 });
    }
    
    // Invalidate cache immediately for admin operations
    revalidateTag(CACHE_TAGS.topBarLinks, { expire: 0 });
    // Also revalidate all pages that might display the topbar
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete topbar link:", error);
    return NextResponse.json({ error: "Failed to delete topbar link" }, { status: 500 });
  }
}
