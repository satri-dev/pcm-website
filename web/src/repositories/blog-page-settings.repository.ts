// src/repositories/blog-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  BLOG_PAGE_SETTINGS_DEFAULTS,
  BLOG_PAGE_SETTINGS_KEY,
  BlogPageSettings,
} from "@/types/blog-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): BlogPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...BLOG_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as BlogPageSettings;
}

export async function getBlogPageSettings(): Promise<BlogPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: BLOG_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateBlogPageSettings(
  input: Partial<BlogPageSettings>
): Promise<BlogPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(BLOG_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof BlogPageSettings] !== undefined) {
      cleaned[key] = input[key as keyof BlogPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: BLOG_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: BLOG_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (await col.findOne({ key: BLOG_PAGE_SETTINGS_KEY }))
    ?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
