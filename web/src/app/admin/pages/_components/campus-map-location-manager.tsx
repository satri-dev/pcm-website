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

export interface LocationSplitData {
  locationEyebrow: string;
  locationTitle: string;
  locationParagraph: string;
  locationChecklist: string[];
  locationImage: string;
  locationImageAlt: string;
  locationBadgeValue: string;
  locationBadgeLabel: string;
  directionsButtonLabel: string;
  directionsButtonHref: string;
}

interface LocationSplitManagerProps {
  data: LocationSplitData;
  onSave: (draft: LocationSplitData) => Promise<void>;
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

export default function CampusMapLocationManager({
  data,
  onSave,
}: LocationSplitManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState<LocationSplitData>({ ...data });

  const openModal = () => {
    setDraft({ ...data });
    setModalOpen(true);
  };

  const setDraftField = <K extends keyof LocationSplitData>(
    key: K,
    value: LocationSplitData[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const hasData = Boolean(data.locationEyebrow || data.locationTitle);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanedDraft = {
        ...draft,
        locationChecklist: draft.locationChecklist
          .map((l) => l.trim())
          .filter(Boolean),
      };
      await onSave(cleanedDraft);
      toast.success("Location split section saved.");
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
                <TableCell colSpan={5} className="text-center py-10">
                  <p className="text-[var(--admin-muted)] mb-3">
                    No &quot;Location — Split&quot; content yet.
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
                  {data.locationEyebrow || "—"}
                </TableCell>
                <TableCell className="text-sm py-3 font-medium">
                  {data.locationTitle || "—"}
                </TableCell>
                <TableCell className="text-sm py-3">
                  <span className="badge badge--blue">
                    {data.locationBadgeValue || "—"}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  {data.locationImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.locationImage}
                      alt={data.locationImageAlt}
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
              Location — Split Section, Edit Content
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
                <label htmlFor="location-eyebrow">Eyebrow</label>
                <input
                  id="location-eyebrow"
                  type="text"
                  value={draft.locationEyebrow}
                  onChange={(e) =>
                    setDraftField("locationEyebrow", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="location-title">Title</label>
                <input
                  id="location-title"
                  type="text"
                  value={draft.locationTitle}
                  onChange={(e) =>
                    setDraftField("locationTitle", e.target.value)
                  }
                />
              </div>

              <div className="form-section">
                <b>Content</b>
              </div>

              <div className="field field--full">
                <label htmlFor="location-paragraph">Paragraph</label>
                <RichTextEditor
                  content={descToHtml(draft.locationParagraph)}
                  onChange={(html) => setDraftField("locationParagraph", html)}
                  placeholder="Write the paragraph here..."
                />
              </div>

              <div className="field field--full">
                <label htmlFor="location-checklist">
                  Checklist — one item per line
                </label>
                <textarea
                  id="location-checklist"
                  rows={4}
                  placeholder={"10 minutes from Lakeside by vehicle\nClose to Buses Park"}
                  value={draft.locationChecklist.join("\n")}
                  onChange={(e) =>
                    setDraftField(
                      "locationChecklist",
                      e.target.value.split("\n"),
                    )
                  }
                />
              </div>

              <div className="form-section">
                <b>Badge</b>
              </div>

              <div className="field">
                <label htmlFor="location-badge-value">Badge Value</label>
                <input
                  id="location-badge-value"
                  type="text"
                  value={draft.locationBadgeValue}
                  onChange={(e) =>
                    setDraftField("locationBadgeValue", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="location-badge-label">Badge Label</label>
                <input
                  id="location-badge-label"
                  type="text"
                  value={draft.locationBadgeLabel}
                  onChange={(e) =>
                    setDraftField("locationBadgeLabel", e.target.value)
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
                        setDraftField("locationImage", r.secure_url);
                        setDraftField(
                          "locationImageAlt",
                          "PCM campus at Nadipur, Pokhara",
                        );
                      }}
                    />
                    <span className="text-[0.85rem] text-[var(--admin-muted)]">
                      or paste URL below
                    </span>
                  </div>
                  <input
                    type="text"
                    value={draft.locationImage}
                    onChange={(e) =>
                      setDraftField("locationImage", e.target.value)
                    }
                    placeholder="Or paste image URL here..."
                    className="w-full"
                  />
                </div>

                {draft.locationImage &&
                  (IMAGE_URL_RE.test(draft.locationImage) ? (
                    <div className="img-prev mt-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={draft.locationImage} alt="" />
                    </div>
                  ) : (
                    <div className="img-prev mt-3">
                      <span className="badge badge--blue">
                        {draft.locationImage.split("/").pop() || ""}
                      </span>
                    </div>
                  ))}

                <span className="hint mt-2">
                  Upload via Cloudinary (max 5MB) or paste a URL
                </span>
              </div>

              <div className="field field--full">
                <label htmlFor="location-image-alt">Image Alt Text</label>
                <input
                  id="location-image-alt"
                  type="text"
                  value={draft.locationImageAlt}
                  onChange={(e) =>
                    setDraftField("locationImageAlt", e.target.value)
                  }
                />
              </div>

              <div className="form-section">
                <b>Directions Button</b>
              </div>

              <div className="field">
                <label htmlFor="location-directions-label">
                  Button Label
                </label>
                <input
                  id="location-directions-label"
                  type="text"
                  value={draft.directionsButtonLabel}
                  onChange={(e) =>
                    setDraftField("directionsButtonLabel", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="location-directions-href">Button Link</label>
                <input
                  id="location-directions-href"
                  type="text"
                  value={draft.directionsButtonHref}
                  onChange={(e) =>
                    setDraftField("directionsButtonHref", e.target.value)
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