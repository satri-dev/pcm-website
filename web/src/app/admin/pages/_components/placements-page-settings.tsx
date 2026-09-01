"use client";

import { useState } from "react";
import { Save, Link2, Plus, Trash2, GripVertical } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import {
  PLACEMENTS_PAGE_SETTINGS_DEFAULTS,
  type PlacementsPageSettings,
  type PlacementPartnerData,
  type PlacementServiceData,
  type PlacementStatData,
} from "@/types/placements-page-settings";

const API_BASE = "/api/admin/pages/placements-settings";

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

export default function PlacementsPageSettings({
  initial,
}: {
  initial: PlacementsPageSettings;
}) {
  const [form, setForm] = useState<PlacementsPageSettings>({
    ...PLACEMENTS_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof PlacementsPageSettings>(
    key: K,
    value: PlacementsPageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  /* ── Partners helpers ── */
  const updatePartner = (
    idx: number,
    patch: Partial<PlacementPartnerData>
  ) => {
    set("partners", form.partners.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };
  const addPartner = () => {
    set("partners", [
      ...form.partners,
      {
        id: uid(),
        sector: "",
        iconType: "bank",
        iconBg: "#eaf9ee",
        iconColor: "#3F9E35",
        companies: "",
        description: "",
      },
    ]);
  };
  const removePartner = (idx: number) => {
    set("partners", form.partners.filter((_, i) => i !== idx));
  };

  /* ── Services helpers ── */
  const updateService = (idx: number, text: string) => {
    set("services", form.services.map((s, i) => (i === idx ? { ...s, text } : s)));
  };
  const addService = () => {
    set("services", [...form.services, { id: uid(), text: "" }]);
  };
  const removeService = (idx: number) => {
    set("services", form.services.filter((_, i) => i !== idx));
  };

  /* ── Stats helpers ── */
  const updateStat = (idx: number, patch: Partial<PlacementStatData>) => {
    set("stats", form.stats.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };
  const addStat = () => {
    set("stats", [...form.stats, { id: uid(), value: "", label: "" }]);
  };
  const removeStat = (idx: number) => {
    set("stats", form.stats.filter((_, i) => i !== idx));
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
      setMessage("Saved. The public /placements page now reflects these changes.");
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
            Placements Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit every section of the public /placements page — hero, stats,
            partners, career guidance and CTA band.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/placements"
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
              placeholder="/assets/img/about-graduation.jpg"
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

      {/* ── Classroom to Career ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>From Classroom to Career</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.classEyebrow}
                onChange={(e) => set("classEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.classTitle}
                onChange={(e) => set("classTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Paragraphs — one per line")}
            <textarea
              rows={4}
              className={INPUT}
              value={form.classParagraphs.join("\n")}
              onChange={(e) =>
                set(
                  "classParagraphs",
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
              value={form.classPills.join("\n")}
              onChange={(e) =>
                set(
                  "classPills",
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
                value={form.classImageSrc}
                onChange={(e) => set("classImageSrc", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Image Alt Text")}
              <input
                className={INPUT}
                value={form.classImageAlt}
                onChange={(e) => set("classImageAlt", e.target.value)}
              />
            </label>
          </div>
          <div>
            {fieldLabel("Or upload a new image")}
            <ImageUpload
              onUpload={(r) => {
                set("classImageSrc", r.secure_url);
                set("classImageAlt", "PCM graduation ceremony");
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Industry Connect / Partners ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Industry Connect — Recruitment Partners</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.partnersEyebrow}
                onChange={(e) => set("partnersEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.partnersTitle}
                onChange={(e) => set("partnersTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.partnersSubtitle}
              onChange={(e) => set("partnersSubtitle", e.target.value)}
            />
          </label>

          <div className="mt-4 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">
              Partner Sectors ({form.partners.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addPartner}
            >
              <Plus size={14} /> Add Partner
            </button>
          </div>

          <div className="space-y-4">
            {form.partners.map((partner, i) => (
              <div
                key={partner.id}
                className="rounded-xl border border-[var(--admin-line)] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      size={16}
                      className="text-[var(--admin-muted)]"
                    />
                    <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[var(--admin-brand)]">
                      {partner.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move up"
                      onClick={() =>
                        set(
                          "partners",
                          moveArr(form.partners, i, -1)
                        )
                      }
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move down"
                      onClick={() =>
                        set(
                          "partners",
                          moveArr(form.partners, i, 1)
                        )
                      }
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn danger"
                      aria-label="Remove"
                      onClick={() => removePartner(i)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    {fieldLabel("Sector Name")}
                    <input
                      className={INPUT}
                      value={partner.sector}
                      onChange={(e) =>
                        updatePartner(i, { sector: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Type")}
                    <select
                      className={INPUT}
                      value={partner.iconType}
                      onChange={(e) =>
                        updatePartner(i, {
                          iconType: e.target.value as
                            | "bank"
                            | "tech"
                            | "corporate",
                        })
                      }
                    >
                      <option value="bank">Bank</option>
                      <option value="tech">Technology</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    {fieldLabel("Icon Background Color")}
                    <input
                      type="color"
                      className={INPUT + " h-10"}
                      value={partner.iconBg}
                      onChange={(e) =>
                        updatePartner(i, { iconBg: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Color")}
                    <input
                      type="color"
                      className={INPUT + " h-10"}
                      value={partner.iconColor}
                      onChange={(e) =>
                        updatePartner(i, { iconColor: e.target.value })
                      }
                    />
                  </label>
                </div>

                <label className="block">
                  {fieldLabel("Companies")}
                  <textarea
                    rows={2}
                    className={INPUT}
                    value={partner.companies}
                    onChange={(e) =>
                      updatePartner(i, { companies: e.target.value })
                    }
                  />
                </label>
                <label className="block">
                  {fieldLabel("Description")}
                  <textarea
                    rows={2}
                    className={INPUT}
                    value={partner.description}
                    onChange={(e) =>
                      updatePartner(i, { description: e.target.value })
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Career Guidance ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Career Guidance</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.guidanceEyebrow}
                onChange={(e) => set("guidanceEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.guidanceTitle}
                onChange={(e) => set("guidanceTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Paragraph")}
            <textarea
              rows={3}
              className={INPUT}
              value={form.guidanceParagraph}
              onChange={(e) => set("guidanceParagraph", e.target.value)}
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Image URL")}
              <input
                className={INPUT}
                value={form.guidanceImageSrc}
                onChange={(e) => set("guidanceImageSrc", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Image Alt Text")}
              <input
                className={INPUT}
                value={form.guidanceImageAlt}
                onChange={(e) => set("guidanceImageAlt", e.target.value)}
              />
            </label>
          </div>
          <div>
            {fieldLabel("Or upload a new image")}
            <ImageUpload
              onUpload={(r) => {
                set("guidanceImageSrc", r.secure_url);
                set("guidanceImageAlt", "Career guidance session at PCM");
              }}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">
              Services ({form.services.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addService}
            >
              <Plus size={14} /> Add Service
            </button>
          </div>

          <div className="space-y-2">
            {form.services.map((svc, i) => (
              <div key={svc.id} className="flex items-center gap-2">
                <GripVertical
                  size={16}
                  className="text-[var(--admin-muted)] flex-shrink-0"
                />
                <input
                  className={INPUT + " flex-1"}
                  value={svc.text}
                  onChange={(e) => updateService(i, e.target.value)}
                  placeholder="Service description"
                />
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Move up"
                  onClick={() =>
                    set("services", moveArr(form.services, i, -1))
                  }
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Move down"
                  onClick={() =>
                    set("services", moveArr(form.services, i, 1))
                  }
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-icon-btn danger"
                  aria-label="Remove"
                  onClick={() => removeService(i)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Stats Bar</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">
              Stats ({form.stats.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addStat}
            >
              <Plus size={14} /> Add Stat
            </button>
          </div>

          <div className="space-y-2">
            {form.stats.map((stat, i) => (
              <div key={stat.id} className="flex items-center gap-2">
                <GripVertical
                  size={16}
                  className="text-[var(--admin-muted)] flex-shrink-0"
                />
                <input
                  className={INPUT + " w-28"}
                  value={stat.value}
                  onChange={(e) => updateStat(i, { value: e.target.value })}
                  placeholder="90%"
                />
                <input
                  className={INPUT + " flex-1"}
                  value={stat.label}
                  onChange={(e) => updateStat(i, { label: e.target.value })}
                  placeholder="Label"
                />
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Move up"
                  onClick={() =>
                    set("stats", moveArr(form.stats, i, -1))
                  }
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  aria-label="Move down"
                  onClick={() =>
                    set("stats", moveArr(form.stats, i, 1))
                  }
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-icon-btn danger"
                  aria-label="Remove"
                  onClick={() => removeStat(i)}
                >
                  <Trash2 size={14} />
                </button>
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
