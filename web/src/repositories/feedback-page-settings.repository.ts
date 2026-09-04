// src/repositories/feedback-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  FEEDBACK_PAGE_SETTINGS_DEFAULTS,
  FEEDBACK_PAGE_SETTINGS_KEY,
  FeedbackPageSettings,
} from "@/types/feedback-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): FeedbackPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...FEEDBACK_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as FeedbackPageSettings;
}

export async function getFeedbackPageSettings(): Promise<FeedbackPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: FEEDBACK_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateFeedbackPageSettings(
  input: Partial<FeedbackPageSettings>
): Promise<FeedbackPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(FEEDBACK_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof FeedbackPageSettings] !== undefined) {
      cleaned[key] = input[key as keyof FeedbackPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: FEEDBACK_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: FEEDBACK_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: FEEDBACK_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
