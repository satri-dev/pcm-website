"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Save, X } from "lucide-react";
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
import type { TestimonialFormCopy } from "@/types/testimonial-page-settings";

interface FormCopyField {
  key: keyof TestimonialFormCopy;
  label: string;
  textarea?: boolean;
}

interface TestimonialFormCopyManagerProps {
  formCopy: TestimonialFormCopy;
  onSave: (next: TestimonialFormCopy) => Promise<void>;
}

const PAGE_SIZE = 8;

const FIELD_DEFS: FormCopyField[] = [
  { key: "modalTitle", label: "Modal Title" },
  { key: "modalDescription", label: "Modal Description", textarea: true },
  { key: "successTitle", label: "Success Title" },
  { key: "successText", label: "Success Text", textarea: true },
  { key: "successDone", label: "Success Done Label" },
  { key: "requiredName", label: "Required Name Error" },
  { key: "requiredContent", label: "Required Content Error" },
  { key: "submitError", label: "Submit Error" },
  { key: "nameLabel", label: "Name Label" },
  { key: "programLabel", label: "Program Label" },
  { key: "batchLabel", label: "Batch Label" },
  { key: "positionLabel", label: "Position Label" },
  { key: "photoLabel", label: "Photo Label" },
  { key: "contentLabel", label: "Content Label" },
  { key: "submitLabel", label: "Submit Button Label" },
  { key: "submittingLabel", label: "Submitting Label" },
  { key: "cancelLabel", label: "Cancel Label" },
  { key: "uploadLabel", label: "Upload Image Label" },
  { key: "removePhotoLabel", label: "Remove Photo Label" },
  { key: "noPhotoText", label: "No Photo Selected Text" },
];

export default function TestimonialFormCopyManager({
  formCopy,
  onSave,
}: TestimonialFormCopyManagerProps) {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormCopyField | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const totalPages = Math.max(1, Math.ceil(FIELD_DEFS.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageFields = FIELD_DEFS.slice(pageStart, pageStart + PAGE_SIZE);

  const openModal = (field: FormCopyField) => {
    setEditingField(field);
    setDraft(formCopy[field.key] ?? "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingField) return;
    setSaving(true);
    try {
      const next = { ...formCopy, [editingField.key]: draft };
      await onSave(next);
      toast.success(`"${editingField.label}" updated.`);
      setModalOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save changes",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Header row + pagination */}
      <div className="flex items-center justify-between gap-3">
        <h4 className="m-0 text-[0.95rem] font-bold text-(--admin-ink)">
          Form Copy ({FIELD_DEFS.length} fields)
        </h4>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="admin-btn admin-btn--sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>
          <span className="px-2 text-[0.85rem] text-[var(--admin-muted)]">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="admin-btn admin-btn--sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[38%] text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                FIELD LABEL
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                VALUE
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageFields.map((field) => {
              const value = formCopy[field.key] ?? "";
              return (
                <TableRow
                  key={field.key}
                  className="align-top hover:bg-[#fafbfe] transition-colors"
                >
                  <TableCell className="text-sm py-3 font-medium">
                    {field.label}
                  </TableCell>
                  <TableCell className="py-3">
                    {value ? (
                      <span className="line-clamp-2 block max-w-[420px] text-[0.85rem] leading-snug text-[var(--admin-ink)]">
                        {value}
                      </span>
                    ) : (
                      <span className="text-[var(--admin-muted)]">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="row-actions justify-end">
                      <button
                        type="button"
                        className="act-btn"
                        onClick={() => openModal(field)}
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
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
              Edit — {editingField?.label}
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
                <label htmlFor="form-copy-value">{editingField?.label}</label>
                {editingField?.textarea ? (
                  <textarea
                    id="form-copy-value"
                    rows={5}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Enter the copy text..."
                    autoFocus
                  />
                ) : (
                  <input
                    id="form-copy-value"
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Enter the copy text..."
                    autoFocus
                  />
                )}
                <span className="hint">
                  Shown to students on the public &quot;Add Testimonial&quot;
                  form.
                </span>
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
              onClick={handleSave}
            >
              <Save size={16} />
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}