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
import { Blog, BLOG_CATEGORIES, BLOG_STATUSES } from "../types/blog";
import { Save, X, Plus, FileText } from "lucide-react";
import DocumentUpload from "@/components/cloudinary/DocumentUpload";
import RichTextEditor from "@/app/admin/_components/editor/rich-text-editor";

const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  author: z.string().min(2, "Author is required"),
  category: z.enum(["Career", "Finance", "Technology", "Student Life", "Admissions", "Events", "Achievement", "Other"]),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["published", "draft"]),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

type BlogSchema = z.infer<typeof blogSchema>;

interface BlogFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog: Blog | null;
  onSave: (blog: Blog) => void;
  saving?: boolean;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function BlogFormModal({
  open,
  onOpenChange,
  blog,
  onSave,
  saving = false,
}: BlogFormModalProps) {
  const [fileError, setFileError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogSchema>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "Career",
      date: todayISO(),
      status: "draft",
      excerpt: "",
      fileUrl: "",
      fileName: "",
    },
  });

  const excerpt = watch("excerpt");
  const fileUrl = watch("fileUrl");

  useEffect(() => {
    setFileError("");
    if (blog) {
      reset({
        title: blog.title,
        author: blog.author,
        category: blog.category,
        date: blog.date,
        status: blog.status,
        excerpt: blog.excerpt,
        fileUrl: blog.fileUrl || "",
        fileName: blog.fileName || "",
      });
    } else {
      reset({
        title: "",
        author: "",
        category: "Career",
        date: todayISO(),
        status: "draft",
        excerpt: "",
        fileUrl: "",
        fileName: "",
      });
    }
  }, [blog, reset, open]);

  const handleFileUpload = (result: {
    secure_url: string;
    original_filename: string;
    format: string;
  }) => {
    setFileError("");
    setValue("fileUrl", result.secure_url);
    setValue("fileName", `${result.original_filename}.${result.format}`);
  };

  const handleFileRemove = () => {
    setValue("fileUrl", "");
    setValue("fileName", "");
  };

  const onSubmit = async (data: BlogSchema) => {
    const blogData: Blog = {
      id: blog?.id || `blog-${Date.now()}`,
      title: data.title,
      author: data.author,
      category: data.category,
      date: data.date,
      status: data.status,
      excerpt: data.excerpt,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      createdAt: blog?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(blogData);
  };

  const fieldValue = (key: keyof BlogSchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {blog ? "Edit Blog Post" : "Add Blog Post"}
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
                <label htmlFor="blog-title">
                  Title <span className="req">*</span>
                </label>
                <input id="blog-title" type="text" {...register("title")} />
                {errors.title && (
                  <div className="field__err">{errors.title.message}</div>
                )}
              </div>

              <div className={fieldValue("author")}>
                <label htmlFor="blog-author">
                  Author <span className="req">*</span>
                </label>
                <input id="blog-author" type="text" {...register("author")} />
                {errors.author && (
                  <div className="field__err">{errors.author.message}</div>
                )}
              </div>

              <div className={fieldValue("category")}>
                <label htmlFor="blog-category">
                  Category <span className="req">*</span>
                </label>
                <select id="blog-category" {...register("category")}>
                  <option value="">— Select —</option>
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <div className="field__err">{errors.category.message}</div>
                )}
              </div>

              <div className={fieldValue("date")}>
                <label htmlFor="blog-date">
                  Date <span className="req">*</span>
                </label>
                <input
                  id="blog-date"
                  type="date"
                  {...register("date")}
                />
                {errors.date && (
                  <div className="field__err">{errors.date.message}</div>
                )}
              </div>

              <div className={fieldValue("status")}>
                <label htmlFor="blog-status">
                  Status <span className="req">*</span>
                </label>
                <select id="blog-status" {...register("status")}>
                  {BLOG_STATUSES.map((s) => (
                    <option key={s} value={s}>{s === "published" ? "Published" : "Draft"}</option>
                  ))}
                </select>
                {errors.status && (
                  <div className="field__err">{errors.status.message}</div>
                )}
              </div>

              <div className={`field field--full ${fileError ? "is-invalid" : ""}`}>
                <label>Attachment</label>
                <div className="file-field">
                  <DocumentUpload onUpload={handleFileUpload} />
                </div>
                {fileUrl && fileUrl.startsWith('http') && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="badge badge--blue inline-flex items-center gap-1">
                      <FileText size={12} />
                      {watch("fileName") || "Attached file"}
                    </span>
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
                  Upload supporting document (PDF, DOC, DOCX) via Cloudinary
                </span>
                {fileError && <div className="field__err">{fileError}</div>}
              </div>

              <div className="form-section">
                <b>Excerpt</b>
              </div>

              <div className={`field field--full ${errors.excerpt ? "is-invalid" : ""}`}>
                <label>
                  Excerpt <span className="req">*</span>
                </label>
                <RichTextEditor
                  content={excerpt || ""}
                  onChange={(html) => setValue("excerpt", html)}
                  placeholder="Write your blog excerpt here..."
                />
                {errors.excerpt && (
                  <div className="field__err">{errors.excerpt.message}</div>
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
