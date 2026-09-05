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
import { Result, RESULT_PROGRAMS } from "@/types/results";
import { Save, X, FileText } from "lucide-react";
import DocumentUpload from "@/components/cloudinary/DocumentUpload";

const resultSchema = z.object({
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
  program: z.string().min(1, "Program is required").max(100),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["published", "draft"]),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

type ResultSchema = z.infer<typeof resultSchema>;

interface ResultsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: Result | null;
  onSave: (result: Result) => void;
  saving?: boolean;
  programCodes?: string[];
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function ResultsFormModal({
  open,
  onOpenChange,
  result,
  onSave,
  saving = false,
  programCodes = [],
}: ResultsFormModalProps) {
  const [fileError, setFileError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      title: "",
      slug: "",
      program: "BBA",
      date: todayISO(),
      status: "draft",
      fileUrl: "",
      fileName: "",
    },
  });

  const fileUrl = watch("fileUrl");

  const titleValue = watch("title");
  useEffect(() => {
    if (!result && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 100)
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, result, setValue]);

  useEffect(() => {
    setFileError("");
    if (result) {
      reset({
        title: result.title,
        slug: result.slug,
        program: result.program,
        date: result.date,
        status: result.status,
        fileUrl: result.fileUrl || "",
        fileName: result.fileName || "",
      });
    } else {
      reset({
        title: "",
        slug: "",
        program: "BBA",
        date: todayISO(),
        status: "draft",
        fileUrl: "",
        fileName: "",
      });
    }
  }, [result, reset, open]);

  const removeFile = () => {
    setValue("fileUrl", "");
    setValue("fileName", "");
  };

  const onSubmit = async (data: ResultSchema) => {
    const resultData: Result = {
      id: result?.id || `result-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      program: data.program,
      date: data.date,
      status: data.status,
      views: result?.views || 0,
      fileUrl: data.fileUrl || undefined,
      fileName: data.fileName || undefined,
      createdAt: result?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(resultData);
  };

  const fieldValue = (key: keyof ResultSchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {result ? "Edit Result" : "Add Result"}
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
                <label htmlFor="result-title">
                  Title <span className="req">*</span>
                </label>
                <input id="result-title" type="text" {...register("title")} />
                {errors.title && (
                  <div className="field__err">{errors.title.message}</div>
                )}
              </div>

              <div className={fieldValue("program")}>
                <label htmlFor="result-program">
                  Program <span className="req">*</span>
                </label>
                <input
                  id="result-program"
                  type="text"
                  list="result-program-list"
                  placeholder="e.g. BBA, BCSIT, …"
                  {...register("program")}
                />
                <datalist id="result-program-list">
                  {[...new Set([...programCodes, ...RESULT_PROGRAMS])].map(
                    (code) => (
                      <option key={code} value={code} />
                    )
                  )}
                </datalist>
                {errors.program && (
                  <div className="field__err">{errors.program.message}</div>
                )}
              </div>

              <div className={fieldValue("date")}>
                <label htmlFor="result-date">
                  Date <span className="req">*</span>
                </label>
                <input
                  id="result-date"
                  type="date"
                  {...register("date")}
                />
                {errors.date && (
                  <div className="field__err">{errors.date.message}</div>
                )}
              </div>

              <div className="field">
                <label htmlFor="result-views">Views</label>
                <input
                  id="result-views"
                  type="number"
                  value={result?.views || 0}
                  disabled
                  className="bg-[var(--admin-surface-2)]"
                />
              </div>

              <div className="form-section">
                <b>Attachment</b>
              </div>

              <div
                className={`field field--full ${
                  fileError ? "is-invalid" : ""
                }`}
              >
                <label>Result File (PDF/DOC)</label>
                <div className="flex flex-col gap-3">
                  {/* Cloudinary Document Upload */}
                  <div className="flex items-center gap-2">
                    <DocumentUpload
                      onUpload={(uploadResult) => {
                        setValue("fileUrl", uploadResult.secure_url);
                        setValue("fileName", `${uploadResult.original_filename}.${uploadResult.format}`);
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
                <label htmlFor="result-status">Status</label>
                <select id="result-status" {...register("status")}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                {errors.status && (
                  <div className="field__err">{errors.status.message}</div>
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
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
