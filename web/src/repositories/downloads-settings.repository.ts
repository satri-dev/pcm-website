// src/repositories/downloads-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  DOWNLOADS_PAGE_SETTINGS_DEFAULTS,
  DOWNLOADS_PAGE_SETTINGS_KEY,
  DownloadsPageSettings,
} from "@/types/downloads-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(
  value: Record<string, unknown> | undefined
): DownloadsPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...DOWNLOADS_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as DownloadsPageSettings;
}

export async function getDownloadsPageSettings(): Promise<DownloadsPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: DOWNLOADS_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateDownloadsPageSettings(
  input: Partial<DownloadsPageSettings>
): Promise<DownloadsPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(DOWNLOADS_PAGE_SETTINGS_DEFAULTS)) {
    if (
      key in input &&
      input[key as keyof DownloadsPageSettings] !== undefined
    ) {
      cleaned[key] = input[key as keyof DownloadsPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: DOWNLOADS_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: DOWNLOADS_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: DOWNLOADS_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
