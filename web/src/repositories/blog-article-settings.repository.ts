// src/repositories/blog-article-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  BLOG_ARTICLE_SETTINGS_DEFAULTS,
  BLOG_ARTICLE_SETTINGS_KEY,
  BlogArticleSettings,
  UsefulLink,
} from "@/types/blog-article-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function normalizeUsefulLinks(value: unknown): UsefulLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (l): l is { label?: unknown; href?: unknown } =>
        typeof l === "object" && l !== null
    )
    .map((l) => ({
      label: typeof l.label === "string" ? l.label : "",
      href: typeof l.href === "string" ? l.href : "",
    }))
    .filter((l) => l.label.trim() !== "" && l.href.trim() !== "");
}

function fromDoc(value: Record<string, unknown> | undefined): BlogArticleSettings {
  const merged: Record<string, unknown> = {
    ...BLOG_ARTICLE_SETTINGS_DEFAULTS,
    ...(value ?? {}),
  };
  const result: BlogArticleSettings = {
    ...(merged as unknown as BlogArticleSettings),
    usefulLinks: normalizeUsefulLinks(merged.usefulLinks),
  };
  return result;
}

export async function getBlogArticleSettings(): Promise<BlogArticleSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: BLOG_ARTICLE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateBlogArticleSettings(
  input: Partial<BlogArticleSettings>
): Promise<BlogArticleSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(BLOG_ARTICLE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof BlogArticleSettings] !== undefined) {
      cleaned[key] = input[key as keyof BlogArticleSettings];
    }
  }
  if ("usefulLinks" in cleaned) {
    cleaned.usefulLinks = normalizeUsefulLinks(cleaned.usefulLinks);
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: BLOG_ARTICLE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: BLOG_ARTICLE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (await col.findOne({ key: BLOG_ARTICLE_SETTINGS_KEY }))
    ?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
