"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Pencil, Plus, Save, Trash2, X } from "lucide-react";
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
import {
  FEEDBACK_FIELD_TYPES,
  type FeedbackFieldConfig,
  type FeedbackFieldType,
} from "@/types/feedback-page-settings";

interface FeedbackFieldsManagerProps {
  fields: FeedbackFieldConfig[];
  onChange: (fields: FeedbackFieldConfig[]) => void;
}

const TYPE_LABEL: Record<FeedbackFieldType, string> = {
  text: "Short text",
  textarea: "Long text",
  number: "Number",
  email: "Email",
  checkbox: "Checkbox",
  "checkbox-group": "Checkbox Group",
  select: "Dropdown",
  radio: "Radio buttons",
  rating: "Star Rating",
  image: "Image upload",
  document: "File upload",
};

function makeId(label: string): string {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || `field-${Date.now()}`;
}

function uniqueId(label: string, existing: FeedbackFieldConfig[]): string {
  const base = makeId(label);
  const taken = new Set(existing.map((f) => f.id));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

const EMPTY_DRAFT: FeedbackFieldConfig = {
  id: "",
  label: "",
  type: "text",
  required: false,
  options: [],
};

export default function FeedbackFieldsManager({
  fields,
  onChange,
}: FeedbackFieldsManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<FeedbackFieldConfig>(EMPTY_DRAFT);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const setDraftField = <K extends keyof FeedbackFieldConfig>(
    key: K,
    value: FeedbackFieldConfig[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const openModal = (index: number | null) => {
    if (index === null) {
      setDraft({ ...EMPTY_DRAFT });
    } else {
      setDraft({ ...fields[index] });
    }
    setEditingIndex(index);
    setModalOpen(true);
  };

  const moveField = (index: number, dir: -1 | 1) => {
    const t = index + dir;
    if (t < 0 || t >= fields.length) return;
    const next = [...fields];
    [next[index], next[t]] = [next[t], next[index]];
    onChange(next);
  };

  const handleDelete = (index: number) => setDeleteIndex(index);

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const field = fields[deleteIndex];
    const next = fields.filter((_, i) => i !== deleteIndex);
    setDeleteIndex(null);
    onChange(next);
    toast.success(
      `"${field.label || field.id}" removed. Remember to save changes to publish.`,
    );
  };

  const handleModalSave = () => {
    if (!draft.label.trim()) {
      toast.error("Please enter a field label.");
      return;
    }
    if (editingIndex === null) {
      const field: FeedbackFieldConfig = {
        ...draft,
        id: uniqueId(draft.label, fields),
      };
      onChange([...fields, field]);
      toast.success("Field added. Remember to save changes to publish.");
    } else {
      const next = fields.map((f, i) =>
        i === editingIndex ? { ...draft, id: f.id } : f,
      );
      onChange(next);
      toast.success("Field saved. Remember to save changes to publish.");
    }
    setModalOpen(false);
  };

  return (
    <>
      {/* Header row */}
      <div className="flex items-center gap-3">
        <h4 className="m-0 text-[0.95rem] font-bold text-(--admin-ink)">
          Fields ({fields.length})
        </h4>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={() => openModal(null)}
        >
          <Plus size={14} /> Add field
        </button>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                FIELD LABEL
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                TYPE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                REQUIRED
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <p className="text-[var(--admin-muted)] mb-3">
                    No form fields yet. Add one to get started.
                  </p>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary admin-btn--sm"
                    onClick={() => openModal(null)}
                  >
                    <Plus size={14} /> Add field
                  </button>
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field, i) => (
                <TableRow
                  key={field.id}
                  className="hover:bg-[#fafbfe] transition-colors"
                >
                  <TableCell className="text-sm py-3 font-medium">
                    {field.label || field.id}
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <span className="badge badge--blue lowercase">
                      {TYPE_LABEL[field.type] ?? field.type}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    {field.required ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Check size={15} strokeWidth={3} />
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
                        aria-label="Move up"
                        onClick={() => moveField(i, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="act-btn"
                        aria-label="Move down"
                        onClick={() => moveField(i, 1)}
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
              {editingIndex === null ? "Add Field" : "Edit Field"}
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
                <label htmlFor="field-label">Field Label</label>
                <input
                  id="field-label"
                  type="text"
                  value={draft.label}
                  onChange={(e) => setDraftField("label", e.target.value)}
                  placeholder="e.g. Your name, Email, Category…"
                  autoFocus
                />
                <span className="hint mt-2">
                  Shown to students on the public form. A system identifier is
                  generated automatically.
                </span>
              </div>

              <div className="field">
                <label htmlFor="field-type">Type</label>
                <select
                  id="field-type"
                  value={draft.type}
                  onChange={(e) =>
                    setDraftField("type", e.target.value as FeedbackFieldType)
                  }
                >
                  {FEEDBACK_FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_LABEL[t]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field field--full">
                <label className="flex items-center gap-2 font-medium text-(--admin-ink)">
                  <input
                    id="field-required"
                    type="checkbox"
                    className="h-4 w-4 accent-[#51B747]"
                    checked={draft.required}
                    onChange={(e) => setDraftField("required", e.target.checked)}
                  />
                  Required field
                </label>
                <span className="hint">
                  When enabled, students must fill this field to submit.
                </span>
              </div>

              {draft.type === "select" ||
              draft.type === "radio" ||
              draft.type === "checkbox-group" ? (
                <div className="field field--full">
                  <label htmlFor="field-options">Options — one per line</label>
                  <textarea
                    id="field-options"
                    rows={5}
                    placeholder={"General\nAcademics\nFacilities"}
                    value={(draft.options ?? []).join("\n")}
                    onChange={(e) =>
                      setDraftField(
                        "options",
                        e.target.value
                          .split("\n")
                          .map((l) => l.trim())
                          .filter(Boolean),
                      )
                    }
                  />
                </div>
              ) : null}

              {draft.type === "number" || draft.type === "rating" ? (
                <div className="field field--full">
                  <label>Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={draft.min ?? ""}
                      onChange={(e) =>
                        setDraftField(
                          "min",
                          e.target.value === "" ? undefined : Number(e.target.value),
                        )
                      }
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={draft.max ?? (draft.type === "rating" ? 5 : "")}
                      onChange={(e) =>
                        setDraftField(
                          "max",
                          e.target.value === "" ? undefined : Number(e.target.value),
                        )
                      }
                      placeholder={draft.type === "rating" ? "Max (stars)" : "Max"}
                    />
                  </div>
                </div>
              ) : null}

              {draft.type !== "checkbox" ? (
                <div className="field field--full">
                  <label htmlFor="field-placeholder">Placeholder (optional)</label>
                  <input
                    id="field-placeholder"
                    type="text"
                    value={draft.placeholder ?? ""}
                    onChange={(e) => setDraftField("placeholder", e.target.value)}
                    placeholder="e.g. How should we address you?"
                  />
                </div>
              ) : null}

              <div className="field field--full">
                <label htmlFor="field-hint">Hint (optional)</label>
                <input
                  id="field-hint"
                  type="text"
                  value={draft.hint ?? ""}
                  onChange={(e) => setDraftField("hint", e.target.value)}
                  placeholder="e.g. Optional, for follow-up"
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
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={handleModalSave}
            >
              <Save size={16} />
              {editingIndex === null ? "Add Field" : "Save Changes"}
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
        title="Delete Field?"
        description="Are you sure you want to delete this field? Students will no longer see it on the form."
        itemName={deleteIndex !== null ? fields[deleteIndex]?.label : undefined}
        confirmText="Delete Field"
      />
    </>
  );
}