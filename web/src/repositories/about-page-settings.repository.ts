// src/repositories/about-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  ABOUT_PAGE_SETTINGS_DEFAULTS,
  ABOUT_PAGE_SETTINGS_KEY,
  AboutPageSettings,
} from "@/types/about-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(
  value: Record<string, unknown> | undefined
): AboutPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...ABOUT_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as AboutPageSettings;
}

export async function getAboutPageSettings(): Promise<AboutPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: ABOUT_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateAboutPageSettings(
  input: Partial<AboutPageSettings>
): Promise<AboutPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(ABOUT_PAGE_SETTINGS_DEFAULTS)) {
    if (
      key in input &&
      input[key as keyof AboutPageSettings] !== undefined
    ) {
      cleaned[key] = input[key as keyof AboutPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: ABOUT_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: ABOUT_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: ABOUT_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
