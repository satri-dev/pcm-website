"use client";

import { useState, type ReactNode } from "react";
import { Save, Link2, Plus, Trash2, GripVertical } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import {
  SCHOLARSHIP_PAGE_SETTINGS_DEFAULTS,
  type ScholarshipPageSettings,
  type ScholarshipStepData,
  type ScholarshipFaqData,
} from "@/types/scholarship-page-settings";

const API_BASE = "/api/admin/pages/scholarship-settings";

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

export default function ScholarshipPageSettings({
  initial,
}: {
  initial: ScholarshipPageSettings;
}) {
  const [form, setForm] = useState<ScholarshipPageSettings>({
    ...SCHOLARSHIP_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof ScholarshipPageSettings>(
    key: K,
    value: ScholarshipPageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  /* ── Steps helpers ── */
  const updateStep = (idx: number, text: string) => {
    set("applySteps", form.applySteps.map((s, i) => (i === idx ? { ...s, text } : s)));
  };
  const addStep = () => {
    set("applySteps", [...form.applySteps, { id: uid(), text: "" }]);
  };
  const removeStep = (idx: number) => {
    set("applySteps", form.applySteps.filter((_, i) => i !== idx));
  };

  /* ── FAQs helpers ── */
  const updateFaq = (idx: number, patch: Partial<ScholarshipFaqData>) => {
    set("faqs", form.faqs.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  };
  const addFaq = () => {
    set("faqs", [...form.faqs, { id: uid(), question: "", answer: "" }]);
  };
  const removeFaq = (idx: number) => {
    set("faqs", form.faqs.filter((_, i) => i !== idx));
  };

  /* ── Move helpers ── */
  const moveArr = <T,>(arr: T[], idx: number, dir: -1 | 1): T[] => {
    const t = idx + dir;
    if (t < 0 || t >= arr.length) return arr;
    const next = [...arr];
    [next[idx], next[t]] = [next[t], next[idx]];
    return next;
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
      setMessage("Saved. The public /scholarship page now reflects these changes.");
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
            Scholarship Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit the sections of the public /scholarship page — hero, section
            headings, how to apply, FAQs and CTA band. Individual scholarship
            schemes are managed from the Scholarships content manager.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/scholarship"
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

      {/* ── Ways we support you ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Ways We Support You</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.supportEyebrow}
                onChange={(e) => set("supportEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.supportTitle}
                onChange={(e) => set("supportTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.supportSubtitle}
              onChange={(e) => set("supportSubtitle", e.target.value)}
            />
          </label>

          <div className="rounded-xl border border-[var(--admin-line)] bg-black/[0.02] p-4">
            <p className="m-0 text-[0.9rem] text-[var(--admin-muted)]">
              The individual scholarship schemes displayed in this section are
              managed in the Scholarships content manager.
            </p>
            <a className="admin-btn mt-3" href="/admin/content/scholarships">
              Manage Scholarship Schemes →
            </a>
          </div>
        </div>
      </div>

      {/* ── How to Apply ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>How to Apply</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.applyEyebrow}
                onChange={(e) => set("applyEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.applyTitle}
                onChange={(e) => set("applyTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.applySubtitle}
              onChange={(e) => set("applySubtitle", e.target.value)}
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Image URL")}
              <input
                className={INPUT}
                value={form.applyImageSrc}
                onChange={(e) => set("applyImageSrc", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Image Alt Text")}
              <input
                className={INPUT}
                value={form.applyImageAlt}
                onChange={(e) => set("applyImageAlt", e.target.value)}
              />
            </label>
          </div>
          <div>
            {fieldLabel("Or upload a new image")}
            <ImageUpload
              onUpload={(r) => {
                set("applyImageSrc", r.secure_url);
                set("applyImageAlt", "Students at PCM campus");
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("CTA Button Label")}
              <input
                className={INPUT}
                value={form.applyCtaLabel}
                onChange={(e) => set("applyCtaLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("CTA Button Link")}
              <input
                className={INPUT}
                value={form.applyCtaHref}
                onChange={(e) => set("applyCtaHref", e.target.value)}
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">
              Application Steps ({form.applySteps.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addStep}
            >
              <Plus size={14} /> Add Step
            </button>
          </div>

          <div className="space-y-2">
            {form.applySteps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <GripVertical
                  size={16}
                  className="text-[var(--admin-muted)] flex-shrink-0"
                />
                <input
                  className={INPUT + " flex-1"}
                  value={step.text}
                  onChange={(e) => updateStep(i, e.target.value)}
                  placeholder="Step description"
                />
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Move up"
                  onClick={() =>
                    set("applySteps", moveArr(form.applySteps, i, -1))
                  }
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Move down"
                  onClick={() =>
                    set("applySteps", moveArr(form.applySteps, i, 1))
                  }
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-icon-btn danger"
                  aria-label="Remove"
                  onClick={() => removeStep(i)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQs ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Scholarship FAQs</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.faqEyebrow}
                onChange={(e) => set("faqEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.faqTitle}
                onChange={(e) => set("faqTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.faqSubtitle}
              onChange={(e) => set("faqSubtitle", e.target.value)}
            />
          </label>

          <div className="mt-4 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">
              FAQs ({form.faqs.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addFaq}
            >
              <Plus size={14} /> Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {form.faqs.map((faq, i) => (
              <div
                key={faq.id}
                className="rounded-xl border border-[var(--admin-line)] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[var(--admin-brand)]">
                    FAQ {i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move up"
                      onClick={() => set("faqs", moveArr(form.faqs, i, -1))}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move down"
                      onClick={() => set("faqs", moveArr(form.faqs, i, 1))}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn danger"
                      aria-label="Remove"
                      onClick={() => removeFaq(i)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <label className="block">
                  {fieldLabel("Question")}
                  <input
                    className={INPUT}
                    value={faq.question}
                    onChange={(e) => updateFaq(i, { question: e.target.value })}
                  />
                </label>
                <label className="block">
                  {fieldLabel("Answer")}
                  <textarea
                    rows={2}
                    className={INPUT}
                    value={faq.answer}
                    onChange={(e) => updateFaq(i, { answer: e.target.value })}
                  />
                </label>
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
              placeholder="/assets/img/about-graduation.jpg"
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
