import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import { getDb } from "@/core/lib/db";
import { PAGE_CONTENT_COLLECTION } from "@/types/page-content";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function PUT(request: NextRequest) {
  const guard = await requireApiSession(["admin", "editor"]);
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection(PAGE_CONTENT_COLLECTION);

    // Upsert the contact page content
    await collection.updateOne(
      { slug: "contact" },
      {
        $set: {
          slug: "contact",
          content,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Invalidate contact page cache
    revalidateTag(CACHE_TAGS.pageContent("contact"), "max");

    return NextResponse.json({
      success: true,
      message: "Contact page updated successfully",
    });
  } catch (error) {
    console.error("Error updating contact page:", error);
    return NextResponse.json(
      {
        error: "Failed to update contact page",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const guard = await requireApiSession();
  if (!guard.ok) return guard.response;

  try {
    const db = await getDb();
    const collection = db.collection(PAGE_CONTENT_COLLECTION);

    const contactPage = await collection.findOne({ slug: "contact" });

    if (!contactPage) {
      return NextResponse.json(
        { error: "Contact page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contactPage,
    });
  } catch (error) {
    console.error("Error fetching contact page:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch contact page",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
