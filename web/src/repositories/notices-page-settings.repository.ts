// src/repositories/notices-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  NOTICES_PAGE_SETTINGS_DEFAULTS,
  NOTICES_PAGE_SETTINGS_KEY,
  NoticesPageSettings,
} from "@/types/notices-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): NoticesPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...NOTICES_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as NoticesPageSettings;
}

export async function getNoticesPageSettings(): Promise<NoticesPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: NOTICES_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateNoticesPageSettings(
  input: Partial<NoticesPageSettings>
): Promise<NoticesPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(NOTICES_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof NoticesPageSettings] !== undefined) {
      cleaned[key] = input[key as keyof NoticesPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: NOTICES_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: NOTICES_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (await col.findOne({ key: NOTICES_PAGE_SETTINGS_KEY }))
    ?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
