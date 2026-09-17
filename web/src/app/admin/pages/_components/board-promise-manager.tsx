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

export interface BoardPromiseData {
  promiseEyebrow: string;
  promiseTitle: string;
  promiseParagraphs: string[];
  promiseChecklist: string[];
  promiseImageSrc: string;
  promiseImageAlt: string;
  promiseBadgeValue: string;
  promiseBadgeLabel: string;
}

interface BoardPromiseManagerProps {
  data: BoardPromiseData;
  onSave: (draft: BoardPromiseData) => Promise<void>;
}

const IMAGE_URL_RE =
  /^(data:image\/|https?:\/\/.+\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$)/i;

function paragraphBlocks(html: string): string[] {
  const trimmed = html.trim();
  if (!trimmed) return [];
  const blocks = trimmed.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
  if (blocks && blocks.length) {
    return blocks;
  }
  return trimmed
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function paragraphHtml(items: string[]): string {
  return items
    .filter((p) => p && p.trim())
    .map((p) => (/^<(?:p|h[1-6]|ul|ol|blockquote)[\s>]/i.test(p.trim()) ? p : `<p>${p}</p>`))
    .join("");
}

export default function BoardPromiseManager({
  data,
  onSave,
}: BoardPromiseManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState<BoardPromiseData>({ ...data });

  const openModal = () => {
    setDraft({ ...data });
    setModalOpen(true);
  };

  const setDraftField = <K extends keyof BoardPromiseData>(
    key: K,
    value: BoardPromiseData[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const hasData = Boolean(data.promiseEyebrow || data.promiseTitle);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanedDraft = {
        ...draft,
        promiseChecklist: draft.promiseChecklist
          .map((l) => l.trim())
          .filter(Boolean),
      };
      await onSave(cleanedDraft);
      toast.success("Our Promise section saved.");
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
                BADGE VALUE
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
                <TableCell colSpan={6} className="text-center py-10">
                  <p className="text-[var(--admin-muted)] mb-3">
                    No &quot;Our Promise&quot; content yet.
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
                  {data.promiseEyebrow || "—"}
                </TableCell>
                <TableCell className="text-sm py-3 font-medium">
                  {data.promiseTitle || "—"}
                </TableCell>
                <TableCell className="py-3">
                  {data.promiseImageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.promiseImageSrc}
                      alt={data.promiseImageAlt}
                      className="h-10 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <span className="text-[var(--admin-muted)]">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm py-3">
                  {data.promiseBadgeValue || "—"}
                </TableCell>
                <TableCell className="text-sm py-3">
                  {data.promiseBadgeLabel || "—"}
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
              Our Promise — Edit Content
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
                <label htmlFor="promise-eyebrow">Eyebrow</label>
                <input
                  id="promise-eyebrow"
                  type="text"
                  value={draft.promiseEyebrow}
                  onChange={(e) =>
                    setDraftField("promiseEyebrow", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="promise-title">Title</label>
                <input
                  id="promise-title"
                  type="text"
                  value={draft.promiseTitle}
                  onChange={(e) =>
                    setDraftField("promiseTitle", e.target.value)
                  }
                />
              </div>

              <div className="form-section">
                <b>Content</b>
              </div>

              <div className="field field--full">
                <label htmlFor="promise-paragraphs">Paragraphs</label>
                <RichTextEditor
                  content={paragraphHtml(draft.promiseParagraphs)}
                  onChange={(html) =>
                    setDraftField("promiseParagraphs", paragraphBlocks(html))
                  }
                  placeholder="Write paragraphs here..."
                />
              </div>

              <div className="field field--full">
                <label htmlFor="promise-checklist">
                  Checklist Items — one per line
                </label>
                <textarea
                  id="promise-checklist"
                  rows={5}
                  placeholder={"Regular curriculum reviews\nTransparent admissions\nInvest in students"}
                  value={draft.promiseChecklist.join("\n")}
                  onChange={(e) =>
                    setDraftField(
                      "promiseChecklist",
                      e.target.value.split("\n"),
                    )
                  }
                />
              </div>

              <div className="form-section">
                <b>Badge</b>
              </div>

              <div className="field">
                <label htmlFor="promise-badge-value">Badge Value</label>
                <input
                  id="promise-badge-value"
                  type="text"
                  value={draft.promiseBadgeValue}
                  onChange={(e) =>
                    setDraftField("promiseBadgeValue", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="promise-badge-label">Badge Label</label>
                <input
                  id="promise-badge-label"
                  type="text"
                  value={draft.promiseBadgeLabel}
                  onChange={(e) =>
                    setDraftField("promiseBadgeLabel", e.target.value)
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
                        setDraftField("promiseImageSrc", r.secure_url);
                        setDraftField(
                          "promiseImageAlt",
                          "The PCM campus in Nadipur",
                        );
                      }}
                    />
                    <span className="text-[0.85rem] text-[var(--admin-muted)]">
                      or paste URL below
                    </span>
                  </div>
                  <input
                    type="text"
                    value={draft.promiseImageSrc}
                    onChange={(e) =>
                      setDraftField("promiseImageSrc", e.target.value)
                    }
                    placeholder="Or paste image URL here..."
                    className="w-full"
                  />
                </div>

                {draft.promiseImageSrc &&
                  (IMAGE_URL_RE.test(draft.promiseImageSrc) ? (
                    <div className="img-prev mt-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={draft.promiseImageSrc} alt="" />
                    </div>
                  ) : (
                    <div className="img-prev mt-3">
                      <span className="badge badge--blue">
                        {draft.promiseImageSrc.split("/").pop() || ""}
                      </span>
                    </div>
                  ))}

                <span className="hint mt-2">
                  Upload via Cloudinary (max 5MB) or paste a URL
                </span>
              </div>

              <div className="field field--full">
                <label htmlFor="promise-image-alt">Image Alt Text</label>
                <input
                  id="promise-image-alt"
                  type="text"
                  value={draft.promiseImageAlt}
                  onChange={(e) =>
                    setDraftField("promiseImageAlt", e.target.value)
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