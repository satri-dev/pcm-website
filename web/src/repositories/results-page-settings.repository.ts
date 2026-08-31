// src/repositories/results-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  RESULTS_PAGE_SETTINGS_DEFAULTS,
  RESULTS_PAGE_SETTINGS_KEY,
  ResultsPageSettings,
} from "@/types/results-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): ResultsPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...RESULTS_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as ResultsPageSettings;
}

export async function getResultsPageSettings(): Promise<ResultsPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: RESULTS_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateResultsPageSettings(
  input: Partial<ResultsPageSettings>
): Promise<ResultsPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(RESULTS_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof ResultsPageSettings] !== undefined) {
      cleaned[key] = input[key as keyof ResultsPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: RESULTS_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: RESULTS_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (await col.findOne({ key: RESULTS_PAGE_SETTINGS_KEY }))
    ?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
