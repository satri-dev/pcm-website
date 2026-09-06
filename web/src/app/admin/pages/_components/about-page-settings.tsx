"use client";

import { useState, type ReactNode } from "react";
import { Save, Link2, Plus, Trash2 } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import {
  ABOUT_PAGE_SETTINGS_DEFAULTS,
  type AboutPageSettings,
  type VmvCard,
  type DiffItem,
  type AboutStat,
} from "@/types/about-page-settings";
import Link from "next/link";

const API_BASE = "/api/admin/pages/about-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-(--admin-ink)">
      {c}
    </span>
  );
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AboutPageSettings({
  initial,
}: {
  initial: AboutPageSettings;
}) {
  const [form, setForm] = useState<AboutPageSettings>({
    ...ABOUT_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof AboutPageSettings>(
    key: K,
    value: AboutPageSettings[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const moveArr = <T,>(arr: T[], idx: number, dir: -1 | 1): T[] => {
    const t = idx + dir;
    if (t < 0 || t >= arr.length) return arr;
    const next = [...arr];
    [next[idx], next[t]] = [next[t], next[idx]];
    return next;
  };

  /* ── Vmv helpers ── */
  const updateVmv = (idx: number, patch: Partial<VmvCard>) => {
    set(
      "vmvCards",
      form.vmvCards.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
    );
  };
  const addVmv = () => {
    set("vmvCards", [
      ...form.vmvCards,
      {
        id: uid(),
        iconType: "vision",
        iconBg: "#eef3ff",
        iconColor: "#21409A",
        title: "",
        description: "",
      },
    ]);
  };
  const removeVmv = (idx: number) =>
    set(
      "vmvCards",
      form.vmvCards.filter((_, i) => i !== idx),
    );

  /* ── Diff helpers ── */
  const updateDiff = (idx: number, patch: Partial<DiffItem>) => {
    set(
      "diffItems",
      form.diffItems.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
    );
  };
  const addDiff = () => {
    set("diffItems", [
      ...form.diffItems,
      {
        id: uid(),
        iconType: "faculty",
        iconBg: "#eef3ff",
        iconColor: "#21409A",
        title: "",
        description: "",
      },
    ]);
  };
  const removeDiff = (idx: number) =>
    set(
      "diffItems",
      form.diffItems.filter((_, i) => i !== idx),
    );

  /* ── Stats helpers ── */
  const updateStat = (idx: number, patch: Partial<AboutStat>) => {
    set(
      "stats",
      form.stats.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
    );
  };
  const addStat = () => {
    set("stats", [...form.stats, { id: uid(), value: "", label: "" }]);
  };
  const removeStat = (idx: number) =>
    set(
      "stats",
      form.stats.filter((_, i) => i !== idx),
    );

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
      setMessage("Saved. The public /about page now reflects these changes.");
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
          <h2 className="m-0 text-2xl font-bold text-(--admin-ink)">
            About Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-(--admin-muted)">
            Edit the sections of the public /about page — hero, who we are, why
            study at PCM, vision/mission/values, the PCM difference, by the
            numbers, voices headings and CTA band. Testimonial cards come from
            the homepage content manager.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/about"
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
                    .filter(Boolean),
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

      {/* ── Who we are (split) ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Who We Are — Split Intro</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.whoEyebrow}
                onChange={(e) => set("whoEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.whoTitle}
                onChange={(e) => set("whoTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Paragraphs — one per line")}
            <textarea
              rows={4}
              className={INPUT}
              value={form.whoParagraphs.join("\n")}
              onChange={(e) =>
                set(
                  "whoParagraphs",
                  e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean),
                )
              }
            />
          </label>
          <label className="block">
            {fieldLabel("Pills / Badges — one per line")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.whoPills.join("\n")}
              onChange={(e) =>
                set(
                  "whoPills",
                  e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean),
                )
              }
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Badge Value")}
              <input
                className={INPUT}
                value={form.whoBadgeValue}
                onChange={(e) => set("whoBadgeValue", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Badge Label")}
              <input
                className={INPUT}
                value={form.whoBadgeLabel}
                onChange={(e) => set("whoBadgeLabel", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Image URL")}
              <input
                className={INPUT}
                value={form.whoImageSrc}
                onChange={(e) => set("whoImageSrc", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Image Alt Text")}
              <input
                className={INPUT}
                value={form.whoImageAlt}
                onChange={(e) => set("whoImageAlt", e.target.value)}
              />
            </label>
          </div>
          <div>
            {fieldLabel("Or upload a new image")}
            <ImageUpload
              onUpload={(r) => {
                set("whoImageSrc", r.secure_url);
                set("whoImageAlt", "PCM campus and students");
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Why study at PCM (reverse split) ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Why Study at PCM — Reverse Split</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.whyEyebrow}
                onChange={(e) => set("whyEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.whyTitle}
                onChange={(e) => set("whyTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Paragraphs — one per line")}
            <textarea
              rows={4}
              className={INPUT}
              value={form.whyParagraphs.join("\n")}
              onChange={(e) =>
                set(
                  "whyParagraphs",
                  e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean),
                )
              }
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Image URL")}
              <input
                className={INPUT}
                value={form.whyImageSrc}
                onChange={(e) => set("whyImageSrc", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Image Alt Text")}
              <input
                className={INPUT}
                value={form.whyImageAlt}
                onChange={(e) => set("whyImageAlt", e.target.value)}
              />
            </label>
          </div>
          <div>
            {fieldLabel("Or upload a new image")}
            <ImageUpload
              onUpload={(r) => {
                set("whyImageSrc", r.secure_url);
                set("whyImageAlt", "The PCM campus in Nadipur");
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("CTA Button Label")}
              <input
                className={INPUT}
                value={form.whyCtaLabel}
                onChange={(e) => set("whyCtaLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("CTA Button Link")}
              <input
                className={INPUT}
                value={form.whyCtaHref}
                onChange={(e) => set("whyCtaHref", e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* ── Vision, Mission & Values ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Vision, Mission & Values</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.vmvEyebrow}
                onChange={(e) => set("vmvEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.vmvTitle}
                onChange={(e) => set("vmvTitle", e.target.value)}
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-(--admin-ink)">
              Cards ({form.vmvCards.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addVmv}
            >
              <Plus size={14} /> Add Card
            </button>
          </div>

          <div className="space-y-4">
            {form.vmvCards.map((card, i) => (
              <div
                key={card.id}
                className="rounded-xl border border-(--admin-line) p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-(--admin-brand)">
                    {card.id}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move up"
                      onClick={() =>
                        set("vmvCards", moveArr(form.vmvCards, i, -1))
                      }
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move down"
                      onClick={() =>
                        set("vmvCards", moveArr(form.vmvCards, i, 1))
                      }
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn danger"
                      aria-label="Remove"
                      onClick={() => removeVmv(i)}
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
                      value={card.title}
                      onChange={(e) => updateVmv(i, { title: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Type")}
                    <select
                      className={INPUT}
                      value={card.iconType}
                      onChange={(e) =>
                        updateVmv(i, {
                          iconType: e.target.value as VmvCard["iconType"],
                        })
                      }
                    >
                      <option value="vision">Vision</option>
                      <option value="mission">Mission</option>
                      <option value="values">Values</option>
                    </select>
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Background Color")}
                    <input
                      type="color"
                      className={INPUT + " h-10"}
                      value={card.iconBg}
                      onChange={(e) => updateVmv(i, { iconBg: e.target.value })}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    {fieldLabel("Icon Color")}
                    <input
                      type="color"
                      className={INPUT + " h-10"}
                      value={card.iconColor}
                      onChange={(e) =>
                        updateVmv(i, { iconColor: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Description")}
                    <textarea
                      rows={2}
                      className={INPUT}
                      value={card.description}
                      onChange={(e) =>
                        updateVmv(i, { description: e.target.value })
                      }
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── The PCM difference ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>The PCM Difference</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.diffEyebrow}
                onChange={(e) => set("diffEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.diffTitle}
                onChange={(e) => set("diffTitle", e.target.value)}
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">
              Difference items ({form.diffItems.length})
            </h4>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={addDiff}
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-4">
            {form.diffItems.map((item, i) => (
              <div
                key={item.id}
                className="rounded-xl border border-[var(--admin-line)] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[var(--admin-brand)]">
                    {item.id}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move up"
                      onClick={() =>
                        set("diffItems", moveArr(form.diffItems, i, -1))
                      }
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      aria-label="Move down"
                      onClick={() =>
                        set("diffItems", moveArr(form.diffItems, i, 1))
                      }
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn danger"
                      aria-label="Remove"
                      onClick={() => removeDiff(i)}
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
                      value={item.title}
                      onChange={(e) => updateDiff(i, { title: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Type")}
                    <select
                      className={INPUT}
                      value={item.iconType}
                      onChange={(e) =>
                        updateDiff(i, {
                          iconType: e.target.value as DiffItem["iconType"],
                        })
                      }
                    >
                      <option value="faculty">Faculty</option>
                      <option value="lectures">Guest Lectures</option>
                      <option value="it-courses">IT Courses</option>
                      <option value="extracurriculars">Extracurriculars</option>
                      <option value="industry">Industry Connections</option>
                      <option value="student-care">Student Care</option>
                    </select>
                  </label>
                  <label className="block">
                    {fieldLabel("Icon Background Color")}
                    <input
                      type="color"
                      className={INPUT + " h-10"}
                      value={item.iconBg}
                      onChange={(e) =>
                        updateDiff(i, { iconBg: e.target.value })
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
                      value={item.iconColor}
                      onChange={(e) =>
                        updateDiff(i, { iconColor: e.target.value })
                      }
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Description")}
                    <textarea
                      rows={2}
                      className={INPUT}
                      value={item.description}
                      onChange={(e) =>
                        updateDiff(i, { description: e.target.value })
                      }
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── By the numbers ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>By the Numbers — Stats</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.statsEyebrow}
                onChange={(e) => set("statsEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.statsTitle}
                onChange={(e) => set("statsTitle", e.target.value)}
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
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

          <div className="space-y-3">
            {form.stats.map((stat, i) => (
              <div
                key={stat.id}
                className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_auto] gap-3 items-end rounded-xl border border-[var(--admin-line)] p-3"
              >
                <span className="font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[var(--admin-brand)]">
                  {stat.id}
                </span>
                <label className="block">
                  {fieldLabel("Value")}
                  <input
                    className={INPUT}
                    value={stat.value}
                    onChange={(e) => updateStat(i, { value: e.target.value })}
                  />
                </label>
                <label className="block">
                  {fieldLabel("Label")}
                  <input
                    className={INPUT}
                    value={stat.label}
                    onChange={(e) => updateStat(i, { label: e.target.value })}
                  />
                </label>
                <div className="flex gap-1 pb-1">
                  <button
                    type="button"
                    className="admin-icon-btn"
                    aria-label="Move up"
                    onClick={() => set("stats", moveArr(form.stats, i, -1))}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    aria-label="Move down"
                    onClick={() => set("stats", moveArr(form.stats, i, 1))}
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Voices / Testimonials ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Voices of PCM — Testimonials</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.voicesEyebrow}
                onChange={(e) => set("voicesEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.voicesTitle}
                onChange={(e) => set("voicesTitle", e.target.value)}
              />
            </label>
          </div>
          <label className="block">
            {fieldLabel("Subtitle")}
            <textarea
              rows={2}
              className={INPUT}
              value={form.voicesSubtitle}
              onChange={(e) => set("voicesSubtitle", e.target.value)}
            />
          </label>
          <label className="block" style={{ maxWidth: "220px" }}>
            {fieldLabel("Testimonials per page")}
            <input
              type="number"
              min={1}
              max={12}
              className={INPUT}
              value={form.voicesPerPage}
              onChange={(e) =>
                set("voicesPerPage", Math.max(1, Number(e.target.value) || 1))
              }
            />
          </label>

          <div className="rounded-xl border border-[var(--admin-line)] bg-black/[0.02] p-4">
            <p className="m-0 text-[0.9rem] text-[var(--admin-muted)]">
              The testimonial cards displayed in this section come from the
              homepage content manager — add, edit or remove them there.
            </p>
            <Link className="admin-btn mt-3" href="/admin/pages/home">
              Manage Homepage Testimonials →
            </Link>
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
