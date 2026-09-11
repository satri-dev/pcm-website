"use client";

import { useState, type ReactNode } from "react";
import { Save, Link2, Plus, Trash2 } from "lucide-react";
import {
  TERMS_PAGE_SETTINGS_DEFAULTS,
  PRIVACY_PAGE_SETTINGS_DEFAULTS,
  type LegalPageSettings,
  type LegalPageSection,
} from "@/types/legal-page-settings";

const API_BASE = "/api/admin/pages/legal-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

const TEXTAREA =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink) font-mono text-xs leading-relaxed";

function fieldLabel(c: ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-[var(--admin-ink)]">
      {c}
    </span>
  );
}

const emptySection: LegalPageSection = { heading: "", body: "" };

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
    sections: initial.sections?.length ? initial.sections : defaults.sections,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const set = <K extends keyof LegalPageSettings>(
    key: K,
    value: LegalPageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const setSection = (
    idx: number,
    key: keyof LegalPageSection,
    value: string
  ) =>
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === idx ? { ...s, [key]: value } : s
      ),
    }));

  const addSection = () =>
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { ...emptySection }],
    }));

  const confirmDelete = (idx: number) => setDeleteIdx(idx);

  const removeSection = () => {
    if (deleteIdx === null) return;
    const name = form.sections[deleteIdx]?.heading || `Section ${deleteIdx + 1}`;
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== deleteIdx),
    }));
    setDeleteIdx(null);
    setDeleteSuccess(true);
    setTimeout(() => setDeleteSuccess(false), 3000);
  };

  const moveSection = (idx: number, dir: -1 | 1) =>
    setForm((prev) => {
      const arr = [...prev.sections];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return prev;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...prev, sections: arr };
    });

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
      {/* ── Delete Confirmation Dialog ── */}
      {deleteIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setDeleteIdx(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 m-0">Delete Section</h3>
                <p className="text-sm text-gray-500 m-0">
                  Are you sure you want to delete &quot;{form.sections[deleteIdx]?.heading || `Section ${deleteIdx + 1}`}&quot;?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                onClick={() => setDeleteIdx(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                onClick={removeSection}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            {pageName} Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit the sections of the public {viewHref} page.
          </p>
        </div>
        <a
          className="admin-btn"
          href={viewHref}
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

      {/* ── Sections ── */}
      <div className="admin-panel">
        <div className="admin-panel__head flex items-center justify-between">
          <h3>Content Sections</h3>
          <button
            type="button"
            className="admin-btn"
            onClick={addSection}
          >
            <Plus size={14} />
            Add Section
          </button>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          {form.sections.map((sec, idx) => (
            <div
              key={idx}
              className="border border-[var(--admin-line)] rounded-lg p-4 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--admin-muted)]">
                  Section {idx + 1}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="admin-icon-btn"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, -1)}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    disabled={idx === form.sections.length - 1}
                    onClick={() => moveSection(idx, 1)}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => confirmDelete(idx)}
                    title="Remove section"
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      borderColor: "#ef4444",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <label className="block">
                {fieldLabel("Heading")}
                <input
                  type="text"
                  className={INPUT}
                  value={sec.heading}
                  onChange={(e) => setSection(idx, "heading", e.target.value)}
                />
              </label>
              <label className="block">
                {fieldLabel("Body (HTML allowed)")}
                <textarea
                  rows={4}
                  className={TEXTAREA}
                  value={sec.body}
                  onChange={(e) => setSection(idx, "body", e.target.value)}
                />
              </label>
            </div>
          ))}
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
        {deleteSuccess && (
          <span
            className="text-sm font-medium px-3 py-1 rounded-lg"
            style={{
              color: "#16a34a",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
            }}
          >
            Section deleted successfully.
          </span>
        )}
      </div>
    </main>
  );
}
