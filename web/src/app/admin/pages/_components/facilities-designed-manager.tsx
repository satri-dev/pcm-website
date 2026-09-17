"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Save, X } from "lucide-react";
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
import ImageUpload from "@/components/cloudinary/ImageUpload";
import RichTextEditor from "../../_components/editor/rich-text-editor";

export interface FacilitiesDesignedData {
  designedEyebrow: string;
  designedTitle: string;
  designedParagraph: string;
  designedChecklist: string[];
  designedImage: string;
  designedImageAlt: string;
  designedBadgeValue: string;
  designedBadgeLabel: string;
}

interface FacilitiesDesignedManagerProps {
  data: FacilitiesDesignedData;
  onSave: (draft: FacilitiesDesignedData) => Promise<void>;
}

const IMAGE_URL_RE =
  /^(data:image\/|https?:\/\/.+\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$)/i;

function descToHtml(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^<(?:p|h[1-6]|ul|ol|blockquote)[\s>]/i.test(trimmed)
    ? value
    : `<p>${value}</p>`;
}

export default function FacilitiesDesignedManager({
  data,
  onSave,
}: FacilitiesDesignedManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState<FacilitiesDesignedData>({ ...data });

  const openModal = () => {
    setDraft({ ...data });
    setModalOpen(true);
  };

  const setDraftField = <K extends keyof FacilitiesDesignedData>(
    key: K,
    value: FacilitiesDesignedData[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const hasData = Boolean(data.designedEyebrow || data.designedTitle);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanedDraft = {
        ...draft,
        designedChecklist: draft.designedChecklist
          .map((l) => l.trim())
          .filter(Boolean),
      };
      await onSave(cleanedDraft);
      toast.success("Designed for Learning section saved.");
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
      {/* Table view */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                EYEBROW
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                TITLE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                IMAGE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                BADGE LABEL
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!hasData ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <p className="text-[var(--admin-muted)] mb-3">
                    No &quot;Designed for Learning&quot; content yet.
                  </p>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary admin-btn--sm"
                    onClick={openModal}
                  >
                    <Plus size={14} /> Add Content
                  </button>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow className="hover:bg-[#fafbfe] transition-colors">
                <TableCell className="text-sm py-3">
                  {data.designedEyebrow || "—"}
                </TableCell>
                <TableCell className="text-sm py-3 font-medium">
                  {data.designedTitle || "—"}
                </TableCell>
                <TableCell className="py-3">
                  {data.designedImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.designedImage}
                      alt={data.designedImageAlt}
                      className="h-10 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <span className="text-[var(--admin-muted)]">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm py-3">
                  {data.designedBadgeLabel || "—"}
                </TableCell>
                <TableCell className="py-3">
                  <div className="row-actions justify-end">
                    <button
                      type="button"
                      className="act-btn"
                      onClick={openModal}
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
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
              Designed for Learning — Edit Content
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
              <div className="form-section">
                <b>Headline</b>
              </div>

              <div className="field">
                <label htmlFor="designed-eyebrow">Eyebrow</label>
                <input
                  id="designed-eyebrow"
                  type="text"
                  value={draft.designedEyebrow}
                  onChange={(e) =>
                    setDraftField("designedEyebrow", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="designed-title">Title</label>
                <input
                  id="designed-title"
                  type="text"
                  value={draft.designedTitle}
                  onChange={(e) =>
                    setDraftField("designedTitle", e.target.value)
                  }
                />
              </div>

              <div className="form-section">
                <b>Content</b>
              </div>

              <div className="field field--full">
                <label htmlFor="designed-paragraph">Paragraph</label>
                <RichTextEditor
                  content={descToHtml(draft.designedParagraph)}
                  onChange={(html) => setDraftField("designedParagraph", html)}
                  placeholder="Write the paragraph here..."
                />
              </div>

              <div className="field field--full">
                <label htmlFor="designed-checklist">
                  Checklist — one item per line
                </label>
                <textarea
                  id="designed-checklist"
                  rows={4}
                  placeholder={"Modern lecture halls\nComputer labs\nLibrary"}
                  value={draft.designedChecklist.join("\n")}
                  onChange={(e) =>
                    setDraftField("designedChecklist", e.target.value.split("\n"))
                  }
                />
              </div>

              <div className="form-section">
                <b>Badge</b>
              </div>

              <div className="field">
                <label htmlFor="designed-badge-value">Badge Value</label>
                <input
                  id="designed-badge-value"
                  type="text"
                  value={draft.designedBadgeValue}
                  onChange={(e) =>
                    setDraftField("designedBadgeValue", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="designed-badge-label">Badge Label</label>
                <input
                  id="designed-badge-label"
                  type="text"
                  value={draft.designedBadgeLabel}
                  onChange={(e) =>
                    setDraftField("designedBadgeLabel", e.target.value)
                  }
                />
              </div>

              <div className="form-section">
                <b>Image</b>
              </div>

              <div className="field field--full">
                <label>Image URL</label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <ImageUpload
                      onUpload={(r) => {
                        setDraftField("designedImage", r.secure_url);
                        setDraftField(
                          "designedImageAlt",
                          "PCM learning resource centre",
                        );
                      }}
                    />
                    <span className="text-[0.85rem] text-[var(--admin-muted)]">
                      or paste URL below
                    </span>
                  </div>
                  <input
                    type="text"
                    value={draft.designedImage}
                    onChange={(e) =>
                      setDraftField("designedImage", e.target.value)
                    }
                    placeholder="Or paste image URL here..."
                    className="w-full"
                  />
                </div>

                {draft.designedImage &&
                  (IMAGE_URL_RE.test(draft.designedImage) ? (
                    <div className="img-prev mt-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={draft.designedImage} alt="" />
                    </div>
                  ) : (
                    <div className="img-prev mt-3">
                      <span className="badge badge--blue">
                        {draft.designedImage.split("/").pop() || ""}
                      </span>
                    </div>
                  ))}

                <span className="hint mt-2">
                  Upload via Cloudinary (max 5MB) or paste a URL
                </span>
              </div>

              <div className="field field--full">
                <label htmlFor="designed-image-alt">Image Alt Text</label>
                <input
                  id="designed-image-alt"
                  type="text"
                  value={draft.designedImageAlt}
                  onChange={(e) =>
                    setDraftField("designedImageAlt", e.target.value)
                  }
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