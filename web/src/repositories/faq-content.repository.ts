// src/repositories/faq-content.repository.ts
import { getDb } from "@/core/lib/db";
import {
  FAQ_PAGE_SETTINGS_DEFAULTS,
  FAQ_PAGE_SETTINGS_KEY,
  FaqPageSettings,
} from "@/types/faq-content";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): FaqPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...FAQ_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as FaqPageSettings;
}

export async function getFaqPageSettings(): Promise<FaqPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: FAQ_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateFaqPageSettings(
  input: Partial<FaqPageSettings>
): Promise<FaqPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(FAQ_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof FaqPageSettings] !== undefined) {
      cleaned[key] = input[key as keyof FaqPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: FAQ_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: FAQ_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (await col.findOne({ key: FAQ_PAGE_SETTINGS_KEY }))?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
