"use client";

import { useState, type ReactNode } from "react";
import { Save, Link2 } from "lucide-react";
import {
  CAMPUS_MAP_PAGE_SETTINGS_DEFAULTS,
  type CampusMapPageSettings,
} from "@/types/campus-map-page-settings";
import CampusMapLocationManager, {
  type LocationSplitData,
} from "./campus-map-location-manager";

const API_BASE = "/api/admin/pages/campus-map-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-[var(--admin-ink)]">
      {c}
    </span>
  );
}

export default function CampusMapPageSettings({
  initial,
}: {
  initial: CampusMapPageSettings;
}) {
  const [form, setForm] = useState<CampusMapPageSettings>({
    ...CAMPUS_MAP_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof CampusMapPageSettings>(
    key: K,
    value: CampusMapPageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (overrides?: Partial<CampusMapPageSettings>) => {
    setSaving(true);
    setMessage("");
    try {
      const payload = { ...form, ...overrides };
      const res = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Save failed (HTTP ${res.status})`);
      }
      setMessage(
        "Saved. The public /about/campus-map page now reflects these changes."
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Campus Map Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit the sections of the public /about/campus-map page — hero,
            explore section and location split. The map landmarks come from the
            Campus Map content manager.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/about/campus-map"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Link2 size={15} />
          View live page
        </a>
      </div>

      {/* ── SEO ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>SEO & Metadata</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <label className="block">
            {fieldLabel("Page Title")}
            <textarea
              rows={1}
              className={INPUT}
              value={form.seoTitle}
              onChange={(e) => set("seoTitle", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Meta Description")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.seoDescription}
              onChange={(e) => set("seoDescription", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Keywords — one per line")}
            <textarea
              rows={3}
              className={INPUT}
              value={form.seoKeywords.join("\n")}
              onChange={(e) =>
                set(
                  "seoKeywords",
                  e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
                )
              }
            />
          </label>
          <label className="block">
            {fieldLabel("OG Image URL")}
            <input
              className={INPUT}
              value={form.ogImage}
              onChange={(e) => set("ogImage", e.target.value)}
              placeholder="/assets/img/about-2.jpg"
            />
          </label>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Page Hero</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <label className="block">
            {fieldLabel("Hero Title")}
            <input
              className={INPUT}
              value={form.heroTitle}
              onChange={(e) => set("heroTitle", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Hero Subtitle")}
            <textarea
              rows={3}
              className={INPUT}
              value={form.heroSubtitle}
              onChange={(e) => set("heroSubtitle", e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* ── Explore section ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Explore Section</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.exploreEyebrow}
                onChange={(e) => set("exploreEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.exploreTitle}
                onChange={(e) => set("exploreTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.exploreSubtitle}
              onChange={(e) => set("exploreSubtitle", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Facilities Button Label")}
              <input
                className={INPUT}
                value={form.facilitiesButtonLabel}
                onChange={(e) => set("facilitiesButtonLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Facilities Button Link")}
              <input
                className={INPUT}
                value={form.facilitiesButtonHref}
                onChange={(e) => set("facilitiesButtonHref", e.target.value)}
              />
            </label>
          </div>

          <div className="rounded-xl border border-[var(--admin-line)] bg-black/[0.02] p-4">
            <p className="m-0 text-[0.9rem] text-[var(--admin-muted)]">
              The map landmarks shown here come from the Campus Map content
              manager. Each landmark&apos;s rich-text description is rendered
              in the popup.
            </p>
            <a className="admin-btn mt-3" href="/admin/campus/campus-map">
              Manage Campus Map Landmarks →
            </a>
          </div>
        </div>
      </div>

      {/* ── Location split ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3 className="font-bold">Location — Split Section</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <CampusMapLocationManager
            data={{
              locationEyebrow: form.locationEyebrow,
              locationTitle: form.locationTitle,
              locationParagraph: form.locationParagraph,
              locationChecklist: form.locationChecklist,
              locationImage: form.locationImage,
              locationImageAlt: form.locationImageAlt,
              locationBadgeValue: form.locationBadgeValue,
              locationBadgeLabel: form.locationBadgeLabel,
              directionsButtonLabel: form.directionsButtonLabel,
              directionsButtonHref: form.directionsButtonHref,
            }}
            onSave={async (draft: LocationSplitData) => {
              set("locationEyebrow", draft.locationEyebrow);
              set("locationTitle", draft.locationTitle);
              set("locationParagraph", draft.locationParagraph);
              set("locationChecklist", draft.locationChecklist);
              set("locationImage", draft.locationImage);
              set("locationImageAlt", draft.locationImageAlt);
              set("locationBadgeValue", draft.locationBadgeValue);
              set("locationBadgeLabel", draft.locationBadgeLabel);
              set("directionsButtonLabel", draft.directionsButtonLabel);
              set("directionsButtonHref", draft.directionsButtonHref);
              await handleSave({
                locationEyebrow: draft.locationEyebrow,
                locationTitle: draft.locationTitle,
                locationParagraph: draft.locationParagraph,
                locationChecklist: draft.locationChecklist,
                locationImage: draft.locationImage,
                locationImageAlt: draft.locationImageAlt,
                locationBadgeValue: draft.locationBadgeValue,
                locationBadgeLabel: draft.locationBadgeLabel,
                directionsButtonLabel: draft.directionsButtonLabel,
                directionsButtonHref: draft.directionsButtonHref,
              });
            }}
          />
        </div>
      </div>

      {/* ── CTA Band ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>CTA Band</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <label className="block">
            {fieldLabel("Title")}
            <input
              className={INPUT}
              value={form.ctaTitle}
              onChange={(e) => set("ctaTitle", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Text")}
            <textarea
              rows={3}
              className={INPUT}
              value={form.ctaText}
              onChange={(e) => set("ctaText", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Primary Button Label")}
              <input
                className={INPUT}
                value={form.ctaPrimaryLabel}
                onChange={(e) => set("ctaPrimaryLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Primary Button Link")}
              <input
                className={INPUT}
                value={form.ctaPrimaryHref}
                onChange={(e) => set("ctaPrimaryHref", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Secondary Button Label")}
              <input
                className={INPUT}
                value={form.ctaSecondaryLabel}
                onChange={(e) => set("ctaSecondaryLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Secondary Button Link")}
              <input
                className={INPUT}
                value={form.ctaSecondaryHref}
                onChange={(e) => set("ctaSecondaryHref", e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* ── Save ── */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="admin-btn admin-btn--primary"
        >
          <Save size={16} />
          {saving ? "Saving\u2026" : "Save changes"}
        </button>
        {message && (
          <span
            className={
              "text-[0.9rem] " +
              (message.startsWith("Saved")
                ? "text-[var(--admin-green)]"
                : "text-[var(--admin-red)]")
            }
          >
            {message}
          </span>
        )}
      </div>
    </main>
  );
}
