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

export interface WhyJoinData {
  whyEyebrow: string;
  whyTitle: string;
  whyParagraph: string;
  whyChecklist: string[];
  whyImage: string;
  whyImageAlt: string;
  whyBadgeValue: string;
  whyBadgeLabel: string;
}

interface WhyJoinManagerProps {
  data: WhyJoinData;
  onSave: (draft: WhyJoinData) => Promise<void>;
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

export default function WhyJoinManager({
  data,
  onSave,
}: WhyJoinManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState<WhyJoinData>({ ...data });

  const openModal = () => {
    setDraft({ ...data });
    setModalOpen(true);
  };

  const setDraftField = <K extends keyof WhyJoinData>(
    key: K,
    value: WhyJoinData[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const hasData = Boolean(data.whyEyebrow || data.whyTitle);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanedDraft = {
        ...draft,
        whyChecklist: draft.whyChecklist
          .map((l) => l.trim())
          .filter(Boolean),
      };
      await onSave(cleanedDraft);
      toast.success("Why Join section saved.");
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
                BADGE LABEL
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                BADGE VALUE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                IMAGE
              </TableHead>
              <TableHead className="text-right text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!hasData ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <p className="text-[var(--admin-muted)] mb-3">
                    No &quot;Why Join — Split&quot; content yet.
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
                  {data.whyEyebrow || "—"}
                </TableCell>
                <TableCell className="text-sm py-3 font-medium">
                  {data.whyTitle || "—"}
                </TableCell>
                <TableCell className="text-sm py-3">
                  {data.whyBadgeLabel || "—"}
                </TableCell>
                <TableCell className="text-sm py-3">
                  <span className="badge badge--blue">
                    {data.whyBadgeValue || "—"}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  {data.whyImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.whyImage}
                      alt={data.whyImageAlt}
                      className="h-10 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <span className="text-[var(--admin-muted)]">—</span>
                  )}
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
              Why Join — Split Section, Edit Content
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
                <label htmlFor="why-eyebrow">Eyebrow</label>
                <input
                  id="why-eyebrow"
                  type="text"
                  value={draft.whyEyebrow}
                  onChange={(e) =>
                    setDraftField("whyEyebrow", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="why-title">Title</label>
                <input
                  id="why-title"
                  type="text"
                  value={draft.whyTitle}
                  onChange={(e) => setDraftField("whyTitle", e.target.value)}
                />
              </div>

              <div className="form-section">
                <b>Content</b>
              </div>

              <div className="field field--full">
                <label htmlFor="why-paragraph">Paragraph</label>
                <RichTextEditor
                  content={descToHtml(draft.whyParagraph)}
                  onChange={(html) => setDraftField("whyParagraph", html)}
                  placeholder="Write the paragraph here..."
                />
              </div>

              <div className="field field--full">
                <label htmlFor="why-checklist">
                  Checklist — one item per line
                </label>
                <textarea
                  id="why-checklist"
                  rows={4}
                  placeholder={"Run real events — fests, seminars and competitions"}
                  value={draft.whyChecklist.join("\n")}
                  onChange={(e) =>
                    setDraftField("whyChecklist", e.target.value.split("\n"))
                  }
                />
              </div>

              <div className="form-section">
                <b>Badge</b>
              </div>

              <div className="field">
                <label htmlFor="why-badge-value">Badge Value</label>
                <input
                  id="why-badge-value"
                  type="text"
                  value={draft.whyBadgeValue}
                  onChange={(e) =>
                    setDraftField("whyBadgeValue", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="why-badge-label">Badge Label</label>
                <input
                  id="why-badge-label"
                  type="text"
                  value={draft.whyBadgeLabel}
                  onChange={(e) =>
                    setDraftField("whyBadgeLabel", e.target.value)
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
                        setDraftField("whyImage", r.secure_url);
                        setDraftField("whyImageAlt", "PCM club activities");
                      }}
                    />
                    <span className="text-[0.85rem] text-[var(--admin-muted)]">
                      or paste URL below
                    </span>
                  </div>
                  <input
                    type="text"
                    value={draft.whyImage}
                    onChange={(e) => setDraftField("whyImage", e.target.value)}
                    placeholder="Or paste image URL here..."
                    className="w-full"
                  />
                </div>

                {draft.whyImage &&
                  (IMAGE_URL_RE.test(draft.whyImage) ? (
                    <div className="img-prev mt-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={draft.whyImage} alt="" />
                    </div>
                  ) : (
                    <div className="img-prev mt-3">
                      <span className="badge badge--blue">
                        {draft.whyImage.split("/").pop() || ""}
                      </span>
                    </div>
                  ))}

                <span className="hint mt-2">
                  Upload via Cloudinary (max 5MB) or paste a URL
                </span>
              </div>

              <div className="field field--full">
                <label htmlFor="why-image-alt">Image Alt Text</label>
                <input
                  id="why-image-alt"
                  type="text"
                  value={draft.whyImageAlt}
                  onChange={(e) => setDraftField("whyImageAlt", e.target.value)}
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