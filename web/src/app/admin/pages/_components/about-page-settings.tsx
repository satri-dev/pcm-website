"use client";

import { useState, type ReactNode } from "react";
import { Save, Link2 } from "lucide-react";
import {
  ABOUT_PAGE_SETTINGS_DEFAULTS,
  type AboutPageSettings,
} from "@/types/about-page-settings";
import Link from "next/link";
import AboutWhoWeAreManager, {
  type WhoWeAreData,
} from "./about-who-we-are-manager";
import AboutWhyStudyManager, {
  type WhyStudyData,
} from "./about-why-study-manager";
import AboutVmvManager from "./about-vmv-manager";
import AboutDiffManager from "./about-diff-manager";
import AboutStatsManager from "./about-stats-manager";

const API_BASE = "/api/admin/pages/about-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-(--admin-ink)">
      {c}
    </span>
  );
}

export default function AboutPageSettings({
  initial,
}: {
  initial: AboutPageSettings;
}) {
  const [form, setForm] = useState<AboutPageSettings>({
    ...ABOUT_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof AboutPageSettings>(
    key: K,
    value: AboutPageSettings[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  /* ── Save ── */
  const handleSave = async (overrides?: Partial<AboutPageSettings>) => {
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
      setMessage("Saved. The public /about page now reflects these changes.");
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
          <h2 className="m-0 text-2xl font-bold text-(--admin-ink)">
            About Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-(--admin-muted)">
            Edit the sections of the public /about page — hero, who we are, why
            study at PCM, vision/mission/values, the PCM difference, by the
            numbers, voices headings and CTA band. Testimonial cards come from
            the homepage content manager.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/about"
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
                    .filter(Boolean),
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
              placeholder="/assets/img/about-1.jpg"
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

      {/* ── Who we are (split) ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3 className="font-bold">Who We Are — Split Intro</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <AboutWhoWeAreManager
            data={{
              whoEyebrow: form.whoEyebrow,
              whoTitle: form.whoTitle,
              whoParagraphs: form.whoParagraphs,
              whoPills: form.whoPills,
              whoBadgeValue: form.whoBadgeValue,
              whoBadgeLabel: form.whoBadgeLabel,
              whoImageSrc: form.whoImageSrc,
              whoImageAlt: form.whoImageAlt,
            }}
            onSave={async (draft: WhoWeAreData) => {
              set("whoEyebrow", draft.whoEyebrow);
              set("whoTitle", draft.whoTitle);
              set("whoParagraphs", draft.whoParagraphs);
              set("whoPills", draft.whoPills);
              set("whoBadgeValue", draft.whoBadgeValue);
              set("whoBadgeLabel", draft.whoBadgeLabel);
              set("whoImageSrc", draft.whoImageSrc);
              set("whoImageAlt", draft.whoImageAlt);
              await handleSave({
                whoEyebrow: draft.whoEyebrow,
                whoTitle: draft.whoTitle,
                whoParagraphs: draft.whoParagraphs,
                whoPills: draft.whoPills,
                whoBadgeValue: draft.whoBadgeValue,
                whoBadgeLabel: draft.whoBadgeLabel,
                whoImageSrc: draft.whoImageSrc,
                whoImageAlt: draft.whoImageAlt,
              });
            }}
          />
        </div>
      </div>

      {/* ── Why study at PCM (reverse split) ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3 className="font-bold">Why Study at PCM — Reverse Split</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <AboutWhyStudyManager
            data={{
              whyEyebrow: form.whyEyebrow,
              whyTitle: form.whyTitle,
              whyParagraphs: form.whyParagraphs,
              whyImageSrc: form.whyImageSrc,
              whyImageAlt: form.whyImageAlt,
              whyCtaLabel: form.whyCtaLabel,
              whyCtaHref: form.whyCtaHref,
            }}
            onSave={async (draft: WhyStudyData) => {
              set("whyEyebrow", draft.whyEyebrow);
              set("whyTitle", draft.whyTitle);
              set("whyParagraphs", draft.whyParagraphs);
              set("whyImageSrc", draft.whyImageSrc);
              set("whyImageAlt", draft.whyImageAlt);
              set("whyCtaLabel", draft.whyCtaLabel);
              set("whyCtaHref", draft.whyCtaHref);
              await handleSave({
                whyEyebrow: draft.whyEyebrow,
                whyTitle: draft.whyTitle,
                whyParagraphs: draft.whyParagraphs,
                whyImageSrc: draft.whyImageSrc,
                whyImageAlt: draft.whyImageAlt,
                whyCtaLabel: draft.whyCtaLabel,
                whyCtaHref: draft.whyCtaHref,
              });
            }}
          />
        </div>
      </div>

      {/* ── Vision, Mission & Values ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3 className="font-bold">Vision, Mission & Values</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.vmvEyebrow}
                onChange={(e) => set("vmvEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.vmvTitle}
                onChange={(e) => set("vmvTitle", e.target.value)}
              />
            </label>
          </div>

          <AboutVmvManager
            cards={form.vmvCards}
            onCardsUpdate={(cards) => set("vmvCards", cards)}
            onSave={async (cards) => {
              await handleSave({ vmvCards: cards });
            }}
          />
        </div>
      </div>

      {/* ── The PCM difference ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3 className="font-bold">The PCM Difference</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.diffEyebrow}
                onChange={(e) => set("diffEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.diffTitle}
                onChange={(e) => set("diffTitle", e.target.value)}
              />
            </label>
          </div>

          <AboutDiffManager
            items={form.diffItems}
            onItemsUpdate={(items) => set("diffItems", items)}
            onSave={async (items) => {
              await handleSave({ diffItems: items });
            }}
          />
        </div>
      </div>

      {/* ── By the numbers ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3 className="font-bold">By the Numbers — Stats</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.statsEyebrow}
                onChange={(e) => set("statsEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.statsTitle}
                onChange={(e) => set("statsTitle", e.target.value)}
              />
            </label>
          </div>

          <AboutStatsManager
            stats={form.stats}
            onStatsUpdate={(stats) => set("stats", stats)}
            onSave={async (stats) => {
              await handleSave({ stats });
            }}
          />
        </div>
      </div>

      {/* ── Voices / Testimonials ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Voices of PCM — Testimonials</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.voicesEyebrow}
                onChange={(e) => set("voicesEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.voicesTitle}
                onChange={(e) => set("voicesTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.voicesSubtitle}
              onChange={(e) => set("voicesSubtitle", e.target.value)}
            />
          </label>
          <label className="block" style={{ maxWidth: "220px" }}>
            {fieldLabel("Testimonials per page")}
            <input
              type="number"
              min={1}
              max={12}
              className={INPUT}
              value={form.voicesPerPage}
              onChange={(e) =>
                set("voicesPerPage", Math.max(1, Number(e.target.value) || 1))
              }
            />
          </label>

          <div className="rounded-xl border border-[var(--admin-line)] bg-black/[0.02] p-4">
            <p className="m-0 text-[0.9rem] text-[var(--admin-muted)]">
              The testimonial cards displayed in this section come from the
              homepage content manager — add, edit or remove them there.
            </p>
            <Link className="admin-btn mt-3" href="/admin/pages/home">
              Manage Homepage Testimonials →
            </Link>
          </div>
        </div>
      </div>

      {/* ── CTA Band ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>CTA Band</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <label className="block">
            {fieldLabel("Eyebrow")}
            <input
              className={INPUT}
              value={form.ctaEyebrow}
              onChange={(e) => set("ctaEyebrow", e.target.value)}
            />
          </label>
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
