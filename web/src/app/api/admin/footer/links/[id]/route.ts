import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  getFooterLinkById,
  updateFooterLink,
  deleteFooterLink,
} from "@/repositories/footer.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { FooterLinkUpdateInput } from "@/types/footer";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const link = await getFooterLinkById(id);
    
    if (!link) {
      return NextResponse.json(
        { error: "Footer link not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(link);
  } catch (error) {
    console.error("Error fetching footer link:", error);
    return NextResponse.json(
      { error: "Failed to fetch footer link" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const input: FooterLinkUpdateInput = {
      title: body.title,
      links: body.links,
      order: body.order,
      status: body.status,
    };

    const updated = await updateFooterLink(id, input);
    
    if (!updated) {
      return NextResponse.json(
        { error: "Footer link not found" },
        { status: 404 }
      );
    }
    
    // Invalidate footer links cache
    revalidateTag(CACHE_TAGS.footerLinks, "max");
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating footer link:", error);
    return NextResponse.json(
      { error: "Failed to update footer link" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const success = await deleteFooterLink(id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Footer link not found" },
        { status: 404 }
      );
    }
    
    // Invalidate footer links cache
    revalidateTag(CACHE_TAGS.footerLinks, "max");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting footer link:", error);
    return NextResponse.json(
      { error: "Failed to delete footer link" },
      { status: 500 }
    );
  }
}
