import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiSession } from "@/core/lib/api-guard";
import { getBlogArticleSettings, updateBlogArticleSettings } from "@/repositories/blog-article-settings.repository";
import { CACHE_TAGS } from "@/lib/cache-tags";

const linkSchema = z.object({
  label: z.string().min(1).max(200),
  href: z.string().min(1).max(500),
});

const settingsSchema = z.object({
  breadcrumbLabel: z.string().min(1).max(100),
  publishedLabel: z.string().min(1).max(100),
  publishedLabelPrefix: z.string().min(1).max(100),
  bylinePrefix: z.string().min(1).max(100),
  backToAllLabel: z.string().min(1).max(200),
  backToAllHref: z.string().min(1).max(500),
  usefulLinksTitle: z.string().min(1).max(200),
  usefulLinksEyebrow: z.string().min(1).max(200),
  usefulLinks: z.array(linkSchema).max(20),
  showUsefulLinks: z.boolean(),
  relatedTitle: z.string().min(1).max(200),
  showRelated: z.boolean(),
  seoTitleSuffix: z.string().min(0).max(200),
});

export async function GET() {
  const settings = await getBlogArticleSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const guard = await requireApiSession(["admin"]);
  if (!guard.ok) return guard.response;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 422 });
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 422 });
  try {
    const updated = await updateBlogArticleSettings(parsed.data);
    revalidateTag(CACHE_TAGS.blogArticleSettings, "max");
    revalidatePath("/blogs");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
