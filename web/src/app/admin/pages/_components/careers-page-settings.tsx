"use client";

import { useState } from "react";
import { Save, Link2, Plus, Trash2, GripVertical } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import {
  CAREERS_PAGE_SETTINGS_DEFAULTS,
  type CareersPageSettings,
  type CareerJobData,
  type CareerStepData,
  type CareerBenefitData,
} from "@/types/careers-page-settings";

const API_BASE = "/api/admin/pages/careers-settings";

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

const JOB_TYPE_OPTIONS = ["Full-time", "Part-time", "Contract"] as const;
const JOB_ICON_OPTIONS = ["management", "tech", "lab", "admin"] as const;
const BENEFIT_ICON_OPTIONS = ["culture", "growth", "impact"] as const;

export default function CareersPageSettings({
  initial,
}: {
  initial: CareersPageSettings;
}) {
  const [form, setForm] = useState<CareersPageSettings>({
    ...CAREERS_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof CareersPageSettings>(
    key: K,
    value: CareersPageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  /* ── Openings helpers ── */
  const updateJob = (idx: number, patch: Partial<CareerJobData>) => {
    set("openings", form.openings.map((j, i) => (i === idx ? { ...j, ...patch } : j)));
  };
  const addJob = () => {
    set("openings", [
      ...form.openings,
      {
        id: uid(),
        title: "",
        department: "",
        type: "Full-time",
        iconType: "management",
        iconBg: "#eef3ff",
        iconColor: "#21409A",
        description: "",
        requirements: "",
        applyEmail: "careers@pcm.edu.np",
        applySubject: "Application: PCM",
      },
    ]);
  };
  const removeJob = (idx: number) => {
    set("openings", form.openings.filter((_, i) => i !== idx));
  };

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

  /* ── Benefits helpers ── */
  const updateBenefit = (idx: number, patch: Partial<CareerBenefitData>) => {
    set("benefits", form.benefits.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  };
  const addBenefit = () => {
    set("benefits", [
      ...form.benefits,
      {
        id: uid(),
        iconType: "culture",
        iconBg: "#eef3ff",
        iconColor: "#21409A",
        title: "",
        description: "",
      },
    ]);
  };
  const removeBenefit = (idx: number) => {
    set("benefits", form.benefits.filter((_, i) => i !== idx));
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
      setMessage("Saved. The public /career page now reflects these changes.");
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
            Careers Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit every section of the public /career page — current openings,
            how to apply, benefits and CTA band.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/career"
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

      {/* ── Current openings ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Current Openings</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.openingsEyebrow}
                onChange={(e) => set("openingsEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.openingsTitle}
                onChange={(e) => set("openingsTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.openingsSubtitle}
              onChange={(e) => set("openingsSubtitle", e.target.value)}
            />
          </label>

          <div className="mt-4 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">
              Job Openings ({form.openings.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addJob}
            >
              <Plus size={14} /> Add Opening
            </button>
          </div>

          <div className="space-y-4">
            {form.openings.map((job, i) => (
              <div
                key={job.id}
                className="rounded-xl border border-[var(--admin-line)] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      size={16}
                      className="text-[var(--admin-muted)]"
                    />
                    <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[var(--admin-brand)]">
                      {job.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move up"
                      onClick={() => set("openings", moveArr(form.openings, i, -1))}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move down"
                      onClick={() => set("openings", moveArr(form.openings, i, 1))}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn danger"
                      aria-label="Remove"
                      onClick={() => removeJob(i)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    {fieldLabel("Job Title")}
                    <input
                      className={INPUT}
                      value={job.title}
                      onChange={(e) => updateJob(i, { title: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Department")}
                    <input
                      className={INPUT}
                      value={job.department}
                      onChange={(e) =>
                        updateJob(i, { department: e.target.value })
                      }
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    {fieldLabel("Type")}
                    <select
                      className={INPUT}
                      value={job.type}
                      onChange={(e) =>
                        updateJob(i, {
                          type: e.target.value as (typeof JOB_TYPE_OPTIONS)[number],
                        })
                      }
                    >
                      {JOB_TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Type")}
                    <select
                      className={INPUT}
                      value={job.iconType}
                      onChange={(e) =>
                        updateJob(i, {
                          iconType: e.target.value as (typeof JOB_ICON_OPTIONS)[number],
                        })
                      }
                    >
                      {JOB_ICON_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    {fieldLabel("Icon Background Color")}
                    <input
                      type="color"
                      className={INPUT + " h-10"}
                      value={job.iconBg}
                      onChange={(e) => updateJob(i, { iconBg: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Color")}
                    <input
                      type="color"
                      className={INPUT + " h-10"}
                      value={job.iconColor}
                      onChange={(e) =>
                        updateJob(i, { iconColor: e.target.value })
                      }
                    />
                  </label>
                </div>

                <label className="block">
                  {fieldLabel("Description")}
                  <textarea
                    rows={2}
                    className={INPUT}
                    value={job.description}
                    onChange={(e) =>
                      updateJob(i, { description: e.target.value })
                    }
                  />
                </label>
                <label className="block">
                  {fieldLabel("Requirements")}
                  <textarea
                    rows={2}
                    className={INPUT}
                    value={job.requirements}
                    onChange={(e) =>
                      updateJob(i, { requirements: e.target.value })
                    }
                  />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    {fieldLabel("Apply Email")}
                    <input
                      className={INPUT}
                      value={job.applyEmail}
                      onChange={(e) =>
                        updateJob(i, { applyEmail: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Apply Subject")}
                    <input
                      className={INPUT}
                      value={job.applySubject}
                      onChange={(e) =>
                        updateJob(i, { applySubject: e.target.value })
                      }
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How to apply ── */}
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
            {fieldLabel("Paragraph")}
            <textarea
              rows={3}
              className={INPUT}
              value={form.applyParagraph}
              onChange={(e) => set("applyParagraph", e.target.value)}
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
                set("applyImageAlt", "PCM campus and classrooms");
              }}
            />
          </div>

          <label className="block">
            {fieldLabel("Process Pills — one per line")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.applyPills.join("\n")}
              onChange={(e) =>
                set(
                  "applyPills",
                  e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
                )
              }
            />
          </label>

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
                  onClick={() => set("applySteps", moveArr(form.applySteps, i, -1))}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Move down"
                  onClick={() => set("applySteps", moveArr(form.applySteps, i, 1))}
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

      {/* ── Why work at PCM ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Why Work at PCM — Benefits</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.benefitsEyebrow}
                onChange={(e) => set("benefitsEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.benefitsTitle}
                onChange={(e) => set("benefitsTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.benefitsSubtitle}
              onChange={(e) => set("benefitsSubtitle", e.target.value)}
            />
          </label>

          <div className="mt-4 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">
              Benefits ({form.benefits.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addBenefit}
            >
              <Plus size={14} /> Add Benefit
            </button>
          </div>

          <div className="space-y-4">
            {form.benefits.map((benefit, i) => (
              <div
                key={benefit.id}
                className="rounded-xl border border-[var(--admin-line)] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      size={16}
                      className="text-[var(--admin-muted)]"
                    />
                    <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[var(--admin-brand)]">
                      {benefit.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move up"
                      onClick={() =>
                        set("benefits", moveArr(form.benefits, i, -1))
                      }
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move down"
                      onClick={() =>
                        set("benefits", moveArr(form.benefits, i, 1))
                      }
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn danger"
                      aria-label="Remove"
                      onClick={() => removeBenefit(i)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    {fieldLabel("Title")}
                    <input
                      className={INPUT}
                      value={benefit.title}
                      onChange={(e) =>
                        updateBenefit(i, { title: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Type")}
                    <select
                      className={INPUT}
                      value={benefit.iconType}
                      onChange={(e) =>
                        updateBenefit(i, {
                          iconType: e.target.value as (typeof BENEFIT_ICON_OPTIONS)[number],
                        })
                      }
                    >
                      {BENEFIT_ICON_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    {fieldLabel("Icon Background Color")}
                    <input
                      type="color"
                      className={INPUT + " h-10"}
                      value={benefit.iconBg}
                      onChange={(e) =>
                        updateBenefit(i, { iconBg: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Color")}
                    <input
                      type="color"
                      className={INPUT + " h-10"}
                      value={benefit.iconColor}
                      onChange={(e) =>
                        updateBenefit(i, { iconColor: e.target.value })
                      }
                    />
                  </label>
                </div>

                <label className="block">
                  {fieldLabel("Description")}
                  <textarea
                    rows={2}
                    className={INPUT}
                    value={benefit.description}
                    onChange={(e) =>
                      updateBenefit(i, { description: e.target.value })
                    }
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
              {fieldLabel("Email Address")}
              <input
                className={INPUT}
                value={form.ctaEmailAddress}
                onChange={(e) => set("ctaEmailAddress", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Email Subject")}
              <input
                className={INPUT}
                value={form.ctaEmailSubject}
                onChange={(e) => set("ctaEmailSubject", e.target.value)}
              />
            </label>
          </div>
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
              {fieldLabel("Secondary Button Label")}
              <input
                className={INPUT}
                value={form.ctaSecondaryLabel}
                onChange={(e) => set("ctaSecondaryLabel", e.target.value)}
              />
            </label>
          </div>
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
              placeholder="/assets/img/hero-3.jpg"
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
