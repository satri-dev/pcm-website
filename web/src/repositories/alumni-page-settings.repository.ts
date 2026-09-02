// src/repositories/alumni-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  ALUMNI_PAGE_SETTINGS_DEFAULTS,
  ALUMNI_PAGE_SETTINGS_KEY,
  AlumniPageSettings,
} from "@/types/alumni-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(
  value: Record<string, unknown> | undefined
): AlumniPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...ALUMNI_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as AlumniPageSettings;
}

export async function getAlumniPageSettings(): Promise<AlumniPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: ALUMNI_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateAlumniPageSettings(
  input: Partial<AlumniPageSettings>
): Promise<AlumniPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(ALUMNI_PAGE_SETTINGS_DEFAULTS)) {
    if (
      key in input &&
      input[key as keyof AlumniPageSettings] !== undefined
    ) {
      cleaned[key] = input[key as keyof AlumniPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: ALUMNI_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: ALUMNI_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: ALUMNI_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}