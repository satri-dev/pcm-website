// src/repositories/news-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  NEWS_PAGE_SETTINGS_DEFAULTS,
  NEWS_PAGE_SETTINGS_KEY,
  NewsPageSettings,
} from "@/types/news-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): NewsPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...NEWS_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as NewsPageSettings;
}

export async function getNewsPageSettings(): Promise<NewsPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: NEWS_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateNewsPageSettings(
  input: Partial<NewsPageSettings>
): Promise<NewsPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(NEWS_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof NewsPageSettings] !== undefined) {
      cleaned[key] = input[key as keyof NewsPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: NEWS_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: NEWS_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (await col.findOne({ key: NEWS_PAGE_SETTINGS_KEY }))
    ?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
