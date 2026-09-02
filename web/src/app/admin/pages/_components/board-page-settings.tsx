"use client";

import { useState, type ReactNode } from "react";
import { Save, Link2, Plus, Trash2 } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import {
  BOARD_PAGE_SETTINGS_DEFAULTS,
  type BoardPageSettings,
} from "@/types/board-page-settings";

const API_BASE = "/api/admin/pages/board-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-[var(--admin-ink)]">
      {c}
    </span>
  );
}

export default function BoardPageSettings({
  initial,
}: {
  initial: BoardPageSettings;
}) {
  const [form, setForm] = useState<BoardPageSettings>({
    ...BOARD_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof BoardPageSettings>(
    key: K,
    value: BoardPageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const addParagraph = (key: "promiseParagraphs") => {
    set(key, [...form[key], ""]);
  };
  const addChecklist = () => {
    set("promiseChecklist", [...form.promiseChecklist, ""]);
  };

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
        "Saved. The public /about/board page now reflects these changes."
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
            Board of Directors Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit the sections of the public /about/board page — hero, section
            head, our promise and CTA band. Board member cards come from the
            Board of Directors content manager.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/about/board"
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

      {/* ── Section head ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Section Head — Board</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <label className="block">
            {fieldLabel("Eyebrow")}
            <input
              className={INPUT}
              value={form.headEyebrow}
              onChange={(e) => set("headEyebrow", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Title")}
            <input
              className={INPUT}
              value={form.headTitle}
              onChange={(e) => set("headTitle", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.headSubtitle}
              onChange={(e) => set("headSubtitle", e.target.value)}
            />
          </label>

          <div className="rounded-xl border border-[var(--admin-line)] bg-black/[0.02] p-4">
            <p className="m-0 text-[0.9rem] text-[var(--admin-muted)]">
              The board member cards displayed here come from the Board of
              Directors content manager, ordered by their configured priority.
            </p>
            <a className="admin-btn mt-3" href="/admin/people/bod">
              Manage Board of Directors →
            </a>
          </div>
        </div>
      </div>

      {/* ── Our promise ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Our Promise — Split</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.promiseEyebrow}
                onChange={(e) => set("promiseEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.promiseTitle}
                onChange={(e) => set("promiseTitle", e.target.value)}
              />
            </label>
          </div>

          <div>
            {fieldLabel("Paragraphs")}
            <div className="space-y-2">
              {form.promiseParagraphs.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    rows={2}
                    className={INPUT}
                    value={p}
                    onChange={(e) =>
                      set(
                        "promiseParagraphs",
                        form.promiseParagraphs.map((x, idx) =>
                          idx === i ? e.target.value : x
                        )
                      )
                    }
                  />
                  <button
                    type="button"
                    className="admin-icon-btn danger shrink-0 self-start"
                    aria-label="Remove paragraph"
                    onClick={() =>
                      set(
                        "promiseParagraphs",
                        form.promiseParagraphs.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--sm mt-2"
              onClick={() => addParagraph("promiseParagraphs")}
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>

          <div>
            {fieldLabel("Checklist Items")}
            <div className="space-y-2">
              {form.promiseChecklist.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={INPUT}
                    value={c}
                    onChange={(e) =>
                      set(
                        "promiseChecklist",
                        form.promiseChecklist.map((x, idx) =>
                          idx === i ? e.target.value : x
                        )
                      )
                    }
                  />
                  <button
                    type="button"
                    className="admin-icon-btn danger shrink-0 self-start"
                    aria-label="Remove checklist item"
                    onClick={() =>
                      set(
                        "promiseChecklist",
                        form.promiseChecklist.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--sm mt-2"
              onClick={addChecklist}
            >
              <Plus size={14} /> Add Checklist Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Image URL")}
              <input
                className={INPUT}
                value={form.promiseImageSrc}
                onChange={(e) => set("promiseImageSrc", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Image Alt Text")}
              <input
                className={INPUT}
                value={form.promiseImageAlt}
                onChange={(e) => set("promiseImageAlt", e.target.value)}
              />
            </label>
          </div>
          <div>
            {fieldLabel("Or upload a new image")}
            <ImageUpload
              onUpload={(r) => {
                set("promiseImageSrc", r.secure_url);
                set("promiseImageAlt", "The PCM campus in Nadipur");
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Badge Value")}
              <input
                className={INPUT}
                value={form.promiseBadgeValue}
                onChange={(e) => set("promiseBadgeValue", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Badge Label")}
              <input
                className={INPUT}
                value={form.promiseBadgeLabel}
                onChange={(e) => set("promiseBadgeLabel", e.target.value)}
              />
            </label>
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
