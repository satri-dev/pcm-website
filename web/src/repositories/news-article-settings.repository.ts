// src/repositories/news-article-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  NEWS_ARTICLE_SETTINGS_DEFAULTS,
  NEWS_ARTICLE_SETTINGS_KEY,
  NewsArticleSettings,
} from "@/types/news-article-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): NewsArticleSettings {
  const merged: Record<string, unknown> = {
    ...NEWS_ARTICLE_SETTINGS_DEFAULTS,
    ...(value ?? {}),
  };
  return merged as unknown as NewsArticleSettings;
}

export async function getNewsArticleSettings(): Promise<NewsArticleSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: NEWS_ARTICLE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateNewsArticleSettings(
  input: Partial<NewsArticleSettings>
): Promise<NewsArticleSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(NEWS_ARTICLE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof NewsArticleSettings] !== undefined) {
      cleaned[key] = input[key as keyof NewsArticleSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: NEWS_ARTICLE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: NEWS_ARTICLE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (await col.findOne({ key: NEWS_ARTICLE_SETTINGS_KEY }))
    ?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
