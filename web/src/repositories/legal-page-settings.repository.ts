import { getDb } from "@/core/lib/db";
import {
  TERMS_PAGE_SETTINGS_DEFAULTS,
  TERMS_PAGE_SETTINGS_KEY,
  PRIVACY_PAGE_SETTINGS_DEFAULTS,
  PRIVACY_PAGE_SETTINGS_KEY,
  type LegalPageSettings,
} from "@/types/legal-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

/** @deprecated Legacy shape stored in older DB records. */
interface LegacySection {
  heading: string;
  body: string;
}

function getDefaultsForKey(key: string): LegalPageSettings {
  if (key === TERMS_PAGE_SETTINGS_KEY) return TERMS_PAGE_SETTINGS_DEFAULTS;
  if (key === PRIVACY_PAGE_SETTINGS_KEY) return PRIVACY_PAGE_SETTINGS_DEFAULTS;
  throw new UnknownKeyError(key);
}

function migrateSectionsToContent(sections: LegacySection[]): string {
  return sections
    .map((s) => `<h2>${s.heading}</h2>${s.body}`)
    .join("");
}

function fromDoc(
  key: string,
  value: Record<string, unknown> | undefined
): LegalPageSettings {
  const v = value ?? {};
  const defaults: Record<string, unknown> = { ...getDefaultsForKey(key) };
  const merged: Record<string, unknown> = { ...defaults, ...v };

  if (
    !merged.content &&
    Array.isArray(merged.sections) &&
    merged.sections.length > 0
  ) {
    merged.content = migrateSectionsToContent(
      merged.sections as LegacySection[]
    );
  }

  delete merged.sections;

  return merged as unknown as LegalPageSettings;
}

export async function getLegalPageSettings(
  key: string
): Promise<LegalPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key });
  return fromDoc(key, doc?.value);
}

export async function updateLegalPageSettings(
  key: string,
  input: Partial<LegalPageSettings>
): Promise<LegalPageSettings> {
  const db = await getDb();
  const defaults = getDefaultsForKey(key);

  const cleaned: Record<string, unknown> = {};
  for (const k of Object.keys(defaults)) {
    if (k in input && input[k as keyof LegalPageSettings] !== undefined) {
      cleaned[k] = input[k as keyof LegalPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (await col.findOne({ key }))?.value;
  return fromDoc(key, { ...(existing ?? {}), ...cleaned });
}

class UnknownKeyError extends Error {
  constructor(key: string) {
    super(`Unknown legal page settings key: ${key}`);
    this.name = "UnknownKeyError";
  }
}
