"use client";

import { useState } from "react";
import { Save, Link2 } from "lucide-react";
import {
  NEWS_ARTICLE_SETTINGS_DEFAULTS,
  type NewsArticleSettings,
} from "@/types/news-article-settings";

const API_BASE = "/api/admin/pages/news-article-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: React.ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-[var(--admin-ink)]">
      {c}
    </span>
  );
}

export default function NewsArticleSettings({
  initial,
}: {
  initial: NewsArticleSettings;
}) {
  const [form, setForm] = useState<NewsArticleSettings>({
    ...NEWS_ARTICLE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof NewsArticleSettings>(
    key: K,
    value: NewsArticleSettings[K],
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
      setMessage("Saved. The public news article page reflects these changes.");
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
            News Article Page
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Configure the article detail page at /news/[slug] — breadcrumbs,
            byline, back link, related stories and SEO.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/news"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Link2 size={15} />
          View news page
        </a>
      </div>

      {/* ── Breadcrumb & byline ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Breadcrumb & Byline</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              {fieldLabel("Breadcrumb label")}
              <input
                className={INPUT}
                value={form.breadcrumbLabel}
                onChange={(e) => set("breadcrumbLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Published label")}
              <input
                className={INPUT}
                value={form.publishedLabel}
                onChange={(e) => set("publishedLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Byline prefix")}
              <input
                className={INPUT}
                value={form.bylinePrefix}
                onChange={(e) => set("bylinePrefix", e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* ── Back link ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Back Link</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Label")}
              <input
                className={INPUT}
                value={form.backToAllLabel}
                onChange={(e) => set("backToAllLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Href")}
              <input
                className={INPUT}
                value={form.backToAllHref}
                onChange={(e) => set("backToAllHref", e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* ── Related stories ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Related Stories</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <label className="block">
            {fieldLabel("Section title")}
            <input
              className={INPUT}
              value={form.relatedTitle}
              onChange={(e) => set("relatedTitle", e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--admin-ink)]">
            <input
              type="checkbox"
              checked={form.showRelated}
              onChange={(e) => set("showRelated", e.target.checked)}
            />
            Show related stories on the article page
          </label>
        </div>
      </div>

      {/* ── SEO ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>SEO & Metadata</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <label className="block">
            {fieldLabel("Title suffix (appended to article title)")}
            <input
              className={INPUT}
              value={form.seoTitleSuffix}
              onChange={(e) => set("seoTitleSuffix", e.target.value)}
              placeholder="| PCM News"
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
