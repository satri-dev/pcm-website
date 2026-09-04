"use client";

import { useState } from "react";
import { Save, Link2, Plus, X, ExternalLink } from "lucide-react";
import {
  BLOG_ARTICLE_SETTINGS_DEFAULTS,
  type BlogArticleSettings,
  type UsefulLink,
} from "@/types/blog-article-settings";

const API_BASE = "/api/admin/pages/blog-article-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: React.ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-[var(--admin-ink)]">
      {c}
    </span>
  );
}

export default function BlogArticleSettings({
  initial,
}: {
  initial: BlogArticleSettings;
}) {
  const [form, setForm] = useState<BlogArticleSettings>({
    ...BLOG_ARTICLE_SETTINGS_DEFAULTS,
    ...initial,
    usefulLinks: initial.usefulLinks?.length
      ? initial.usefulLinks
      : BLOG_ARTICLE_SETTINGS_DEFAULTS.usefulLinks,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof BlogArticleSettings>(
    key: K,
    value: BlogArticleSettings[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateLink = <K extends keyof UsefulLink>(
    index: number,
    key: K,
    value: UsefulLink[K],
  ) =>
    setForm((prev) => {
      const links = [...(prev.usefulLinks ?? [])];
      links[index] = { ...links[index], [key]: value };
      return { ...prev, usefulLinks: links };
    });

  const addLink = () =>
    setForm((prev) => ({
      ...prev,
      usefulLinks: [...(prev.usefulLinks ?? []), { label: "", href: "" }],
    }));

  const removeLink = (index: number) =>
    setForm((prev) => ({
      ...prev,
      usefulLinks: (prev.usefulLinks ?? []).filter((_, i) => i !== index),
    }));

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
      setMessage("Saved. The public blog article page reflects these changes.");
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
            Blog Article Page
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Configure the article detail page at /blogs/[slug] — breadcrumbs,
            byline, back link, a useful-links section, related posts and SEO.
            This only affects the page chrome around the blog content itself.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/blogs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Link2 size={15} />
          View blog page
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
            <label className="block">
              {fieldLabel("Published label prefix")}
              <input
                className={INPUT}
                value={form.publishedLabelPrefix}
                onChange={(e) => set("publishedLabelPrefix", e.target.value)}
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

      {/* ── Useful links ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Useful Links</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Section eyebrow")}
              <input
                className={INPUT}
                value={form.usefulLinksEyebrow}
                onChange={(e) => set("usefulLinksEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Section title")}
              <input
                className={INPUT}
                value={form.usefulLinksTitle}
                onChange={(e) => set("usefulLinksTitle", e.target.value)}
              />
            </label>
          </div>

          <div className="space-y-3">
            {(form.usefulLinks ?? []).map((link, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr_auto] gap-3 items-center"
              >
                <input
                  className={INPUT}
                  placeholder="Link label"
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                />
                <div className="relative">
                  <input
                    className={INPUT + " pr-9"}
                    placeholder="https://pcm.edu.np/programs"
                    value={link.href}
                    onChange={(e) => updateLink(i, "href", e.target.value)}
                  />
                  <ExternalLink
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none"
                  />
                </div>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Remove link"
                  onClick={() => removeLink(i)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button type="button" className="admin-btn" onClick={addLink}>
              <Plus size={16} />
              Add link
            </button>
            <label className="flex items-center gap-2 text-sm text-[var(--admin-ink)]">
              <input
                type="checkbox"
                checked={form.showUsefulLinks}
                onChange={(e) => set("showUsefulLinks", e.target.checked)}
              />
              Show useful links section on the article page
            </label>
          </div>
        </div>
      </div>

      {/* ── Related posts ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Related Posts</h3>
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
            Show related posts on the article page
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
            {fieldLabel("Title suffix (appended to blog title)")}
            <input
              className={INPUT}
              value={form.seoTitleSuffix}
              onChange={(e) => set("seoTitleSuffix", e.target.value)}
              placeholder="| PCM Blog"
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
