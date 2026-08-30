"use client";

import { useState } from "react";
import { Save, Link2, Images } from "lucide-react";
import {
  GALLERY_PAGE_SETTINGS_DEFAULTS,
  type GalleryPageSettings,
} from "@/types/gallery-settings";

const API_BASE = "/api/admin/pages/gallery-settings";

const INPUT_CLASS =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

const FIELDS: {
  key: keyof GalleryPageSettings;
  label: string;
  group: "hero" | "section" | "cta";
  hint?: string;
}[] = [
  { key: "heroTitle", label: "Hero title", group: "hero" },
  { key: "heroSubtitle", label: "Hero subtitle", group: "hero" },
  { key: "eyebrow", label: "Section eyebrow", group: "section" },
  { key: "title", label: "Section title", group: "section" },
  { key: "subtitle", label: "Section subtitle", group: "section" },
  { key: "ctaEyebrow", label: "CTA eyebrow", group: "cta" },
  { key: "ctaTitle", label: "CTA title", group: "cta" },
  { key: "ctaText", label: "CTA text", group: "cta" },
  { key: "ctaPrimaryLabel", label: "Primary button label", group: "cta" },
  { key: "ctaPrimaryHref", label: "Primary button link", group: "cta", hint: "e.g. /admission" },
  { key: "ctaSecondaryLabel", label: "Secondary button label", group: "cta" },
  { key: "ctaSecondaryHref", label: "Secondary button link", group: "cta", hint: "e.g. /about" },
];

const GROUP_TITLES: Record<"hero" | "section" | "cta", string> = {
  hero: "Page hero",
  section: "Gallery section heading",
  cta: "CTA band",
};

export default function GalleryPageSettings({
  initial,
}: {
  initial: GalleryPageSettings;
}) {
  const [form, setForm] = useState<GalleryPageSettings>({
    ...GALLERY_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = (key: keyof GalleryPageSettings, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Save failed (HTTP ${res.status})`);
      }
      setMessage("Saved. The public /gallery page now reflects these changes.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const groups: ("hero" | "section" | "cta")[] = ["hero", "section", "cta"];

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Gallery Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit the heading and CTA text shown on the public /gallery page.
            Manage the actual albums and photos in the media gallery.
          </p>
        </div>
        <a className="admin-btn" href="/admin/media/gallery">
          <Images size={16} />
          Manage Albums
        </a>
      </div>

      <div className="admin-panel mb-6">
        <div className="admin-panel__body p-6">
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[0.9rem] text-[var(--admin-blue)]"
          >
            <Link2 size={15} />
            View live gallery page
          </a>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group} className="admin-panel">
            <div className="admin-panel__body p-6">
              <h3 className="m-0 mb-1 text-base font-bold text-[var(--admin-ink)]">
                {GROUP_TITLES[group]}
              </h3>
              <p className="mt-0 mb-5 text-[0.85rem] text-[var(--admin-muted)]">
                {group === "cta"
                  ? "Shown as the call-to-action banner at the bottom of the page."
                  : group === "hero"
                  ? "Shown at the top of the page in the header band."
                  : "Shown above the album grid."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FIELDS.filter((f) => f.group === group).map((field) => (
                  <label
                    key={field.key}
                    className="block"
                    style={{ gridColumn: field.key.includes("Href") || field.key === "heroSubtitle" || field.key === "subtitle" || field.key === "ctaText" ? "1 / -1" : undefined }}
                  >
                    <span className="mb-1 block text-[0.85rem] font-medium text-[var(--admin-ink)]">
                      {field.label}
                    </span>
                    {field.key.includes("Href") ? (
                      <input
                        type="text"
                        value={form[field.key]}
                        onChange={(e) => set(field.key, e.target.value)}
                        className={INPUT_CLASS}
                      />
                    ) : (
                      <textarea
                        rows={field.key === "heroTitle" || field.key === "eyebrow" || field.key === "title" || field.key === "ctaEyebrow" || field.key === "ctaTitle" || field.key.includes("Label") ? 1 : 3}
                        value={form[field.key]}
                        onChange={(e) => set(field.key, e.target.value)}
                        className={INPUT_CLASS}
                      />
                    )}
                    {field.hint && (
                      <span className="mt-1 block text-[0.75rem] text-[var(--admin-muted)]">
                        {field.hint}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn--primary"
        >
          <Save size={16} />
          {saving ? "Saving…" : "Save changes"}
        </button>
        {message && (
          <span className="text-[0.9rem] text-[var(--admin-muted)]">{message}</span>
        )}
      </div>
    </main>
  );
}
