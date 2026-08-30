"use client";

import { useState } from "react";
import { WelcomeStat } from "@/types/homepage";
import { Plus, Trash2, Save } from "lucide-react";

interface Props {
  stats: WelcomeStat[];
  onSave: (stats: WelcomeStat[]) => Promise<void>;
}

export default function StatsManager({ stats, onSave }: Props) {
  const [items, setItems] = useState<WelcomeStat[]>(stats);
  const [saving, setSaving] = useState(false);

  const update = (index: number, patch: Partial<WelcomeStat>) => {
    setItems((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
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
          <h3 className="text-lg font-bold text-[var(--admin-ink)] m-0">Welcome Stats</h3>
          <p className="text-sm text-[var(--admin-muted)] mt-1 m-0">
            Animated counter stats shown below the welcome text.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              setItems((prev) => [...prev, { value: 0, suffix: "", label: "" }])
            }
            className="admin-btn"
          >
            <Plus size={14} /> Add Stat
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

      <div className="space-y-3">
        {items.map((stat, idx) => (
          <div
            key={idx}
            className="flex gap-3 items-end border border-[var(--admin-border)] rounded-lg p-4 bg-[var(--admin-surface)]"
          >
            <div className="field flex-1">
              <label>Value</label>
              <input
                type="number"
                value={stat.value}
                onChange={(e) =>
                  update(idx, { value: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="field" style={{ width: 100 }}>
              <label>Suffix</label>
              <input
                value={stat.suffix}
                onChange={(e) => update(idx, { suffix: e.target.value })}
                placeholder="%"
              />
            </div>
            <div className="field flex-1">
              <label>Label</label>
              <input
                value={stat.label}
                onChange={(e) => update(idx, { label: e.target.value })}
                placeholder="Years of Excellence"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="admin-icon-btn text-red-500 hover:text-red-700 mb-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
