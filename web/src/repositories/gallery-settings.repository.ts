// src/repositories/gallery-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  GALLERY_PAGE_SETTINGS_DEFAULTS,
  GALLERY_PAGE_SETTINGS_KEY,
  GalleryPageSettings,
} from "@/types/gallery-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(value: Record<string, unknown> | undefined): GalleryPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = {
    ...GALLERY_PAGE_SETTINGS_DEFAULTS,
  };
  const merged: Record<string, unknown> = { ...defaults, ...v };
  return merged as unknown as GalleryPageSettings;
}

export async function getGalleryPageSettings(): Promise<GalleryPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: GALLERY_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateGalleryPageSettings(
  input: Partial<GalleryPageSettings>
): Promise<GalleryPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(GALLERY_PAGE_SETTINGS_DEFAULTS)) {
    if (key in input && input[key as keyof GalleryPageSettings] !== undefined) {
      cleaned[key] = input[key as keyof GalleryPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: GALLERY_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: GALLERY_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (await col.findOne({ key: GALLERY_PAGE_SETTINGS_KEY }))
    ?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
