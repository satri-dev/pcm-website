"use client";

import { useState } from "react";
import { WhyChooseText, WhyChooseReason } from "@/types/homepage";
import { Plus, Trash2, Save } from "lucide-react";
import { HardDeleteDialog } from "@/components/shared/delete-dialogs";

interface Props {
  whyChooseText: WhyChooseText;
  reasons: WhyChooseReason[];
  onSaveText: (text: WhyChooseText) => Promise<void>;
  onSave: (reasons: WhyChooseReason[]) => Promise<void>;
}

export default function ReasonsManager({
  whyChooseText,
  reasons,
  onSaveText,
  onSave,
}: Props) {
  const [text, setText] = useState<WhyChooseText>(whyChooseText ?? { badge: "The PCM difference", heading: "Why choose PCM?", description: "", linkLabel: "About PCM", linkHref: "/about" });
  const [items, setItems] = useState<WhyChooseReason[]>(reasons);
  const [savingText, setSavingText] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);

  const update = (index: number, patch: Partial<WhyChooseReason>) => {
    setItems((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const remove = (index: number) => {
    setDeleteIdx(index);
  };

  const handleSaveText = async () => {
    setSavingText(true);
    try {
      await onSaveText(text);
    } finally {
      setSavingText(false);
    }
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
      {/* Why Choose Text */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--admin-ink)] m-0">Section Header</h3>
            <p className="text-sm text-[var(--admin-muted)] mt-1 m-0">
              The badge, heading and description for the Why Choose PCM section.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveText}
            disabled={savingText}
            className="admin-btn admin-btn--primary"
          >
            <Save size={14} /> {savingText ? "Saving…" : "Save Text"}
          </button>
        </div>

        <div className="form-grid">
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Badge text</label>
            <input
              value={text.badge}
              onChange={(e) => setText((t) => ({ ...t, badge: e.target.value }))}
              placeholder="The PCM difference"
            />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Heading</label>
            <input
              value={text.heading}
              onChange={(e) => setText((t) => ({ ...t, heading: e.target.value }))}
              placeholder="Why choose PCM?"
            />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Description</label>
            <textarea
              value={text.description}
              onChange={(e) => setText((t) => ({ ...t, description: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="field">
            <label>Link label</label>
            <input
              value={text.linkLabel}
              onChange={(e) => setText((t) => ({ ...t, linkLabel: e.target.value }))}
              placeholder="About PCM"
            />
          </div>
          <div className="field">
            <label>Link href</label>
            <input
              value={text.linkHref}
              onChange={(e) => setText((t) => ({ ...t, linkHref: e.target.value }))}
              placeholder="/about"
            />
          </div>
        </div>
      </div>

      <hr className="border-[var(--admin-border)] my-6" />

      {/* Why Choose Reasons */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[var(--admin-ink)] m-0">Reason Cards</h3>
            <p className="text-sm text-[var(--admin-muted)] mt-1 m-0">
              The reason cards shown on the home page.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setItems((prev) => [...prev, { icon: "🎓", title: "", desc: "" }])
            }
            className="admin-btn"
          >
            <Plus size={14} /> Add Reason
          </button>
        </div>

        <div className="space-y-4">
          {items.map((reason, idx) => (
            <div
              key={idx}
              className="border border-[var(--admin-border)] rounded-xl p-5 bg-[var(--admin-surface)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-[var(--admin-muted)]">
                  Reason {idx + 1}
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
                <div className="field" style={{ width: 80 }}>
                  <label>Icon (emoji)</label>
                  <input
                    value={reason.icon}
                    onChange={(e) => update(idx, { icon: e.target.value })}
                    placeholder="🎓"
                  />
                </div>
                <div className="field">
                  <label>Title</label>
                  <input
                    value={reason.title}
                    onChange={(e) => update(idx, { title: e.target.value })}
                    placeholder="PU-affiliated degrees"
                  />
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Description</label>
                  <textarea
                    value={reason.desc}
                    onChange={(e) => update(idx, { desc: e.target.value })}
                    rows={2}
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
            <Save size={14} /> {saving ? "Saving…" : "Save Reasons"}
          </button>
        </div>
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
        title="Delete Reason?"
        description="Are you sure you want to delete this reason? This action cannot be undone."
        confirmText="Delete Reason"
      />
    </div>
  );
}
