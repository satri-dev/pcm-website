"use client";

import { useState, type ReactNode } from "react";
import { Save, Link2, Plus, Trash2 } from "lucide-react";
import {
  FACULTY_PAGE_SETTINGS_DEFAULTS,
  type FacultyPageSettings,
  type FacultyStat,
} from "@/types/faculty-page-settings";

const API_BASE = "/api/admin/pages/faculty-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-[var(--admin-ink)]">
      {c}
    </span>
  );
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function FacultyPageSettings({
  initial,
}: {
  initial: FacultyPageSettings;
}) {
  const [form, setForm] = useState<FacultyPageSettings>({
    ...FACULTY_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof FacultyPageSettings>(
    key: K,
    value: FacultyPageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateStat = (idx: number, patch: Partial<FacultyStat>) => {
    set("stats", form.stats.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };
  const addStat = () => {
    set("stats", [...form.stats, { id: uid(), count: 0, suffix: "", label: "" }]);
  };
  const removeStat = (idx: number) =>
    set("stats", form.stats.filter((_, i) => i !== idx));

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
      setMessage(
        "Saved. The public /about/faculty page now reflects these changes."
      );
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
            Faculty & Staff Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit the sections of the public /about/faculty page — hero,
            leadership headings, faculty &amp; administration headings, by the
            numbers and CTA band. The faculty/staff cards come from the Faculty
            content manager.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/about/faculty"
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

      {/* ── Leadership section ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Leadership Section</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.leadershipEyebrow}
                onChange={(e) => set("leadershipEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.leadershipTitle}
                onChange={(e) => set("leadershipTitle", e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* ── Faculty & administration section ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Faculty & Administration Section</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.teamEyebrow}
                onChange={(e) => set("teamEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.teamTitle}
                onChange={(e) => set("teamTitle", e.target.value)}
              />
            </label>
          </div>

          <div className="rounded-xl border border-[var(--admin-line)] bg-black/[0.02] p-4">
            <p className="m-0 text-[0.9rem] text-[var(--admin-muted)]">
              The faculty and staff cards displayed here come from the Faculty
              content manager — grouped by their configured group (Leadership vs
              others).
            </p>
            <a className="admin-btn mt-3" href="/admin/people/faculty">
              Manage Faculty & Staff →
            </a>
          </div>
        </div>
      </div>

      {/* ── By the numbers ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>By the Numbers — Stats</h3>
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

          <div className="mt-4 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">
              Stats ({form.stats.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addStat}
            >
              <Plus size={14} /> Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {form.stats.map((stat, i) => (
              <div
                key={stat.id}
                className="grid grid-cols-1 md:grid-cols-[auto_1fr_90px_1fr_auto] gap-3 items-end rounded-xl border border-[var(--admin-line)] p-3"
              >
                <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[var(--admin-brand)]">
                  {stat.id}
                </span>
                <label className="block">
                  {fieldLabel("Count")}
                  <input
                    type="number"
                    min={0}
                    className={INPUT}
                    value={stat.count}
                    onChange={(e) =>
                      updateStat(i, {
                        count: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                  />
                </label>
                <label className="block">
                  {fieldLabel("Suffix")}
                  <input
                    className={INPUT}
                    value={stat.suffix}
                    onChange={(e) => updateStat(i, { suffix: e.target.value })}
                  />
                </label>
                <label className="block">
                  {fieldLabel("Label")}
                  <input
                    className={INPUT}
                    value={stat.label}
                    onChange={(e) => updateStat(i, { label: e.target.value })}
                  />
                </label>
                <div className="flex gap-1 pb-1">
                  <button
                    type="button"
                    className="admin-icon-btn danger"
                    aria-label="Remove"
                    onClick={() => removeStat(i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
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
          onClick={handleSave}
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
