// src/repositories/facilities-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  FACILITIES_PAGE_SETTINGS_DEFAULTS,
  FACILITIES_PAGE_SETTINGS_KEY,
  FacilitiesPageSettings,
} from "@/types/facilities-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(
  value: Record<string, unknown> | undefined
): FacilitiesPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...FACILITIES_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as FacilitiesPageSettings;
}

export async function getFacilitiesPageSettings(): Promise<FacilitiesPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: FACILITIES_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateFacilitiesPageSettings(
  input: Partial<FacilitiesPageSettings>
): Promise<FacilitiesPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(FACILITIES_PAGE_SETTINGS_DEFAULTS)) {
    if (
      key in input &&
      input[key as keyof FacilitiesPageSettings] !== undefined
    ) {
      cleaned[key] = input[key as keyof FacilitiesPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: FACILITIES_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: FACILITIES_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: FACILITIES_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
