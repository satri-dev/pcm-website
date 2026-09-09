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
import { News, NewsCategory, NEWS_CATEGORIES } from "@/types/news";
import { Save, X } from "lucide-react";
import RichTextEditor from "../../../_components/editor/rich-text-editor";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const newsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(1, "This field is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(10, "This field is required"),
  content: z.string().optional(),
  category: z.string().min(1, "This field is required").max(100),
  image: z.string().optional(),
  author: z.string().min(1, "This field is required"),
  publishedAt: z.string().min(1, "This field is required"),
  status: z.enum(["published", "draft"]),
  featured: z.boolean(),
  tags: z.string().optional(),
});

type NewsSchema = z.infer<typeof newsSchema>;

const IMAGE_URL_RE = /^(data:image\/|https?:\/\/.+\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$)/i;

interface NewsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: News | null;
  onSave: (news: News) => void;
  saving?: boolean;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function NewsFormModal({
  open,
  onOpenChange,
  news,
  onSave,
  saving = false,
}: NewsFormModalProps) {
  const [fileError, setFileError] = useState("");
  const [excerptHtml, setExcerptHtml] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewsSchema>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "News",
      image: "",
      author: "Admin",
      publishedAt: todayISO(),
      status: "draft",
      featured: false,
      tags: "",
    },
  });

  const image = watch("image");

  // Auto-generate slug from title
  const titleValue = watch("title");
  useEffect(() => {
    if (!news && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 100)
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, news, setValue]);

  // Load news data when editing
  useEffect(() => {
    setFileError("");
    if (news) {
      reset({
        title: news.title,
        slug: news.slug,
        excerpt: news.excerpt,
        content: news.content,
        category: news.category,
        image: news.image || "",
        author: news.author,
        publishedAt: news.publishedAt,
        status: news.status,
        featured: news.featured,
        tags: news.tags?.join(", ") || "",
      });
      setExcerptHtml(news.excerpt);
    } else {
      reset({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "News",
        image: "",
        author: "Admin",
        publishedAt: todayISO(),
        status: "draft",
        featured: false,
        tags: "",
      });
      setExcerptHtml("");
    }
  }, [news, reset, open]);

  const removeImage = () => {
    setValue("image", "");
  };

  const onSubmit = async (data: NewsSchema) => {
    const newsData: News = {
      id: news?.id || `news-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content || "",
      category: data.category,
      image: data.image || undefined,
      author: data.author,
      publishedAt: data.publishedAt,
      status: data.status,
      views: news?.views || 0,
      featured: data.featured,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      seo: news?.seo,
      createdAt: news?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(newsData);
  };

  const fieldValue = (key: keyof NewsSchema) =>
    errors[key] ? "field is-invalid" : "field";
  const fileName = (image || "").split("/").pop() || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Head */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {news ? "Edit News" : "Add News"}
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
          {/* Body */}          <div className="modal__body">
            <div className="form-grid">
              <div className="form-section">
                <b>Details</b>
              </div>

              <div className={fieldValue("title")}>
                <label htmlFor="news-title">
                  Title <span className="req">*</span>
                </label>
                <input id="news-title" type="text" {...register("title")} />
                {errors.title && (
                  <div className="field__err">{errors.title.message}</div>
                )}
              </div>

              <div className={fieldValue("category")}>
                <label htmlFor="news-category">
                  Category <span className="req">*</span>
                </label>
                <input 
                  id="news-category" 
                  type="text"
                  placeholder="e.g., News, Event, Achievement..."
                  {...register("category")}
                />
                {errors.category && (
                  <div className="field__err">{errors.category.message}</div>
                )}
              </div>

              <div className={fieldValue("publishedAt")}>
                <label htmlFor="news-date">
                  Date <span className="req">*</span>
                </label>
                <input
                  id="news-date"
                  type="date"
                  {...register("publishedAt")}
                />
                {errors.publishedAt && (
                  <div className="field__err">{errors.publishedAt.message}</div>
                )}
              </div>

              <div className="field">
                <label htmlFor="news-views">Views</label>
                <input
                  id="news-views"
                  type="number"
                  value={news?.views || 0}
                  disabled
                  className="bg-[var(--admin-surface-2)]"
                />
              </div>

              <div
                className={`field field--full ${
                  fileError ? "is-invalid" : ""
                }`}
              >
                <label>Image</label>
                <div className="flex flex-col gap-3">
                  {/* Cloudinary Upload */}
                  <div className="flex items-center gap-2">
                    <ImageUpload
                      onUpload={(result) => {
                        setValue("image", result.secure_url);
                        setFileError("");
                      }}
                    />
                    <span className="text-[0.85rem] text-[var(--admin-muted)]">
                      or paste URL below
                    </span>
                  </div>

                  {/* Manual URL Input */}
                  <input
                    type="text"
                    {...register("image")}
                    placeholder="Or paste image URL here..."
                    className="w-full"
                  />
                </div>

                {/* Image Preview */}
                {image &&
                  (IMAGE_URL_RE.test(image) ? (
                    <div className="img-prev mt-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt="" />
                    </div>
                  ) : (
                    <div className="img-prev mt-3">
                      <span className="badge badge--blue">{fileName}</span>
                    </div>
                  ))}
                
                {/* Remove Image Button */}
                {image && (
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm admin-btn--ghost text-[var(--admin-red)] border-[rgba(214,69,69,0.3)] hover:border-[rgba(214,69,69,0.3)] mt-2"
                    onClick={removeImage}
                  >
                    <X size={13} />
                    Remove
                  </button>
                )}
                
                <span className="hint mt-2">
                  Upload via Cloudinary (max 5MB) or paste a URL
                </span>
                {fileError && <div className="field__err">{fileError}</div>}
              </div>

              <div className="form-section">
                <b>Content</b>
              </div>

              <div
                className={`field field--full ${
                  errors.excerpt ? "is-invalid" : ""
                }`}
              >
                <label htmlFor="news-excerpt">Excerpt</label>
                <RichTextEditor
                  content={excerptHtml}
                  onChange={(html) => {
                    setExcerptHtml(html);
                    setValue("excerpt", html);
                  }}
                  placeholder="Brief summary..."
                />
                {errors.excerpt && (
                  <div className="field__err">{errors.excerpt.message}</div>
                )}
              </div>

              <div className="form-section">
                <b>Publishing</b>
              </div>

              <div className="field">
                <label>Featured</label>
                <label className="switch">
                  <input type="checkbox" {...register("featured")} />
                  <span className="track"></span>
                </label>
              </div>

              <div className={fieldValue("status")}>
                <label htmlFor="news-status">Status</label>
                <select id="news-status" {...register("status")}>
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
