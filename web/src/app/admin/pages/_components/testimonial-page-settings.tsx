"use client";

import { useState } from "react";
import { Save, Link2 } from "lucide-react";
import {
  TESTIMONIAL_PAGE_SETTINGS_DEFAULTS,
  type TestimonialFormCopy,
  type TestimonialPageSettings,
} from "@/types/testimonial-page-settings";

const API_BASE = "/api/admin/pages/testimonials-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: React.ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-[var(--admin-ink)]">
      {c}
    </span>
  );
}

const toggle =
  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:ring-offset-2";

export default function TestimonialPageSettings({
  initial,
}: {
  initial: TestimonialPageSettings;
}) {
  const [form, setForm] = useState<TestimonialPageSettings>({
    ...TESTIMONIAL_PAGE_SETTINGS_DEFAULTS,
    form: {
      ...TESTIMONIAL_PAGE_SETTINGS_DEFAULTS.form,
      ...(initial.form ?? {}),
    },
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof TestimonialPageSettings>(
    key: K,
    value: TestimonialPageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const setFormKey = <K extends keyof TestimonialFormCopy>(
    key: K,
    value: TestimonialFormCopy[K]
  ) => setForm((prev) => ({ ...prev, form: { ...prev.form, [key]: value } }));

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
      setMessage("Saved. The public /testimonials page now reflects these changes.");
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
            Testimonials Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit every part of the public /testimonials page — hero, section
            head, add-button toggle &amp; copy, testimonial form labels and CTA
            band. Approve, reject or delete submissions under Content ·
            Testimonials.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/testimonials"
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
            />
          </label>
          <label className="block">
            {fieldLabel("Canonical URL")}
            <input
              className={INPUT}
              value={form.canonical}
              onChange={(e) => set("canonical", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center justify-between gap-3 rounded-lg border border-(--admin-line) p-3">
              <span className="text-[0.9rem] text-[var(--admin-ink)]">
                Allow indexing (robots)
              </span>
              <span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.robotsIndex}
                  onClick={() => set("robotsIndex", !form.robotsIndex)}
                  className={
                    toggle +
                    (form.robotsIndex
                      ? " bg-(--admin-green)"
                      : " bg-(--admin-line)")
                  }
                >
                  <span
                    className={
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform " +
                      (form.robotsIndex ? "translate-x-5" : "translate-x-1")
                    }
                  />
                </button>
              </span>
            </label>
            <label className="flex items-center justify-between gap-3 rounded-lg border border-(--admin-line) p-3">
              <span className="text-[0.9rem] text-[var(--admin-ink)]">
                Allow follow links (robots)
              </span>
              <span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.robotsFollow}
                  onClick={() => set("robotsFollow", !form.robotsFollow)}
                  className={
                    toggle +
                    (form.robotsFollow
                      ? " bg-(--admin-green)"
                      : " bg-(--admin-line)")
                  }
                >
                  <span
                    className={
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform " +
                      (form.robotsFollow ? "translate-x-5" : "translate-x-1")
                    }
                  />
                </button>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ── Feature toggle ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Submission Availability</h3>
        </div>
        <div className="admin-panel__body p-6">
          <label className="flex items-center justify-between gap-3 rounded-lg border border-(--admin-line) p-4">
            <div>
              <div className="text-[0.95rem] font-medium text-[var(--admin-ink)]">
                Enable &quot;Add Testimonial&quot;
              </div>
              <p className="m-0 mt-1 text-[0.85rem] text-[var(--admin-muted)]">
                When off, the &quot;Add Testimonial&quot; button is hidden on
                the public page and no new submissions can be made.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.addEnabled}
              onClick={() => set("addEnabled", !form.addEnabled)}
              className={
                toggle +
                (form.addEnabled ? " bg-(--admin-green)" : " bg-(--admin-line)")
              }
            >
              <span
                className={
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform " +
                  (form.addEnabled ? "translate-x-5" : "translate-x-1")
                }
              />
            </button>
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
            {fieldLabel("Hero Eyebrow (breadcrumb label)")}
            <input
              className={INPUT}
              value={form.heroEyebrow}
              onChange={(e) => set("heroEyebrow", e.target.value)}
            />
          </label>
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
          <h3>Section Head (above the cards)</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.headSubtitle}
              onChange={(e) => set("headSubtitle", e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* ── Add button + empty state ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Add Button & Empty State</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <label className="block">
            {fieldLabel("Add Testimonial Button Label")}
            <input
              className={INPUT}
              value={form.addButtonLabel}
              onChange={(e) => set("addButtonLabel", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Empty State Text (no testimonials yet)")}
            <input
              className={INPUT}
              value={form.emptyText}
              onChange={(e) => set("emptyText", e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* ── Add form copy ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Add Testimonial Form Copy</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Modal Title")}
              <input
                className={INPUT}
                value={form.form.modalTitle}
                onChange={(e) => setFormKey("modalTitle", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Modal Description")}
              <textarea
                rows={2}
                className={INPUT}
                value={form.form.modalDescription}
                onChange={(e) => setFormKey("modalDescription", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              {fieldLabel("Name Label")}
              <input
                className={INPUT}
                value={form.form.nameLabel}
                onChange={(e) => setFormKey("nameLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Program Label")}
              <input
                className={INPUT}
                value={form.form.programLabel}
                onChange={(e) => setFormKey("programLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Batch Label")}
              <input
                className={INPUT}
                value={form.form.batchLabel}
                onChange={(e) => setFormKey("batchLabel", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Position Label")}
              <input
                className={INPUT}
                value={form.form.positionLabel}
                onChange={(e) => setFormKey("positionLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Photo Label")}
              <input
                className={INPUT}
                value={form.form.photoLabel}
                onChange={(e) => setFormKey("photoLabel", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Content Label")}
            <input
              className={INPUT}
              value={form.form.contentLabel}
              onChange={(e) => setFormKey("contentLabel", e.target.value)}
            />
          </label>
          <label className="block">
            {fieldLabel("Submit Button Label")}
            <input
              className={INPUT}
              value={form.form.submitLabel}
              onChange={(e) => setFormKey("submitLabel", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Submitting Label")}
              <input
                className={INPUT}
                value={form.form.submittingLabel}
                onChange={(e) => setFormKey("submittingLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Cancel Label")}
              <input
                className={INPUT}
                value={form.form.cancelLabel}
                onChange={(e) => setFormKey("cancelLabel", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Upload Image Label")}
              <input
                className={INPUT}
                value={form.form.uploadLabel}
                onChange={(e) => setFormKey("uploadLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Remove Photo Label")}
              <input
                className={INPUT}
                value={form.form.removePhotoLabel}
                onChange={(e) => setFormKey("removePhotoLabel", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("No Photo Selected Text")}
            <input
              className={INPUT}
              value={form.form.noPhotoText}
              onChange={(e) => setFormKey("noPhotoText", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Required Name Error")}
              <input
                className={INPUT}
                value={form.form.requiredName}
                onChange={(e) => setFormKey("requiredName", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Required Content Error")}
              <input
                className={INPUT}
                value={form.form.requiredContent}
                onChange={(e) => setFormKey("requiredContent", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Submit Error")}
            <input
              className={INPUT}
              value={form.form.submitError}
              onChange={(e) => setFormKey("submitError", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Success Title")}
              <input
                className={INPUT}
                value={form.form.successTitle}
                onChange={(e) => setFormKey("successTitle", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Success Done Label")}
              <input
                className={INPUT}
                value={form.form.successDone}
                onChange={(e) => setFormKey("successDone", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Success Text")}
            <textarea
              rows={3}
              className={INPUT}
              value={form.form.successText}
              onChange={(e) => setFormKey("successText", e.target.value)}
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
