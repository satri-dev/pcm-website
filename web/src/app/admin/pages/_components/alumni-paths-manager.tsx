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
import RichTextEditor from "../../_components/editor/rich-text-editor";
import { HardDeleteDialog } from "@/components/shared/delete-dialogs";
import {
  type AlumniPathData,
  type AlumniPathIconType,
} from "@/types/alumni-page-settings";

interface AlumniPathsManagerProps {
  items: AlumniPathData[];
  onItemsUpdate: (items: AlumniPathData[]) => void;
  onSave: (items: AlumniPathData[]) => Promise<void>;
}

const ICON_LABELS: Record<AlumniPathIconType, string> = {
  bank: "Banking",
  tech: "Technology",
  entrepreneurship: "Entrepreneurship",
  education: "Education",
};

const NEW_PATH: Omit<AlumniPathData, "id"> = {
  iconType: "bank",
  iconBg: "#eef3ff",
  iconColor: "#21409A",
  title: "",
  description: "",
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function descToHtml(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^<(?:p|h[1-6]|ul|ol|blockquote)[\s>]/i.test(trimmed)
    ? value
    : `<p>${value}</p>`;
}

export default function AlumniPathsManager({
  items,
  onItemsUpdate,
  onSave,
}: AlumniPathsManagerProps) {
  const [localItems, setLocalItems] = useState<AlumniPathData[]>(items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<AlumniPathData>({
    id: uid(),
    ...NEW_PATH,
  });
  const [saving, setSaving] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const openModal = (index: number | null) => {
    if (index === null) {
      setDraft({ id: uid(), ...NEW_PATH });
    } else {
      setDraft({ ...localItems[index] });
    }
    setEditingIndex(index);
    setModalOpen(true);
  };

  const setDraftField = <K extends keyof AlumniPathData>(
    key: K,
    value: AlumniPathData[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const persist = async (next: AlumniPathData[]) => {
    setLocalItems(next);
    onItemsUpdate(next);
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
          ? [...localItems, draft]
          : localItems.map((c, i) => (i === editingIndex ? draft : c));
      const ok = await persist(next);
      if (ok) {
        toast.success(editingIndex === null ? "Career path added." : "Career path saved.");
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
    const item = localItems[deleteIndex];
    const next = localItems.filter((_, i) => i !== deleteIndex);
    setDeleteIndex(null);
    const ok = await persist(next);
    if (ok) {
      toast.success(`"${item.title || "Career path"}" removed.`);
    }
  };

  const handleMove = async (index: number, dir: -1 | 1) => {
    const t = index + dir;
    if (t < 0 || t >= localItems.length) return;
    const next = [...localItems];
    [next[index], next[t]] = [next[t], next[index]];
    const ok = await persist(next);
    if (ok) {
      toast.success("Career path order updated.");
    }
  };

  return (
    <>
      {/* Header row */}
      <div className="flex items-center gap-3">
        <h4 className="m-0 text-[0.95rem] font-bold text-(--admin-ink)">
          Career Paths ({localItems.length})
        </h4>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={() => openModal(null)}
        >
          <Plus size={14} /> Add Path
        </button>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                TITLE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                ICON TYPE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                ICON COLOR
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <p className="text-[var(--admin-muted)] mb-3">
                    No career paths yet. Add one to get started.
                  </p>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary admin-btn--sm"
                    onClick={() => openModal(null)}
                  >
                    <Plus size={14} /> Add Path
                  </button>
                </TableCell>
              </TableRow>
            ) : (
              localItems.map((path, i) => (
                <TableRow
                  key={path.id}
                  className="hover:bg-[#fafbfe] transition-colors"
                >
                  <TableCell className="text-sm py-3 font-medium">
                    {path.title || "\u2014"}
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <span className="badge badge--blue lowercase">
                      {ICON_LABELS[path.iconType]}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-5 w-5 rounded-full border border-[var(--admin-line)]"
                        style={{ background: path.iconColor }}
                      />
                      <span className="font-mono text-[0.78rem] text-[var(--admin-muted)]">
                        {path.iconColor}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="row-actions justify-end">
                      <button
                        type="button"
                        className="act-btn"
                        aria-label="Move up"
                        onClick={() => handleMove(i, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="act-btn"
                        aria-label="Move down"
                        onClick={() => handleMove(i, 1)}
                      >
                        ↓
                      </button>
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
              {editingIndex === null ? "Add Career Path" : "Edit Career Path"}
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
              <div className="field field--full">
                <label htmlFor="path-title">Title</label>
                <input
                  id="path-title"
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraftField("title", e.target.value)}
                  placeholder="e.g. Banking & Finance"
                />
              </div>

              <div className="field">
                <label htmlFor="path-icon-type">Icon Type</label>
                <select
                  id="path-icon-type"
                  value={draft.iconType}
                  onChange={(e) =>
                    setDraftField(
                      "iconType",
                      e.target.value as AlumniPathIconType,
                    )
                  }
                >
                  <option value="bank">Banking</option>
                  <option value="tech">Technology</option>
                  <option value="entrepreneurship">Entrepreneurship</option>
                  <option value="education">Education</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="path-icon-bg">Icon Background Color</label>
                <input
                  id="path-icon-bg"
                  type="color"
                  className="h-10"
                  value={draft.iconBg}
                  onChange={(e) => setDraftField("iconBg", e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="path-icon-color">Icon Color</label>
                <input
                  id="path-icon-color"
                  type="color"
                  className="h-10"
                  value={draft.iconColor}
                  onChange={(e) => setDraftField("iconColor", e.target.value)}
                />
              </div>

              <div className="field field--full">
                <label htmlFor="path-description">Description</label>
                <RichTextEditor
                  content={descToHtml(draft.description)}
                  onChange={(html) => setDraftField("description", html)}
                  placeholder="Write the career path description..."
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
              {saving ? "Saving…" : "Save Changes"}
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
        title="Delete Career Path?"
        description="Are you sure you want to delete this career path? This action cannot be undone."
        itemName={deleteIndex !== null ? localItems[deleteIndex]?.title : undefined}
        confirmText="Delete Career Path"
      />
    </>
  );
}