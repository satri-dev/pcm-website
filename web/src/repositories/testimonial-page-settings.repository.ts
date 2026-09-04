// src/repositories/testimonial-page-settings.repository.ts
import { getDb } from "@/core/lib/db";
import {
  TESTIMONIAL_PAGE_SETTINGS_DEFAULTS,
  TESTIMONIAL_PAGE_SETTINGS_KEY,
  TestimonialPageSettings,
} from "@/types/testimonial-page-settings";

interface SettingsDoc {
  key: string;
  value: Record<string, unknown>;
}

function fromDoc(
  value: Record<string, unknown> | undefined
): TestimonialPageSettings {
  const v = (value ?? {}) as Record<string, unknown>;

  const defaults = TESTIMONIAL_PAGE_SETTINGS_DEFAULTS as unknown as Record<
    string,
    unknown
  >;
  const savedForm =
    typeof v.form === "object" && v.form !== null
      ? (v.form as Record<string, unknown>)
      : {};
  const defaultForm =
    defaults.form as unknown as Record<string, unknown>;

  const merged = {
    ...defaults,
    ...v,
    form: { ...defaultForm, ...savedForm },
  };
  return merged as unknown as TestimonialPageSettings;
}

export async function getTestimonialPageSettings(): Promise<TestimonialPageSettings> {
  const db = await getDb();
  const doc = await db
    .collection<SettingsDoc>("site_settings")
    .findOne({ key: TESTIMONIAL_PAGE_SETTINGS_KEY });
  return fromDoc(doc?.value);
}

export async function updateTestimonialPageSettings(
  input: Partial<TestimonialPageSettings>
): Promise<TestimonialPageSettings> {
  const db = await getDb();
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(TESTIMONIAL_PAGE_SETTINGS_DEFAULTS)) {
    if (
      key in input &&
      input[key as keyof TestimonialPageSettings] !== undefined
    ) {
      cleaned[key] = input[key as keyof TestimonialPageSettings];
    }
  }

  const col = db.collection<SettingsDoc>("site_settings");
  const now = new Date();
  await col.updateOne(
    { key: TESTIMONIAL_PAGE_SETTINGS_KEY },
    {
      $set: { value: cleaned, updatedAt: now },
      $setOnInsert: { key: TESTIMONIAL_PAGE_SETTINGS_KEY, createdAt: now },
    },
    { upsert: true }
  );

  const existing = (
    await col.findOne({ key: TESTIMONIAL_PAGE_SETTINGS_KEY })
  )?.value;
  return fromDoc({ ...(existing ?? {}), ...cleaned });
}
