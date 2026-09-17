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

export interface AlumniFamilyData {
  familyEyebrow: string;
  familyTitle: string;
  familyParagraphs: string[];
  familyPills: string[];
  familyImageSrc: string;
  familyImageAlt: string;
  badgeValue: string;
  badgeLabel: string;
}

interface AlumniFamilyManagerProps {
  data: AlumniFamilyData;
  onSave: (draft: AlumniFamilyData) => Promise<void>;
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
    .map((p) =>
      /^<(?:p|h[1-6]|ul|ol|blockquote)[\s>]/i.test(p.trim())
        ? p
        : `<p>${p}</p>`
    )
    .join("");
}

export default function AlumniFamilyManager({
  data,
  onSave,
}: AlumniFamilyManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState<AlumniFamilyData>({ ...data });

  const openModal = () => {
    setDraft({ ...data });
    setModalOpen(true);
  };

  const setDraftField = <K extends keyof AlumniFamilyData>(
    key: K,
    value: AlumniFamilyData[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const hasData = Boolean(data.familyEyebrow || data.familyTitle);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanedDraft = {
        ...draft,
        familyParagraphs: draft.familyParagraphs
          .map((l) => l.trim())
          .filter(Boolean),
        familyPills: draft.familyPills.map((l) => l.trim()).filter(Boolean),
      };
      await onSave(cleanedDraft);
      toast.success("Alumni Family section saved.");
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
                BADGE VALUE
              </TableHead>
              <TableHead className="text-[var(--admin-muted)] hover:text-[var(--admin-brand)] font-bold text-[0.72rem] uppercase tracking-wider bg-[var(--admin-surface-2)] transition-colors">
                BADGE LABEL
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
                    No &quot;Alumni Family — Split Intro&quot; content yet.
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
                  {data.familyEyebrow || "—"}
                </TableCell>
                <TableCell className="text-sm py-3 font-medium">
                  {data.familyTitle || "—"}
                </TableCell>
                <TableCell className="text-sm py-3">
                  <span className="badge badge--blue">
                    {data.badgeValue || "—"}
                  </span>
                </TableCell>
                <TableCell className="text-sm py-3">
                  {data.badgeLabel || "—"}
                </TableCell>
                <TableCell className="py-3">
                  {data.familyImageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.familyImageSrc}
                      alt={data.familyImageAlt}
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
              Alumni Family — Split Intro, Edit Content
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
                <label htmlFor="family-eyebrow">Eyebrow</label>
                <input
                  id="family-eyebrow"
                  type="text"
                  value={draft.familyEyebrow}
                  onChange={(e) =>
                    setDraftField("familyEyebrow", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="family-title">Title</label>
                <input
                  id="family-title"
                  type="text"
                  value={draft.familyTitle}
                  onChange={(e) =>
                    setDraftField("familyTitle", e.target.value)
                  }
                />
              </div>

              <div className="form-section">
                <b>Content</b>
              </div>

              <div className="field field--full">
                <label htmlFor="family-paragraphs">Paragraphs</label>
                <RichTextEditor
                  content={paragraphHtml(draft.familyParagraphs)}
                  onChange={(html) =>
                    setDraftField("familyParagraphs", paragraphBlocks(html))
                  }
                  placeholder="Write the paragraphs here... Press Enter to start a new paragraph."
                />
              </div>

              <div className="field field--full">
                <label htmlFor="family-pills">
                  Pills / Badges — one per line
                </label>
                <textarea
                  id="family-pills"
                  rows={4}
                  placeholder={"1000+ Graduates\nBanking & Finance\nTechnology"}
                  value={draft.familyPills.join("\n")}
                  onChange={(e) =>
                    setDraftField("familyPills", e.target.value.split("\n"))
                  }
                />
                <span className="hint">
                  Press Enter after each pill to add the next one.
                </span>
              </div>

              <div className="form-section">
                <b>Badge</b>
              </div>

              <div className="field">
                <label htmlFor="family-badge-value">Badge Value</label>
                <input
                  id="family-badge-value"
                  type="text"
                  value={draft.badgeValue}
                  onChange={(e) =>
                    setDraftField("badgeValue", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="family-badge-label">Badge Label</label>
                <input
                  id="family-badge-label"
                  type="text"
                  value={draft.badgeLabel}
                  onChange={(e) =>
                    setDraftField("badgeLabel", e.target.value)
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
                        setDraftField("familyImageSrc", r.secure_url);
                        setDraftField(
                          "familyImageAlt",
                          "PCM graduates in caps and gowns",
                        );
                      }}
                    />
                    <span className="text-[0.85rem] text-[var(--admin-muted)]">
                      or paste URL below
                    </span>
                  </div>
                  <input
                    type="text"
                    value={draft.familyImageSrc}
                    onChange={(e) =>
                      setDraftField("familyImageSrc", e.target.value)
                    }
                    placeholder="Or paste image URL here..."
                    className="w-full"
                  />
                </div>

                {draft.familyImageSrc &&
                  (IMAGE_URL_RE.test(draft.familyImageSrc) ? (
                    <div className="img-prev mt-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={draft.familyImageSrc} alt="" />
                    </div>
                  ) : (
                    <div className="img-prev mt-3">
                      <span className="badge badge--blue">
                        {draft.familyImageSrc.split("/").pop() || ""}
                      </span>
                    </div>
                  ))}

                <span className="hint mt-2">
                  Upload via Cloudinary (max 5MB) or paste a URL
                </span>
              </div>

              <div className="field field--full">
                <label htmlFor="family-image-alt">Image Alt Text</label>
                <input
                  id="family-image-alt"
                  type="text"
                  value={draft.familyImageAlt}
                  onChange={(e) =>
                    setDraftField("familyImageAlt", e.target.value)
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