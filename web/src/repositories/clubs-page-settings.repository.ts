// src/repositories/clubs-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  CLUBS_PAGE_SETTINGS_DEFAULTS,
  CLUBS_PAGE_SETTINGS_KEY,
  ClubsPageSettings,
} from "@/types/clubs-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): ClubsPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...CLUBS_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as ClubsPageSettings;
}

export async function getClubsPageSettings(): Promise<ClubsPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: CLUBS_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateClubsPageSettings(
  input: Partial<ClubsPageSettings>
): Promise<ClubsPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(CLUBS_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof ClubsPageSettings] !== undefined) {
      cleaned[key] = input[key as keyof ClubsPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: CLUBS_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: CLUBS_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: CLUBS_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
