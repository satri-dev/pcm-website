"use client";

import { useState } from "react";
import { HomepageTestimonial } from "@/types/homepage";
import { Plus, Trash2, Save } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import Image from "next/image";
import { HardDeleteDialog } from "@/components/shared/delete-dialogs";

interface Props {
  testimonials: HomepageTestimonial[];
  onSave: (testimonials: HomepageTestimonial[]) => Promise<void>;
}

export default function TestimonialsManager({ testimonials, onSave }: Props) {
  const [items, setItems] = useState<HomepageTestimonial[]>(testimonials);
  const [saving, setSaving] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  const update = (index: number, patch: Partial<HomepageTestimonial>) => {
    setItems((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...patch } : t))
    );
  };

  const remove = (index: number) => {
    setDeleteIdx(index);
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
                photo: "", // Empty by default, will be uploaded via Cloudinary
              },
            ])
          }
          className="admin-btn"
        >
          <Plus size={14} /> Add Testimonial
        </button>
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
                className="admin-icon-btn"
                style={{ background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}
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
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Photo (Cloudinary)</label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={t.photo}
                        onChange={(e) => update(idx, { photo: e.target.value })}
                        placeholder="https://res.cloudinary.com/..."
                        className="w-full"
                      />
                      <div className="mt-2">
                        <ImageUpload
                          onUpload={(result) => update(idx, { photo: result.secure_url })}
                        />
                      </div>
                    </div>
                    {t.photo && (
                      <div className="flex-shrink-0 w-20 h-20 relative rounded-full overflow-hidden border border-[var(--admin-border)]">
                        <Image
                          src={t.photo}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-[var(--admin-muted)]">
                    Upload via Cloudinary or paste an existing URL. Recommended: square photo
                  </span>
                </div>
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

      {/* Save Button at Bottom */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn--primary"
        >
          <Save size={14} /> {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <HardDeleteDialog
        open={deleteIdx !== null}
        onOpenChange={(open) => { if (!open) setDeleteIdx(null); }}
        onConfirm={() => {
          if (deleteIdx !== null) {
            setItems((prev) => prev.filter((_, i) => i !== deleteIdx));
            setDeleteIdx(null);
          }
        }}
        title="Delete Testimonial?"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete Testimonial"
      />
    </div>
  );
}
