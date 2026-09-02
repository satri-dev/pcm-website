// src/repositories/navbar-settings.repository.ts
import { getDb } from "@/core/lib/db";
import type { NavbarSettings } from "@/types/nav-menu";

export const NAVBAR_SETTINGS_COLLECTION = "navbar-settings";

interface NavbarSettingsDocument extends NavbarSettings {
  _id?: import("mongodb").ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const DEFAULT_NAVBAR_SETTINGS: NavbarSettings = {
  logoUrl: "/images/logo-pcm.png",
  ctaLabel: "Apply Now",
  ctaHref: "/admission",
  ctaEnabled: true,
};

function fromDocument(doc: NavbarSettingsDocument): NavbarSettings {
  return {
    logoUrl: doc.logoUrl,
    ctaLabel: doc.ctaLabel,
    ctaHref: doc.ctaHref,
    ctaEnabled: doc.ctaEnabled ?? true,
  };
}

/**
 * Get the navbar settings configuration.
 * Creates it from defaults if it doesn't exist.
 */
export async function getNavbarSettings(): Promise<NavbarSettings> {
  "use cache";
  const db = await getDb();
  const col = db.collection<NavbarSettingsDocument>(NAVBAR_SETTINGS_COLLECTION);
  let doc = await col.findOne({});
  
  if (!doc) {
    const now = new Date();
    const insert = { ...DEFAULT_NAVBAR_SETTINGS, createdAt: now, updatedAt: now };
    const result = await col.insertOne(insert as NavbarSettingsDocument);
    doc = { ...insert, _id: result.insertedId };
  }
  
  return fromDocument(doc);
}

/**
 * Update the navbar settings configuration.
 */
export async function updateNavbarSettings(
  settings: Partial<NavbarSettings>
): Promise<NavbarSettings> {
  const db = await getDb();
  const col = db.collection<NavbarSettingsDocument>(NAVBAR_SETTINGS_COLLECTION);

  const set: Record<string, unknown> = { 
    updatedAt: new Date(),
    ...settings,
  };

  // Ensure document exists
  const existing = await col.findOne({});
  if (!existing) {
    const now = new Date();
    await col.insertOne({
      ...DEFAULT_NAVBAR_SETTINGS,
      ...set,
      createdAt: now,
      updatedAt: now,
    } as NavbarSettingsDocument);
  } else {
    await col.updateOne({ _id: existing._id }, { $set: set });
  }

  return getNavbarSettings();
}
