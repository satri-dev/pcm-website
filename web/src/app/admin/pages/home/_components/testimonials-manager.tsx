"use client";

import { useState } from "react";
import { HomepageTestimonial } from "@/types/homepage";
import { Plus, Trash2, Save } from "lucide-react";

interface Props {
  testimonials: HomepageTestimonial[];
  onSave: (testimonials: HomepageTestimonial[]) => Promise<void>;
}

export default function TestimonialsManager({ testimonials, onSave }: Props) {
  const [items, setItems] = useState<HomepageTestimonial[]>(testimonials);
  const [saving, setSaving] = useState(false);

  const update = (index: number, patch: Partial<HomepageTestimonial>) => {
    setItems((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...patch } : t))
    );
  };

  const remove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(items);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--admin-ink)] m-0">Testimonials</h3>
          <p className="text-sm text-[var(--admin-muted)] mt-1 m-0">
            Alumni quotes shown in the testimonials carousel.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              setItems((prev) => [
                ...prev,
                {
                  id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  name: "",
                  role: "",
                  quote: "",
                  photo: "/images/hero-2.jpg",
                },
              ])
            }
            className="admin-btn"
          >
            <Plus size={14} /> Add Testimonial
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

      <div className="space-y-4">
        {items.map((t, idx) => (
          <div
            key={t.id}
            className="border border-[var(--admin-border)] rounded-xl p-5 bg-[var(--admin-surface)]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-[var(--admin-muted)]">
                Testimonial {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="admin-icon-btn text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="form-grid">
              <div className="field">
                <label>Name</label>
                <input
                  value={t.name}
                  onChange={(e) => update(idx, { name: e.target.value })}
                  placeholder="Amrit Adhikari"
                />
              </div>
              <div className="field">
                <label>Role</label>
                <input
                  value={t.role}
                  onChange={(e) => update(idx, { role: e.target.value })}
                  placeholder="Dean's List — 2075 BS"
                />
              </div>
              <div className="field">
                <label>Photo path</label>
                <input
                  value={t.photo}
                  onChange={(e) => update(idx, { photo: e.target.value })}
                  placeholder="/images/hero-2.jpg"
                />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Quote</label>
                <textarea
                  value={t.quote}
                  onChange={(e) => update(idx, { quote: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
