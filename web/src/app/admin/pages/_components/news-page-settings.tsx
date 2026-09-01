"use client";

import { useState } from "react";
import { Save, Link2, Plus, Trash2 } from "lucide-react";
import {
  NEWS_PAGE_SETTINGS_DEFAULTS,
  type NewsPageSettings,
} from "@/types/news-page-settings";

const API_BASE = "/api/admin/pages/news-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: React.ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-[var(--admin-ink)]">
      {c}
    </span>
  );
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function NewsPageSettings({
  initial,
}: {
  initial: NewsPageSettings;
}) {
  const [form, setForm] = useState<NewsPageSettings>({
    ...NEWS_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof NewsPageSettings>(
    key: K,
    value: NewsPageSettings[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  /* ── Sidebar notices helpers ── */
  const updateNotice = (
    idx: number,
    patch: Partial<{ day: string; month: string; title: string; ago: string }>,
  ) => {
    set(
      "sidebarNotices",
      form.sidebarNotices.map((n, i) => (i === idx ? { ...n, ...patch } : n)),
    );
  };
  const addNotice = () => {
    set("sidebarNotices", [
      ...form.sidebarNotices,
      { day: "", month: "", title: "", ago: "" },
    ]);
  };
  const removeNotice = (idx: number) => {
    set("sidebarNotices", form.sidebarNotices.filter((_, i) => i !== idx));
  };

  /* ── Save ── */
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
        "Saved. The public /news page now reflects these changes.",
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
            News Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit every section of the public /news page — hero, featured story,
            stories, sidebar notices, newsletter and CTA band.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/news"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Link2 size={15} />
          View live page
        </a>
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

      {/* ── Featured ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Featured Story</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.featuredEyebrow}
                onChange={(e) => set("featuredEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.featuredTitle}
                onChange={(e) => set("featuredTitle", e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* ── Stories ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Stories Section</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.storiesEyebrow}
                onChange={(e) => set("storiesEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.storiesTitle}
                onChange={(e) => set("storiesTitle", e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* ── Sidebar Notices ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Sidebar Notices</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <label className="block">
            {fieldLabel("Notices Title")}
            <input
              className={INPUT}
              value={form.sidebarNoticesTitle}
              onChange={(e) => set("sidebarNoticesTitle", e.target.value)}
            />
          </label>

          <div className="mt-4 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">
              Notices ({form.sidebarNotices.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addNotice}
            >
              <Plus size={14} /> Add Notice
            </button>
          </div>

          <div className="space-y-4">
            {form.sidebarNotices.map((notice, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--admin-line)] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[var(--admin-brand)]">
                    Notice {i + 1}
                  </span>
                  <button
                    type="button"
                    className="admin-icon-btn danger"
                    aria-label="Remove"
                    onClick={() => removeNotice(i)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="block">
                    {fieldLabel("Day")}
                    <input
                      className={INPUT}
                      value={notice.day}
                      onChange={(e) =>
                        updateNotice(i, { day: e.target.value })
                      }
                      placeholder="06"
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Month")}
                    <input
                      className={INPUT}
                      value={notice.month}
                      onChange={(e) =>
                        updateNotice(i, { month: e.target.value })
                      }
                      placeholder="Jul"
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Ago")}
                    <input
                      className={INPUT}
                      value={notice.ago}
                      onChange={(e) =>
                        updateNotice(i, { ago: e.target.value })
                      }
                      placeholder="1 month ago"
                    />
                  </label>
                </div>

                <label className="block">
                  {fieldLabel("Title")}
                  <input
                    className={INPUT}
                    value={notice.title}
                    onChange={(e) =>
                      updateNotice(i, { title: e.target.value })
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Newsletter</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <label className="block">
            {fieldLabel("Title")}
            <input
              className={INPUT}
              value={form.newsletterTitle}
              onChange={(e) => set("newsletterTitle", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Text")}
            <textarea
              rows={3}
              className={INPUT}
              value={form.newsletterText}
              onChange={(e) => set("newsletterText", e.target.value)}
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
            {fieldLabel("Keywords \u2014 one per line")}
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
