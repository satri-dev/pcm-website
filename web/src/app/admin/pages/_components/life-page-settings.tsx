"use client";

import { useState, type ReactNode } from "react";
import { Save, Link2, Plus, Trash2, GripVertical } from "lucide-react";
import {
  LIFE_PAGE_SETTINGS_DEFAULTS,
  type LifeFeatureCard,
  type LifePageSettings,
} from "@/types/life-page-settings";

const API_BASE = "/api/admin/pages/life-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-[var(--admin-ink)]">
      {c}
    </span>
  );
}

export default function LifePageSettings({
  initial,
}: {
  initial: LifePageSettings;
}) {
  const [form, setForm] = useState<LifePageSettings>({
    ...LIFE_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof LifePageSettings>(
    key: K,
    value: LifePageSettings[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const moveArr = <T,>(arr: T[], idx: number, dir: -1 | 1): T[] => {
    const t = idx + dir;
    if (t < 0 || t >= arr.length) return arr;
    const next = [...arr];
    [next[idx], next[t]] = [next[t], next[idx]];
    return next;
  };

  const makeCards = (key: "eventCards" | "workshopCards" | "clubCards") => ({
    update(idx: number, patch: Partial<LifeFeatureCard>) {
      set(key, form[key].map((p, i) => (i === idx ? { ...p, ...patch } : p)));
    },
    add() {
      set(key, [...form[key], { title: "", desc: "" }]);
    },
    remove(idx: number) {
      set(key, form[key].filter((_, i) => i !== idx));
    },
  });

  const events = makeCards("eventCards");
  const workshops = makeCards("workshopCards");
  const clubs = makeCards("clubCards");

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
      setMessage("Saved. The public /life page now reflects these changes.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const renderCards = (
    key: "eventCards" | "workshopCards" | "clubCards",
    cards: LifeFeatureCard[],
    helpers: ReturnType<typeof makeCards>
  ) => (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[0.85rem] font-medium text-[var(--admin-ink)]">
          Cards ({cards.length})
        </span>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={() => helpers.add()}
        >
          <Plus size={14} /> Add Card
        </button>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {cards.map((card, i) => (
          <div
            key={i}
            className="rounded-lg border border-[var(--admin-line)] bg-[var(--admin-surface)] p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <GripVertical size={16} className="text-[var(--admin-muted)]" />
              <b className="text-sm">Card {i + 1}</b>
              <div className="ml-auto flex gap-1">
                <button
                  type="button"
                  className="admin-icon-btn"
                  onClick={() => set(key, moveArr(cards, i, -1))}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-icon-btn"
                  onClick={() => set(key, moveArr(cards, i, 1))}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-icon-btn text-[var(--admin-red)] hover:bg-red-50"
                  onClick={() => helpers.remove(i)}
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <input
                className={INPUT}
                placeholder="Card title"
                value={card.title}
                onChange={(e) => helpers.update(i, { title: e.target.value })}
              />
              <textarea
                className={INPUT}
                rows={2}
                placeholder="Card description"
                value={card.desc}
                onChange={(e) => helpers.update(i, { desc: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Life at PCM Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Edit the sections of the public /life page — hero, the three feature
            sections, the gallery strip and CTA band. The gallery photos come
            from the Gallery content manager.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/life"
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
              placeholder="/assets/img/hero-5.jpg"
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

      {/* ── Events & Tours ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Events & Tours Section</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.eventsEyebrow}
                onChange={(e) => set("eventsEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.eventsTitle}
                onChange={(e) => set("eventsTitle", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Subtitle")}
              <input
                className={INPUT}
                value={form.eventsSubtitle}
                onChange={(e) => set("eventsSubtitle", e.target.value)}
              />
            </label>
          </div>
          {renderCards("eventCards", form.eventCards, events)}
        </div>
      </div>

      {/* ── Workshops & Seminars ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Workshops & Seminars Section</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.workshopsEyebrow}
                onChange={(e) => set("workshopsEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.workshopsTitle}
                onChange={(e) => set("workshopsTitle", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Subtitle")}
              <input
                className={INPUT}
                value={form.workshopsSubtitle}
                onChange={(e) => set("workshopsSubtitle", e.target.value)}
              />
            </label>
          </div>
          {renderCards("workshopCards", form.workshopCards, workshops)}
        </div>
      </div>

      {/* ── Student Clubs ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Student Clubs Section</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.clubsEyebrow}
                onChange={(e) => set("clubsEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.clubsTitle}
                onChange={(e) => set("clubsTitle", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Subtitle")}
              <input
                className={INPUT}
                value={form.clubsSubtitle}
                onChange={(e) => set("clubsSubtitle", e.target.value)}
              />
            </label>
          </div>
          {renderCards("clubCards", form.clubCards, clubs)}
        </div>
      </div>

      {/* ── Gallery strip ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Gallery Strip</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              {fieldLabel("Eyebrow")}
              <input
                className={INPUT}
                value={form.galleryEyebrow}
                onChange={(e) => set("galleryEyebrow", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Title")}
              <input
                className={INPUT}
                value={form.galleryTitle}
                onChange={(e) => set("galleryTitle", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Subtitle")}
              <input
                className={INPUT}
                value={form.gallerySubtitle}
                onChange={(e) => set("gallerySubtitle", e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              {fieldLabel("Button Label")}
              <input
                className={INPUT}
                value={form.galleryButtonLabel}
                onChange={(e) => set("galleryButtonLabel", e.target.value)}
              />
            </label>
            <label className="block">
              {fieldLabel("Button Link")}
              <input
                className={INPUT}
                value={form.galleryButtonHref}
                onChange={(e) => set("galleryButtonHref", e.target.value)}
              />
            </label>
          </div>

          <div className="rounded-xl border border-[var(--admin-line)] bg-black/[0.02] p-4">
            <p className="m-0 text-[0.9rem] text-[var(--admin-muted)]">
              The four photos shown here come from the Gallery content manager —
              only the latest photos are shown (videos are excluded).
            </p>
            <a className="admin-btn mt-3" href="/admin/media/gallery">
              Manage Gallery →
            </a>
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
