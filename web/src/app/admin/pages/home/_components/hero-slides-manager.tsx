"use client";

import { useState } from "react";
import type { HeroSlide } from "@/types/homepage";
import { MAX_HERO_SLIDES } from "@/types/homepage";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";

interface Props {
  slides: HeroSlide[];
  onSave: (slides: HeroSlide[]) => Promise<void>;
}

function emptySlide(): HeroSlide {
  return {
    id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    image: "/images/hero-1.jpg",
    badge: "",
    heading: "",
    accent: "",
    sub: "",
    primaryCta: { label: "Apply Now", href: "/admission" },
    secondaryCta: { label: "Learn More", href: "/about" },
    stats: [{ value: "", label: "" }],
  };
}

export default function HeroSlidesManager({ slides, onSave }: Props) {
  const [items, setItems] = useState<HeroSlide[]>(slides);
  const [saving, setSaving] = useState(false);

  const update = (index: number, patch: Partial<HeroSlide>) => {
    setItems((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const remove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const updateStat = (slideIdx: number, statIdx: number, patch: Partial<{ value: string; label: string }>) => {
    setItems((prev) =>
      prev.map((s, i) =>
        i === slideIdx
          ? {
              ...s,
              stats: s.stats.map((st, si) =>
                si === statIdx ? { ...st, ...patch } : st
              ),
            }
          : s
      )
    );
  };

  const addStat = (slideIdx: number) => {
    setItems((prev) =>
      prev.map((s, i) =>
        i === slideIdx ? { ...s, stats: [...s.stats, { value: "", label: "" }] } : s
      )
    );
  };

  const removeStat = (slideIdx: number, statIdx: number) => {
    setItems((prev) =>
      prev.map((s, i) =>
        i === slideIdx
          ? { ...s, stats: s.stats.filter((_, si) => si !== statIdx) }
          : s
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(items);
    } finally {
      setSaving(false);
    }
  };

  const atMax = items.length >= MAX_HERO_SLIDES;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--admin-ink)] m-0">Hero Slides</h3>
          <p className="text-sm text-[var(--admin-muted)] mt-1 m-0">
            Manage the hero carousel on the home page. Maximum {MAX_HERO_SLIDES} slides.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {atMax && (
            <span className="text-xs text-[var(--admin-muted)]">
              Maximum {MAX_HERO_SLIDES} slides reached
            </span>
          )}
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, emptySlide()])}
            disabled={atMax}
            className="admin-btn"
            title={atMax ? `Maximum ${MAX_HERO_SLIDES} slides allowed` : "Add new slide"}
          >
            <Plus size={14} /> Add Slide ({items.length}/{MAX_HERO_SLIDES})
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn--primary"
          >
            <Save size={14} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((slide, idx) => (
          <div
            key={slide.id}
            className="border border-[var(--admin-border)] rounded-xl p-5 bg-[var(--admin-surface)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className="admin-icon-btn"
                title="Move up"
              >
                <GripVertical size={16} />
              </button>
              <span className="font-mono text-xs text-[var(--admin-muted)]">
                Slide {idx + 1}
              </span>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="admin-icon-btn text-red-500 hover:text-red-700"
                title="Remove slide"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="form-grid">
              <div className="field">
                <label>Badge text</label>
                <input
                  value={slide.badge}
                  onChange={(e) => update(idx, { badge: e.target.value })}
                  placeholder="Affiliated to Pokhara University"
                />
              </div>
              <div className="field">
                <label>Heading</label>
                <input
                  value={slide.heading}
                  onChange={(e) => update(idx, { heading: e.target.value })}
                  placeholder="Quality management & IT education"
                />
              </div>
              <div className="field">
                <label>Accent (green highlight)</label>
                <input
                  value={slide.accent}
                  onChange={(e) => update(idx, { accent: e.target.value })}
                  placeholder="in the heart of Pokhara"
                />
              </div>
              <div className="field">
                <label>Image path</label>
                <input
                  value={slide.image}
                  onChange={(e) => update(idx, { image: e.target.value })}
                  placeholder="/images/hero-1.jpg"
                />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Subtitle</label>
                <textarea
                  value={slide.sub}
                  onChange={(e) => update(idx, { sub: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="field">
                <label>Primary CTA label</label>
                <input
                  value={slide.primaryCta.label}
                  onChange={(e) =>
                    update(idx, {
                      primaryCta: { ...slide.primaryCta, label: e.target.value },
                    })
                  }
                />
              </div>
              <div className="field">
                <label>Primary CTA href</label>
                <input
                  value={slide.primaryCta.href}
                  onChange={(e) =>
                    update(idx, {
                      primaryCta: { ...slide.primaryCta, href: e.target.value },
                    })
                  }
                />
              </div>
              <div className="field">
                <label>Secondary CTA label</label>
                <input
                  value={slide.secondaryCta.label}
                  onChange={(e) =>
                    update(idx, {
                      secondaryCta: { ...slide.secondaryCta, label: e.target.value },
                    })
                  }
                />
              </div>
              <div className="field">
                <label>Secondary CTA href</label>
                <input
                  value={slide.secondaryCta.href}
                  onChange={(e) =>
                    update(idx, {
                      secondaryCta: { ...slide.secondaryCta, href: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[var(--admin-ink)]">
                  Stats
                </span>
                <button
                  type="button"
                  onClick={() => addStat(idx)}
                  className="admin-btn text-xs"
                >
                  <Plus size={12} /> Add Stat
                </button>
              </div>
              <div className="space-y-2">
                {slide.stats.map((stat, si) => (
                  <div key={si} className="flex gap-2 items-center">
                    <input
                      value={stat.value}
                      onChange={(e) => updateStat(idx, si, { value: e.target.value })}
                      placeholder="Value (e.g. 23+)"
                      className="flex-1"
                    />
                    <input
                      value={stat.label}
                      onChange={(e) => updateStat(idx, si, { label: e.target.value })}
                      placeholder="Label (e.g. Years of Trust)"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(idx, si)}
                      className="admin-icon-btn text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
