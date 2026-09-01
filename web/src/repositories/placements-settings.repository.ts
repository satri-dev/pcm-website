// src/repositories/placements-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  PLACEMENTS_PAGE_SETTINGS_DEFAULTS,
  PLACEMENTS_PAGE_SETTINGS_KEY,
  PlacementsPageSettings,
} from "@/types/placements-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(
  value: Record<string, unknown> | undefined
): PlacementsPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...PLACEMENTS_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as PlacementsPageSettings;
}

export async function getPlacementsPageSettings(): Promise<PlacementsPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: PLACEMENTS_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updatePlacementsPageSettings(
  input: Partial<PlacementsPageSettings>
): Promise<PlacementsPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(PLACEMENTS_PAGE_SETTINGS_DEFAULTS)) {
    if (
      key in input &&
      input[key as keyof PlacementsPageSettings] !== undefined
    ) {
      cleaned[key] = input[key as keyof PlacementsPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: PLACEMENTS_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: PLACEMENTS_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: PLACEMENTS_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
