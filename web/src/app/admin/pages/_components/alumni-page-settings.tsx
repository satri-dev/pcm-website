"use client";

import { useState, type ReactNode } from "react";
import { Save, Link2, Plus, Trash2, GripVertical } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import {
  ALUMNI_PAGE_SETTINGS_DEFAULTS,
  type AlumniPageSettings,
  type AlumniPathData,
} from "@/types/alumni-page-settings";

const API_BASE = "/api/admin/pages/alumni-settings";

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

export default function AlumniPageSettings({
  initial,
}: {
  initial: AlumniPageSettings;
}) {
  const [form, setForm] = useState<AlumniPageSettings>({
    ...ALUMNI_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof AlumniPageSettings>(
    key: K,
    value: AlumniPageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  /* ── Career paths helpers ── */
  const updatePath = (idx: number, patch: Partial<AlumniPathData>) => {
    set(
      "careerPaths",
      form.careerPaths.map((p, i) => (i === idx ? { ...p, ...patch } : p))
    );
  };
  const addPath = () => {
    set("careerPaths", [
      ...form.careerPaths,
      {
        id: uid(),
        iconType: "bank",
        iconBg: "#eef3ff",
        iconColor: "#21409A",
        title: "",
        description: "",
      },
    ]);
  };
  const removePath = (idx: number) => {
    set("careerPaths", form.careerPaths.filter((_, i) => i !== idx));
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
      setMessage("Saved. The public /alumni page now reflects these changes.");
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
            Alumni Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit the sections of the public /alumni page — hero, alumni family
            intro, spotlight headings, career paths and CTA band. Individual
            alumni records are managed from the Alumni content manager.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/alumni"
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
              placeholder="/images/about-graduation.jpg"
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

      {/* ── Alumni Family (split intro) ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Alumni Family — Split Intro</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.familyEyebrow}
                onChange={(e) => set("familyEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.familyTitle}
                onChange={(e) => set("familyTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Paragraphs — one per line")}
            <textarea
              rows={4}
              className={INPUT}
              value={form.familyParagraphs.join("\n")}
              onChange={(e) =>
                set(
                  "familyParagraphs",
                  e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
                )
              }
            />
          </label>
          <label className="block">
            {fieldLabel("Pills / Badges — one per line")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.familyPills.join("\n")}
              onChange={(e) =>
                set(
                  "familyPills",
                  e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean)
                )
              }
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Badge Value")}
              <input
                className={INPUT}
                value={form.badgeValue}
                onChange={(e) => set("badgeValue", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Badge Label")}
              <input
                className={INPUT}
                value={form.badgeLabel}
                onChange={(e) => set("badgeLabel", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Image URL")}
              <input
                className={INPUT}
                value={form.familyImageSrc}
                onChange={(e) => set("familyImageSrc", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Image Alt Text")}
              <input
                className={INPUT}
                value={form.familyImageAlt}
                onChange={(e) => set("familyImageAlt", e.target.value)}
              />
            </label>
          </div>
          <div>
            {fieldLabel("Or upload a new image")}
            <ImageUpload
              onUpload={(r) => {
                set("familyImageSrc", r.secure_url);
                set("familyImageAlt", "PCM graduates in caps and gowns");
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Alumni Spotlight ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Alumni Spotlight — Meet Our Graduates</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.spotlightEyebrow}
                onChange={(e) => set("spotlightEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.spotlightTitle}
                onChange={(e) => set("spotlightTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.spotlightSubtitle}
              onChange={(e) => set("spotlightSubtitle", e.target.value)}
            />
          </label>

          <div className="rounded-xl border border-[var(--admin-line)] bg-black/[0.02] p-4">
            <p className="m-0 text-[0.9rem] text-[var(--admin-muted)]">
              The alumni cards displayed in this section come from the Alumni
              content manager.
            </p>
            <a className="admin-btn mt-3" href="/admin/people/alumni">
              Manage Alumni →
            </a>
          </div>
        </div>
      </div>

      {/* ── Career Paths ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Alumni in the World — Career Paths</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.pathsEyebrow}
                onChange={(e) => set("pathsEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.pathsTitle}
                onChange={(e) => set("pathsTitle", e.target.value)}
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">
              Career Paths ({form.careerPaths.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addPath}
            >
              <Plus size={14} /> Add Path
            </button>
          </div>

          <div className="space-y-4">
            {form.careerPaths.map((path, i) => (
              <div
                key={path.id}
                className="rounded-xl border border-[var(--admin-line)] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      size={16}
                      className="text-[var(--admin-muted)]"
                    />
                    <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[var(--admin-brand)]">
                      {path.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move up"
                      onClick={() =>
                        set("careerPaths", moveArr(form.careerPaths, i, -1))
                      }
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move down"
                      onClick={() =>
                        set("careerPaths", moveArr(form.careerPaths, i, 1))
                      }
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn danger"
                      aria-label="Remove"
                      onClick={() => removePath(i)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="block">
                    {fieldLabel("Title")}
                    <input
                      className={INPUT}
                      value={path.title}
                      onChange={(e) => updatePath(i, { title: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Type")}
                    <select
                      className={INPUT}
                      value={path.iconType}
                      onChange={(e) =>
                        updatePath(i, {
                          iconType: e.target.value as AlumniPathData["iconType"],
                        })
                      }
                    >
                      <option value="bank">Banking</option>
                      <option value="tech">Technology</option>
                      <option value="entrepreneurship">Entrepreneurship</option>
                      <option value="education">Education</option>
                    </select>
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Background Color")}
                    <input
                      type="color"
                      className={INPUT + " h-10"}
                      value={path.iconBg}
                      onChange={(e) =>
                        updatePath(i, { iconBg: e.target.value })
                      }
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    {fieldLabel("Icon Color")}
                    <input
                      type="color"
                      className={INPUT + " h-10"}
                      value={path.iconColor}
                      onChange={(e) =>
                        updatePath(i, { iconColor: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Description")}
                    <textarea
                      rows={2}
                      className={INPUT}
                      value={path.description}
                      onChange={(e) =>
                        updatePath(i, { description: e.target.value })
                      }
                    />
                  </label>
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