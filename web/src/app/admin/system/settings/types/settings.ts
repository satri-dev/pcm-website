import { ObjectId } from "mongodb";

/* ── Site Settings ── */
export interface SiteSettings {
  collegeName: string;
  logoUrl: string;
  updatedAt: string;
}

export interface SiteSettingsDocument {
  _id?: ObjectId;
  key: string;
  value: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/* ── Password Change ── */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  totpCode: string;
}

/* ── Collection Names ── */
export const SETTINGS_COLLECTION = "site_settings";

/* ── Converter Helpers ── */
export function siteSettingsFromDocument(doc: SiteSettingsDocument): SiteSettings {
  const value = doc.value as Record<string, unknown>;
  return {
    collegeName: (value.collegeName as string) || "PCM",
    logoUrl: (value.logoUrl as string) || "/logo-pcm.png",
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}