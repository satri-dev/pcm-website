// src/repositories/scholarship-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  SCHOLARSHIP_PAGE_SETTINGS_DEFAULTS,
  SCHOLARSHIP_PAGE_SETTINGS_KEY,
  ScholarshipPageSettings,
} from "@/types/scholarship-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(
  value: Record<string, unknown> | undefined
): ScholarshipPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...SCHOLARSHIP_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as ScholarshipPageSettings;
}

export async function getScholarshipPageSettings(): Promise<ScholarshipPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: SCHOLARSHIP_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateScholarshipPageSettings(
  input: Partial<ScholarshipPageSettings>
): Promise<ScholarshipPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(SCHOLARSHIP_PAGE_SETTINGS_DEFAULTS)) {
    if (
      key in input &&
      input[key as keyof ScholarshipPageSettings] !== undefined
    ) {
      cleaned[key] = input[key as keyof ScholarshipPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: SCHOLARSHIP_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: SCHOLARSHIP_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: SCHOLARSHIP_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
