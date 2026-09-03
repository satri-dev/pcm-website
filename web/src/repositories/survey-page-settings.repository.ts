// src/repositories/survey-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  SURVEY_PAGE_SETTINGS_DEFAULTS,
  SURVEY_PAGE_SETTINGS_KEY,
  SurveyPageSettings,
} from "@/types/survey-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): SurveyPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...SURVEY_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as SurveyPageSettings;
}

export async function getSurveyPageSettings(): Promise<SurveyPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: SURVEY_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateSurveyPageSettings(
  input: Partial<SurveyPageSettings>
): Promise<SurveyPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(SURVEY_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof SurveyPageSettings] !== undefined) {
      cleaned[key] = input[key as keyof SurveyPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: SURVEY_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: SURVEY_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (await col.findOne({ key: SURVEY_PAGE_SETTINGS_KEY }))
    ?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
