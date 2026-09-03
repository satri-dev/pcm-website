"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Notice } from "@/types/notices";
import { Save, X, FileText } from "lucide-react";
import DocumentUpload from "@/components/cloudinary/DocumentUpload";

const noticeSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200),
  slug: z
    .string()
    .min(1, "This field is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description too long"),
  category: z.string().min(1, "This field is required").max(100),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["published", "draft"]),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

type NoticeSchema = z.infer<typeof noticeSchema>;

interface NoticeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: Notice | null;
  onSave: (notice: Notice) => void;
  saving?: boolean;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function NoticeFormModal({
  open,
  onOpenChange,
  notice,
  onSave,
  saving = false,
}: NoticeFormModalProps) {
  const [fileError, setFileError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NoticeSchema>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "General",
      date: todayISO(),
      status: "draft",
      fileUrl: "",
      fileName: "",
    },
  });

  const fileUrl = watch("fileUrl");

  // Auto-generate slug from title
  const titleValue = watch("title");
  useEffect(() => {
    if (!notice && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 100)
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, notice, setValue]);

  // Load notice data when editing
  useEffect(() => {
    setFileError("");
    if (notice) {
      reset({
        title: notice.title,
        slug: notice.slug,
        description: notice.description,
        category: notice.category,
        date: notice.date,
        status: notice.status,
        fileUrl: notice.fileUrl || "",
        fileName: notice.fileName || "",
      });
    } else {
      reset({
        title: "",
        slug: "",
        description: "",
        category: "General",
        date: todayISO(),
        status: "draft",
        fileUrl: "",
        fileName: "",
      });
    }
  }, [notice, reset, open]);

  const removeFile = () => {
    setValue("fileUrl", "");
    setValue("fileName", "");
  };

  const onSubmit = async (data: NoticeSchema) => {
    const noticeData: Notice = {
      id: notice?.id || `notice-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      description: data.description,
      category: data.category,
      date: data.date,
      status: data.status,
      views: notice?.views || 0,
      fileUrl: data.fileUrl || undefined,
      fileName: data.fileName || undefined,
      createdAt: notice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(noticeData);
  };

  const fieldValue = (key: keyof NoticeSchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Head */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {notice ? "Edit Notice" : "Add Notice"}
          </DialogTitle>
          <button
            type="button"
            className="admin-icon-btn"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Body */}
          <div className="modal__body">
            <div className="form-grid">
              <div className="form-section">
                <b>Details</b>
              </div>

              <div className={fieldValue("title")}>
                <label htmlFor="notice-title">
                  Title <span className="req">*</span>
                </label>
                <input id="notice-title" type="text" {...register("title")} />
                {errors.title && (
                  <div className="field__err">{errors.title.message}</div>
                )}
              </div>

              <div className={fieldValue("category")}>
                <label htmlFor="notice-category">
                  Category <span className="req">*</span>
                </label>
                <input 
                  id="notice-category" 
                  type="text"
                  placeholder="e.g., General, Academic, Event..."
                  {...register("category")}
                />
                {errors.category && (
                  <div className="field__err">{errors.category.message}</div>
                )}
              </div>

              <div className={fieldValue("date")}>
                <label htmlFor="notice-date">
                  Date <span className="req">*</span>
                </label>
                <input
                  id="notice-date"
                  type="date"
                  {...register("date")}
                />
                {errors.date && (
                  <div className="field__err">{errors.date.message}</div>
                )}
              </div>

              <div className="field">
                <label htmlFor="notice-views">Views</label>
                <input
                  id="notice-views"
                  type="number"
                  value={notice?.views || 0}
                  disabled
                  className="bg-[var(--admin-surface-2)]"
                />
              </div>

              <div
                className={`field field--full ${
                  errors.description ? "is-invalid" : ""
                }`}
              >
                <label htmlFor="notice-description">
                  Description <span className="req">*</span>
                </label>
                <textarea
                  id="notice-description"
                  rows={4}
                  {...register("description")}
                  placeholder="Brief description of the notice..."
                />
                {errors.description && (
                  <div className="field__err">
                    {errors.description.message}
                  </div>
                )}
              </div>

              <div className="form-section">
                <b>Attachment</b>
              </div>

              <div
                className={`field field--full ${
                  fileError ? "is-invalid" : ""
                }`}
              >
                <label>Notice File (PDF/DOC)</label>
                <div className="flex flex-col gap-3">
                  {/* Cloudinary Document Upload */}
                  <div className="flex items-center gap-2">
                    <DocumentUpload
                      onUpload={(result) => {
                        setValue("fileUrl", result.secure_url);
                        setValue("fileName", `${result.original_filename}.${result.format}`);
                        setFileError("");
                      }}
                    />
                    <span className="text-[0.85rem] text-[var(--admin-muted)]">
                      Upload to Cloudinary (max 5MB)
                    </span>
                  </div>

                  {/* Direct URL Input (for external links only) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[0.85rem] text-[var(--admin-muted)]">
                      Or enter direct URL (https://...)
                    </label>
                    <input
                      type="url"
                      {...register("fileUrl")}
                      placeholder="https://example.com/document.pdf"
                      className="w-full"
                      onChange={(e) => {
                        const url = e.target.value;
                        // Only allow HTTP URLs, not base64 data
                        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                          setFileError("Please enter a valid URL starting with http:// or https://");
                        } else {
                          setFileError("");
                        }
                      }}
                    />
                  </div>
                </div>

                {/* File Preview */}
                {fileUrl && fileUrl.startsWith('http') && (
                  <div className="img-prev mt-3">
                    <span className="badge badge--blue inline-flex items-center gap-1">
                      <FileText size={12} />
                      {watch("fileName") || "Attached file"}
                    </span>
                  </div>
                )}

                {/* Remove File Button */}
                {fileUrl && (
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm admin-btn--ghost text-[var(--admin-red)] border-[rgba(214,69,69,0.3)] hover:border-[rgba(214,69,69,0.3)] mt-2"
                    onClick={removeFile}
                  >
                    <X size={13} />
                    Remove
                  </button>
                )}

                <span className="hint mt-2">
                  Upload via Cloudinary or provide a direct URL to an existing document
                </span>
                {fileError && <div className="field__err">{fileError}</div>}
              </div>

              <div className="form-section">
                <b>Publishing</b>
              </div>

              <div className={fieldValue("status")}>
                <label htmlFor="notice-status">Status</label>
                <select id="notice-status" {...register("status")}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                {errors.status && (
                  <div className="field__err">{errors.status.message}</div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
            >
              <Save size={16} />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
