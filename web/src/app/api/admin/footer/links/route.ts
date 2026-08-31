import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  listAllFooterLinks,
  createFooterLink,
} from "@/repositories/footer.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { FooterLinkCreateInput } from "@/types/footer";

export async function GET() {
  try {
    const links = await listAllFooterLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching footer links:", error);
    return NextResponse.json(
      { error: "Failed to fetch footer links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: FooterLinkCreateInput = {
      title: body.title,
      links: body.links || [],
      order: body.order || 0,
      status: body.status || "active",
    };

    const newLink = await createFooterLink(input);
    
    // Invalidate footer links cache
    revalidateTag(CACHE_TAGS.footerLinks, "max");
    
    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    console.error("Error creating footer link:", error);
    return NextResponse.json(
      { error: "Failed to create footer link" },
      { status: 500 }
    );
  }
}
