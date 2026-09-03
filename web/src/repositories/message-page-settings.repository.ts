// src/repositories/message-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  MESSAGE_PAGE_SETTINGS_DEFAULTS,
  MESSAGE_PAGE_SETTINGS_KEY,
  MessagePageSettings,
} from "@/types/message-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(
  value: Record<string, unknown> | undefined
): MessagePageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = { ...MESSAGE_PAGE_SETTINGS_DEFAULTS };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as MessagePageSettings;
}

export async function getMessagePageSettings(): Promise<MessagePageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: MESSAGE_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateMessagePageSettings(
  input: Partial<MessagePageSettings>
): Promise<MessagePageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(MESSAGE_PAGE_SETTINGS_DEFAULTS)) {
    if (
      key in input &&
      input[key as keyof MessagePageSettings] !== undefined
    ) {
      cleaned[key] = input[key as keyof MessagePageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: MESSAGE_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: MESSAGE_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: MESSAGE_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
