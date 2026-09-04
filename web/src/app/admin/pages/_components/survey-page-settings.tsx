"use client";

import { useState } from "react";
import { Save, Link2 } from "lucide-react";
import {
  SURVEY_PAGE_SETTINGS_DEFAULTS,
  type SurveyPageSettings,
} from "@/types/survey-page-settings";

const API_BASE = "/api/admin/pages/survey-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: React.ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-[var(--admin-ink)]">
      {c}
    </span>
  );
}

export default function SurveyPageSettings({
  initial,
}: {
  initial: SurveyPageSettings;
}) {
  const [form, setForm] = useState<SurveyPageSettings>({
    ...SURVEY_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof SurveyPageSettings>(
    key: K,
    value: SurveyPageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

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
      setMessage("Saved. The public /survey page now reflects these changes.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Survey Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit every section of the public /survey page — hero, listing,
            responder form copy and CTA band. The surveys themselves are managed
            under Content · Surveys.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/survey"
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

      {/* ── Listing ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Survey Listing</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.listEyebrow}
                onChange={(e) => set("listEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.listTitle}
                onChange={(e) => set("listTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.listSubtitle}
              onChange={(e) => set("listSubtitle", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Surveys shown per page")}
            <input
              type="number"
              className={INPUT + " max-w-[8rem]"}
              min={1}
              max={12}
              value={form.perPage}
              onChange={(e) =>
                set(
                  "perPage",
                  Math.max(1, Math.min(12, parseInt(e.target.value) || 1))
                )
              }
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Empty Title")}
              <input
                className={INPUT}
                value={form.emptyTitle}
                onChange={(e) => set("emptyTitle", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Empty Text")}
              <input
                className={INPUT}
                value={form.emptyText}
                onChange={(e) => set("emptyText", e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* ── Responder form copy ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Responder Form Copy</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.detailEyebrow}
                onChange={(e) => set("detailEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.detailTitle}
                onChange={(e) => set("detailTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.detailSubtitle}
              onChange={(e) => set("detailSubtitle", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Submit Button Label")}
              <input
                className={INPUT}
                value={form.submitLabel}
                onChange={(e) => set("submitLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Back-to-list Label")}
              <input
                className={INPUT}
                value={form.backToListLabel}
                onChange={(e) => set("backToListLabel", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Thank-you Title")}
              <input
                className={INPUT}
                value={form.thankYouTitle}
                onChange={(e) => set("thankYouTitle", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Respondent Label")}
              <input
                className={INPUT}
                value={form.respondentLabel}
                onChange={(e) => set("respondentLabel", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Respondent Hint")}
            <input
              className={INPUT}
              value={form.respondentHint}
              onChange={(e) => set("respondentHint", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Thank-you Text")}
            <textarea
              rows={3}
              className={INPUT}
              value={form.thankYouText}
              onChange={(e) => set("thankYouText", e.target.value)}
            />
          </label>
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
              {fieldLabel("Button Label")}
              <input
                className={INPUT}
                value={form.ctaLabel}
                onChange={(e) => set("ctaLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Button Link")}
              <input
                className={INPUT}
                value={form.ctaHref}
                onChange={(e) => set("ctaHref", e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* ── Save ── */}
      <div className="flex items-center gap-4">
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
