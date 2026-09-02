// src/repositories/faculty-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  FACULTY_PAGE_SETTINGS_DEFAULTS,
  FACULTY_PAGE_SETTINGS_KEY,
  FacultyPageSettings,
} from "@/types/faculty-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(
  value: Record<string, unknown> | undefined
): FacultyPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...FACULTY_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as FacultyPageSettings;
}

export async function getFacultyPageSettings(): Promise<FacultyPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: FACULTY_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateFacultyPageSettings(
  input: Partial<FacultyPageSettings>
): Promise<FacultyPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(FACULTY_PAGE_SETTINGS_DEFAULTS)) {
    if (
      key in input &&
      input[key as keyof FacultyPageSettings] !== undefined
    ) {
      cleaned[key] = input[key as keyof FacultyPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: FACULTY_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: FACULTY_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: FACULTY_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
