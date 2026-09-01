// src/repositories/events-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  EVENTS_PAGE_SETTINGS_DEFAULTS,
  EVENTS_PAGE_SETTINGS_KEY,
  EventsPageSettings,
} from "@/types/events-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): EventsPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...EVENTS_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as EventsPageSettings;
}

export async function getEventsPageSettings(): Promise<EventsPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: EVENTS_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateEventsPageSettings(
  input: Partial<EventsPageSettings>
): Promise<EventsPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(EVENTS_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof EventsPageSettings] !== undefined) {
      cleaned[key] = input[key as keyof EventsPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: EVENTS_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: EVENTS_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (await col.findOne({ key: EVENTS_PAGE_SETTINGS_KEY }))
    ?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
