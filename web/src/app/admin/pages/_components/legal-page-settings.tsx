"use client";

import { useState, type ReactNode } from "react";
import { Save, Link2 } from "lucide-react";
import {
  TERMS_PAGE_SETTINGS_DEFAULTS,
  PRIVACY_PAGE_SETTINGS_DEFAULTS,
  type LegalPageSettings,
} from "@/types/legal-page-settings";
import RichTextEditor from "../../_components/editor/rich-text-editor";
import Link from "next/link";

const API_BASE = "/api/admin/pages/legal-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-(--admin-ink)">
      {c}
    </span>
  );
}

export default function LegalPageSettings({
  slug,
  initial,
}: {
  slug: string;
  initial: LegalPageSettings;
}) {
  const defaults = slug === "terms" ? TERMS_PAGE_SETTINGS_DEFAULTS : PRIVACY_PAGE_SETTINGS_DEFAULTS;
  const [form, setForm] = useState<LegalPageSettings>({
    ...defaults,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof LegalPageSettings>(
    key: K,
    value: LegalPageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Save failed (HTTP ${res.status})`);
      }
      setMessage("Saved successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const viewHref = slug === "terms" ? "/terms" : "/privacy";
  const pageName = slug === "terms" ? "Terms & Services" : "Privacy Policy";

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="m-0 text-2xl font-bold text-(--admin-ink)">
            {pageName} Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-(--admin-muted)">
            Edit the sections of the public {viewHref} page.
          </p>
        </div>
        <Link
          className="admin-btn"
          href={viewHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Link2 size={15} />
          View live page
        </Link>
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
            <textarea
              rows={1}
              className={INPUT}
              value={form.heroTitle}
              onChange={(e) => set("heroTitle", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Hero Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.heroSubtitle}
              onChange={(e) => set("heroSubtitle", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Last Updated")}
            <input
              type="text"
              className={INPUT}
              value={form.lastUpdated}
              onChange={(e) => set("lastUpdated", e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Content</h3>
        </div>
        <div className="admin-panel__body p-6">
          <RichTextEditor
            content={form.content}
            onChange={(html) => set("content", html)}
            placeholder="Write the full terms & services / privacy policy content here..."
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
            {fieldLabel("Eyebrow")}
            <input
              type="text"
              className={INPUT}
              value={form.ctaEyebrow}
              onChange={(e) => set("ctaEyebrow", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Title")}
            <input
              type="text"
              className={INPUT}
              value={form.ctaTitle}
              onChange={(e) => set("ctaTitle", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Text")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.ctaText}
              onChange={(e) => set("ctaText", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Primary Button Label")}
              <input
                type="text"
                className={INPUT}
                value={form.ctaPrimaryLabel}
                onChange={(e) => set("ctaPrimaryLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Primary Button Link")}
              <input
                type="text"
                className={INPUT}
                value={form.ctaPrimaryHref}
                onChange={(e) => set("ctaPrimaryHref", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Secondary Button Label")}
              <input
                type="text"
                className={INPUT}
                value={form.ctaSecondaryLabel}
                onChange={(e) => set("ctaSecondaryLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Secondary Button Link")}
              <input
                type="text"
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
          className="admin-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={15} />
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {message && (
          <span
            className="text-sm font-medium px-3 py-1 rounded-lg"
            style={{
              color: "#16a34a",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
            }}
          >
            {message}
          </span>
        )}
      </div>
    </main>
  );
}