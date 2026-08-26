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
import {
  Download,
  DOWNLOAD_CATEGORIES,
  DOWNLOAD_STATUSES,
} from "../types/download";
import { Save, X, FileText } from "lucide-react";
import DocumentUpload from "@/components/cloudinary/DocumentUpload";
import RichTextEditor from "@/app/admin/_components/editor/rich-text-editor";

const downloadSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500),
  category: z.enum([
    "Forms",
    "Syllabus",
    "Reports",
    "Certificates",
    "Brochures",
    "Applications",
    "Fee Structures",
    "Others",
  ]),
  fileUrl: z.string().min(1, "File is required"),
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.string().optional(),
  fileType: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["published", "draft"]),
});

type DownloadSchema = z.infer<typeof downloadSchema>;

interface DownloadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  download: Download | null;
  onSave: (download: Download) => void;
  saving?: boolean;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function DownloadFormModal({
  open,
  onOpenChange,
  download,
  onSave,
  saving = false,
}: DownloadFormModalProps) {
  const [fileError, setFileError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DownloadSchema>({
    resolver: zodResolver(downloadSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Forms",
      fileUrl: "",
      fileName: "",
      fileSize: "",
      fileType: "",
      date: todayISO(),
      status: "draft",
    },
  });

  const fileUrl = watch("fileUrl");
  const fileName = watch("fileName");
  const fileSize = watch("fileSize");

  useEffect(() => {
    setFileError("");
    if (download) {
      reset({
        title: download.title,
        description: download.description,
        category: download.category,
        fileUrl: download.fileUrl || "",
        fileName: download.fileName || "",
        fileSize: download.fileSize || "",
        fileType: download.fileType || "",
        date: download.date,
        status: download.status,
      });
    } else {
      reset({
        title: "",
        description: "",
        category: "Forms",
        fileUrl: "",
        fileName: "",
        fileSize: "",
        fileType: "",
        date: todayISO(),
        status: "draft",
      });
    }
  }, [download, reset, open]);

  const handleFileUpload = (result: {
    secure_url: string;
    original_filename: string;
    format: string;
    bytes?: number;
  }) => {
    setFileError("");
    setValue("fileUrl", result.secure_url);
    setValue("fileName", `${result.original_filename}.${result.format}`);
    setValue(
      "fileType",
      result.format.toUpperCase()
    );
    if (result.bytes) {
      const kb = result.bytes / 1024;
      const mb = kb / 1024;
      setValue(
        "fileSize",
        mb >= 1 ? `${mb.toFixed(1)} MB` : `${kb.toFixed(1)} KB`
      );
    }
  };

  const handleFileRemove = () => {
    setValue("fileUrl", "");
    setValue("fileName", "");
    setValue("fileSize", "");
    setValue("fileType", "");
  };

  const onSubmit = async (data: DownloadSchema) => {
    const downloadData: Download = {
      id: download?.id || `download-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      fileSize: data.fileSize,
      fileType: data.fileType,
      date: data.date,
      status: data.status,
      downloadCount: download?.downloadCount || 0,
      createdAt: download?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(downloadData);
  };

  const fieldValue = (key: keyof DownloadSchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {download ? "Edit Download" : "Add Download"}
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
          <div className="modal__body">
            <div className="form-grid">
              <div className="form-section">
                <b>Details</b>
              </div>

              <div className={fieldValue("title")}>
                <label htmlFor="download-title">
                  Title <span className="req">*</span>
                </label>
                <input
                  id="download-title"
                  type="text"
                  {...register("title")}
                />
                {errors.title && (
                  <div className="field__err">{errors.title.message}</div>
                )}
              </div>

              <div className={fieldValue("category")}>
                <label htmlFor="download-category">
                  Category <span className="req">*</span>
                </label>
                <select id="download-category" {...register("category")}>
                  <option value="">— Select —</option>
                  {DOWNLOAD_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="field__err">{errors.category.message}</div>
                )}
              </div>

              <div className={`field field--full ${errors.description ? "is-invalid" : ""}`}>
                <label>
                  Description <span className="req">*</span>
                </label>
                <RichTextEditor
                  content={watch("description") || ""}
                  onChange={(html) => setValue("description", html)}
                  placeholder="Write a description for this download..."
                />
                {errors.description && (
                  <div className="field__err">
                    {errors.description.message}
                  </div>
                )}
              </div>

              <div className={fieldValue("date")}>
                <label htmlFor="download-date">
                  Date <span className="req">*</span>
                </label>
                <input
                  id="download-date"
                  type="date"
                  {...register("date")}
                />
                {errors.date && (
                  <div className="field__err">{errors.date.message}</div>
                )}
              </div>

              <div className={fieldValue("status")}>
                <label htmlFor="download-status">
                  Status <span className="req">*</span>
                </label>
                <select id="download-status" {...register("status")}>
                  {DOWNLOAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s === "published" ? "Published" : "Draft"}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <div className="field__err">{errors.status.message}</div>
                )}
              </div>

              <div
                className={`field field--full ${
                  fileError || errors.fileUrl ? "is-invalid" : ""
                }`}
              >
                <label>
                  File <span className="req">*</span>
                </label>
                <div className="file-field">
                  <DocumentUpload onUpload={handleFileUpload} />
                </div>
                {fileUrl && fileUrl.startsWith("http") && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="badge badge--blue inline-flex items-center gap-1">
                      <FileText size={12} />
                      {fileName || "Attached file"}
                    </span>
                    {fileSize && (
                      <span className="text-xs text-[var(--admin-muted)]">
                        ({fileSize})
                      </span>
                    )}
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm admin-btn--ghost text-[var(--admin-red)] border-[rgba(214,69,69,0.3)] hover:border-[rgba(214,69,69,0.3)]"
                      onClick={handleFileRemove}
                    >
                      <X size={13} />
                      Remove
                    </button>
                  </div>
                )}
                <span className="hint">
                  Upload a file (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP)
                  via Cloudinary
                </span>
                {fileError && <div className="field__err">{fileError}</div>}
                {errors.fileUrl && (
                  <div className="field__err">{errors.fileUrl.message}</div>
                )}
              </div>
            </div>
          </div>

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
              {saving ? "Saving\u2026" : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
