// src/repositories/life-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  LIFE_PAGE_SETTINGS_DEFAULTS,
  LIFE_PAGE_SETTINGS_KEY,
  LifePageSettings,
} from "@/types/life-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): LifePageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...LIFE_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as LifePageSettings;
}

export async function getLifePageSettings(): Promise<LifePageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: LIFE_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateLifePageSettings(
  input: Partial<LifePageSettings>
): Promise<LifePageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(LIFE_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof LifePageSettings] !== undefined) {
      cleaned[key] = input[key as keyof LifePageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: LIFE_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: LIFE_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: LIFE_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
