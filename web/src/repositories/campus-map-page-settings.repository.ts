// src/repositories/campus-map-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  CAMPUS_MAP_PAGE_SETTINGS_DEFAULTS,
  CAMPUS_MAP_PAGE_SETTINGS_KEY,
  CampusMapPageSettings,
} from "@/types/campus-map-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(
  value: Record<string, unknown> | undefined
): CampusMapPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...CAMPUS_MAP_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as CampusMapPageSettings;
}

export async function getCampusMapPageSettings(): Promise<CampusMapPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: CAMPUS_MAP_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateCampusMapPageSettings(
  input: Partial<CampusMapPageSettings>
): Promise<CampusMapPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(CAMPUS_MAP_PAGE_SETTINGS_DEFAULTS)) {
    if (
      key in input &&
      input[key as keyof CampusMapPageSettings] !== undefined
    ) {
      cleaned[key] = input[key as keyof CampusMapPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: CAMPUS_MAP_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: CAMPUS_MAP_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: CAMPUS_MAP_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
