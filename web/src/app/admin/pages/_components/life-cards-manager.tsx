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
import type { LifeFeatureCard } from "@/types/life-page-settings";

interface FeatureCardsManagerProps {
  sectionName: string;
  items: LifeFeatureCard[];
  onItemsUpdate: (items: LifeFeatureCard[]) => void;
  onSave: (items: LifeFeatureCard[]) => Promise<void>;
}

const NEW_CARD: LifeFeatureCard = {
  title: "",
  desc: "",
};

function descToHtml(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^<(?:p|h[1-6]|ul|ol|blockquote)[\s>]/i.test(trimmed)
    ? value
    : `<p>${value}</p>`;
}

export default function FeatureCardsManager({
  sectionName,
  items,
  onItemsUpdate,
  onSave,
}: FeatureCardsManagerProps) {
  const [localItems, setLocalItems] = useState<LifeFeatureCard[]>(items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<LifeFeatureCard>(NEW_CARD);
  const [saving, setSaving] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const openModal = (index: number | null) => {
    if (index === null) {
      setDraft({ ...NEW_CARD });
    } else {
      setDraft({ ...localItems[index] });
    }
    setEditingIndex(index);
    setModalOpen(true);
  };

  const setDraftField = <K extends keyof LifeFeatureCard>(
    key: K,
    value: LifeFeatureCard[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const persist = async (next: LifeFeatureCard[]) => {
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
    if (!draft.title.trim()) {
      toast.error("Please enter a card title.");
      return;
    }
    setSaving(true);
    try {
      const next =
        editingIndex === null
          ? [...localItems, draft]
          : localItems.map((c, i) => (i === editingIndex ? draft : c));
      const ok = await persist(next);
      if (ok) {
        toast.success(editingIndex === null ? "Card added." : "Card saved.");
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
      toast.success(`"${item.title || "Card"}" removed.`);
    }
  };

  const handleMove = async (index: number, dir: -1 | 1) => {
    const t = index + dir;
    if (t < 0 || t >= localItems.length) return;
    const next = [...localItems];
    [next[index], next[t]] = [next[t], next[index]];
    const ok = await persist(next);
    if (ok) {
      toast.success("Card order updated.");
    }
  };

  return (
    <>
      {/* Header row */}
      <div className="flex items-center gap-3">
        <h4 className="m-0 text-[0.95rem] font-bold text-(--admin-ink)">
          Cards ({localItems.length})
        </h4>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={() => openModal(null)}
        >
          <Plus size={14} /> Add Card
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
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-10">
                  <p className="text-[var(--admin-muted)] mb-3">
                    No cards yet for {sectionName}. Add one to get started.
                  </p>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary admin-btn--sm"
                    onClick={() => openModal(null)}
                  >
                    <Plus size={14} /> Add Card
                  </button>
                </TableCell>
              </TableRow>
            ) : (
              localItems.map((card, i) => (
                <TableRow
                  key={card.title || i}
                  className="hover:bg-[#fafbfe] transition-colors"
                >
                  <TableCell className="text-sm py-3 font-medium">
                    {card.title || "\u2014"}
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
              {editingIndex === null ? "Add Card" : "Edit Card"} — {sectionName}
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
                <label htmlFor="feature-card-title">Title</label>
                <input
                  id="feature-card-title"
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraftField("title", e.target.value)}
                  placeholder="e.g. Annual Fest"
                />
              </div>

              <div className="field field--full">
                <label htmlFor="feature-card-desc">Description</label>
                <RichTextEditor
                  content={descToHtml(draft.desc)}
                  onChange={(html) => setDraftField("desc", html)}
                  placeholder="Write the card description..."
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
        title="Delete Card?"
        description="Are you sure you want to delete this card? This action cannot be undone."
        itemName={deleteIndex !== null ? localItems[deleteIndex]?.title : undefined}
        confirmText="Delete Card"
      />
    </>
  );
}