// src/repositories/careers-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  CAREERS_PAGE_SETTINGS_DEFAULTS,
  CAREERS_PAGE_SETTINGS_KEY,
  CareersPageSettings,
} from "@/types/careers-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): CareersPageSettings {
  const defaults: Record<string, unknown> = {
    ...CAREERS_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...(value ?? {}) };
  return merged as unknown as CareersPageSettings;
}

export async function getCareersPageSettings(): Promise<CareersPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: CAREERS_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateCareersPageSettings(
  input: Partial<CareersPageSettings>
): Promise<CareersPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(CAREERS_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof CareersPageSettings] !== undefined) {
      cleaned[key] = input[key as keyof CareersPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: CAREERS_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: CAREERS_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: CAREERS_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
