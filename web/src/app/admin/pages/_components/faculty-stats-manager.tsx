"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { HardDeleteDialog } from "@/components/shared/delete-dialogs";
import type { FacultyStat } from "@/types/faculty-page-settings";

interface FacultyStatsManagerProps {
  stats: FacultyStat[];
  onStatsUpdate: (stats: FacultyStat[]) => void;
  onSave: (stats: FacultyStat[]) => Promise<void>;
}

const NEW_STAT: Omit<FacultyStat, "id"> = {
  count: 0,
  suffix: "",
  label: "",
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function FacultyStatsManager({
  stats,
  onStatsUpdate,
  onSave,
}: FacultyStatsManagerProps) {
  const [localStats, setLocalStats] = useState<FacultyStat[]>(stats);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<FacultyStat>({
    id: uid(),
    ...NEW_STAT,
  });
  const [saving, setSaving] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const openModal = (index: number | null) => {
    if (index === null) {
      setDraft({ id: uid(), ...NEW_STAT });
    } else {
      setDraft({ ...localStats[index] });
    }
    setEditingIndex(index);
    setModalOpen(true);
  };

  const setDraftField = <K extends keyof FacultyStat>(
    key: K,
    value: FacultyStat[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const persist = async (next: FacultyStat[]) => {
    setLocalStats(next);
    onStatsUpdate(next);
    try {
      await onSave(next);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save changes");
      return false;
    }
  };

  const handleModalSave = async () => {
    setSaving(true);
    try {
      const next =
        editingIndex === null
          ? [...localStats, draft]
          : localStats.map((s, i) => (i === editingIndex ? draft : s));
      const ok = await persist(next);
      if (ok) {
        toast.success(editingIndex === null ? "Stat added." : "Stat saved.");
        setModalOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;
    const stat = localStats[deleteIndex];
    const next = localStats.filter((_, i) => i !== deleteIndex);
    setDeleteIndex(null);
    const ok = await persist(next);
    if (ok) {
      toast.success(`"${stat.label || "Stat"}" removed.`);
    }
  };

  return (
    <>
      {/* Header row */}
      <div className="flex items-center gap-3">
        <h4 className="m-0 text-[0.95rem] font-bold text-(--admin-ink)">
          Stats ({localStats.length})
        </h4>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={() => openModal(null)}
        >
          <Plus size={14} /> Add Stat
        </button>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                COUNT
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                SUFFIX
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                LABEL
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <p className="text-[var(--admin-muted)] mb-3">
                    No stats yet. Add one to get started.
                  </p>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary admin-btn--sm"
                    onClick={() => openModal(null)}
                  >
                    <Plus size={14} /> Add Stat
                  </button>
                </TableCell>
              </TableRow>
            ) : (
              localStats.map((stat, i) => (
                <TableRow
                  key={stat.id}
                  className="hover:bg-[#fafbfe] transition-colors"
                >
                  <TableCell className="text-sm py-3 font-medium">
                    {stat.count}
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    {stat.suffix !== undefined && stat.suffix !== "" ? (
                      <span className="font-mono text-[0.8rem] text-[var(--admin-muted)]">
                        {stat.suffix}
                      </span>
                    ) : (
                      "\u2014"
                    )}
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    {stat.label || "\u2014"}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="row-actions justify-end">
                      <button
                        type="button"
                        className="act-btn"
                        onClick={() => openModal(i)}
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="act-btn danger"
                        onClick={() => handleDelete(i)}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
        >
          {/* Head */}
          <div className="modal__head">
            <DialogTitle className="m-0 text-[1.05rem] font-normal">
              {editingIndex === null ? "Add Stat" : "Edit Stat"}
            </DialogTitle>
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Close"
              onClick={() => setModalOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="modal__body">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="stat-count">Count</label>
                <input
                  id="stat-count"
                  type="number"
                  min={0}
                  value={draft.count}
                  onChange={(e) =>
                    setDraftField("count", Math.max(0, Number(e.target.value) || 0))
                  }
                  placeholder="e.g. 80"
                />
              </div>

              <div className="field">
                <label htmlFor="stat-suffix">Suffix</label>
                <input
                  id="stat-suffix"
                  type="text"
                  value={draft.suffix}
                  onChange={(e) => setDraftField("suffix", e.target.value)}
                  placeholder="e.g. %"
                />
              </div>

              <div className="field field--full">
                <label htmlFor="stat-label">Label</label>
                <input
                  id="stat-label"
                  type="text"
                  value={draft.label}
                  onChange={(e) => setDraftField("label", e.target.value)}
                  placeholder="e.g. Success stories"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              disabled={saving}
              onClick={handleModalSave}
            >
              <Save size={16} />
              {saving ? "Saving\u2026" : "Save Changes"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <HardDeleteDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteIndex(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Stat?"
        description="Are you sure you want to delete this stat? This action cannot be undone."
        itemName={deleteIndex !== null ? localStats[deleteIndex]?.label : undefined}
        confirmText="Delete Stat"
      />
    </>
  );
}