"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Save, X, Loader2 } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import RichTextEditor from "@/app/admin/_components/editor/rich-text-editor";
import { BLOG_STUDENT_CATEGORIES } from "@/types/blog-student";

const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .regex(slugRe, "Slug must be lowercase letters, numbers and hyphens")
    .max(120),
  excerpt: z.string().min(10, "Summary must be at least 10 characters"),
  body: z.string().min(10, "Body must be at least 10 characters"),
  image: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  tag: z.string().max(200),
  author: z.string().min(2, "Author is required"),
  category: z.string().min(1, "Category is required"),
});

type StudentBlogSchema = z.infer<typeof blogSchema>;

export interface StudentBlogFormValues {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image?: string;
  date: string;
  tag: string;
  author: string;
  category: string;
}

interface StudentBlogFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Existing values when editing (admin). null/undefined when creating.
   */
  initial?: StudentBlogFormValues | null;
  /**
   * Called with the form values. Throw with a message on failure to show an error.
   */
  onSubmit: (values: StudentBlogFormValues) => Promise<void> | void;
  submitting?: boolean;
  title?: string;
  submitLabel?: string;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#4167C9] focus:ring-2 focus:ring-[#4167C9]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white";

const labelClass =
  "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

const hintClass = "mt-1 block text-xs text-slate-400";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="mt-1 text-xs text-red-500">{message}</div>;
}

export default function StudentBlogFormModal({
  open,
  onOpenChange,
  initial,
  onSubmit,
  submitting = false,
  title = "Write an Article",
  submitLabel,
}: StudentBlogFormModalProps) {
  const [notice, setNotice] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [excerptHtml, setExcerptHtml] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StudentBlogSchema>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      body: "",
      image: "",
      date: todayISO(),
      tag: "",
      author: "",
      category: "Internships",
    },
  });

  const image = watch("image");
  const titleValue = watch("title");

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Auto-generate the slug from the title on create (admins can tweak later).
  const handleTitleChange = (value: string) => {
    setValue("title", value);
    if (!initial) setValue("slug", slugify(value));
  };

  useEffect(() => {
    setNotice(null);
    if (initial) {
      reset({
        title: initial.title,
        slug: initial.slug || slugify(initial.title),
        excerpt: initial.excerpt,
        body: initial.body || "",
        image: initial.image || "",
        date: initial.date,
        tag: initial.tag || "",
        author: initial.author,
        category: initial.category || "Internships",
      });
      setExcerptHtml(initial.excerpt);
      setBodyHtml(initial.body || "");
    } else {
      reset({
        title: "",
        slug: "",
        excerpt: "",
        body: "",
        image: "",
        date: todayISO(),
        tag: "",
        author: "",
        category: "Internships",
      });
      setExcerptHtml("");
      setBodyHtml("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, reset, open]);

  const handleFormSubmit = async (data: StudentBlogSchema) => {
    setNotice(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[1300]"
        className="w-[min(100%,720px)] sm:max-w-[720px] z-[1300] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none bg-white dark:bg-[#111827]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <DialogTitle className="m-0 text-lg font-bold text-[#16285B] dark:text-white">
            {initial ? "Edit Article" : title}
          </DialogTitle>
          <button
            type="button"
            className="shrink-0 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 p-6">
            {notice && (
              <div
                className={`rounded-lg px-4 py-3 text-sm ${
                  notice.type === "error"
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                }`}
                role="status"
              >
                {notice.text}
              </div>
            )}

            <div>
              <label htmlFor="student-blog-title" className={labelClass}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="student-blog-title"
                type="text"
                value={titleValue}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. My Internship Journey at a Fintech Company"
                className={inputClass}
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div>
              <label htmlFor="student-blog-slug" className={labelClass}>
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="student-blog-slug"
                type="text"
                placeholder="lowercase-with-hyphens"
                {...register("slug")}
                className={inputClass}
              />
              <span className={hintClass}>
                Auto-generated from the title. Used in the public URL.
              </span>
              <FieldError message={errors.slug?.message} />
            </div>

            <div>
              <label className={labelClass}>
                Image <span className="text-red-500">*</span>
              </label>
              {image ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Article image preview"
                    className="h-24 w-40 rounded-xl border border-slate-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue("image", "")}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <ImageUpload
                  className="inline-flex items-center gap-2 rounded-lg bg-[#16285B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1e3a7a]"
                  onUpload={(r) => setValue("image", r.secure_url)}
                />
              )}
              <span className={hintClass}>Cover image shown on the card.</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="student-blog-author" className={labelClass}>
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  id="student-blog-author"
                  type="text"
                  {...register("author")}
                  className={inputClass}
                />
                <FieldError message={errors.author?.message} />
              </div>

              <div>
                <label htmlFor="student-blog-tag" className={labelClass}>
                  Tag
                </label>
                <input
                  id="student-blog-tag"
                  type="text"
                  {...register("tag")}
                  placeholder="e.g. Internships - BCSIT '26"
                  className={inputClass}
                />
                <span className={hintClass}>
                  Short label shown at the top of the card.
                </span>
              </div>

              <div>
                <label htmlFor="student-blog-date" className={labelClass}>
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="student-blog-date"
                  type="date"
                  {...register("date")}
                  className={inputClass}
                />
                <FieldError message={errors.date?.message} />
              </div>

              <div>
                <label htmlFor="student-blog-category" className={labelClass}>
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  id="student-blog-category"
                  list="student-blog-categories"
                  type="text"
                  {...register("category")}
                  placeholder="Pick or type a category"
                  className={inputClass}
                />
                <datalist id="student-blog-categories">
                  {BLOG_STUDENT_CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <span className={hintClass}>
                  Choose from the suggestions or type your own.
                </span>
                <FieldError message={errors.category?.message} />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Excerpt (Summary) <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={excerptHtml}
                onChange={(html) => {
                  setExcerptHtml(html);
                  setValue("excerpt", html);
                }}
                placeholder="Write a short summary shown on the card..."
              />
              <FieldError message={errors.excerpt?.message} />
            </div>

            <div>
              <label className={labelClass}>
                Body <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={bodyHtml}
                onChange={(html) => {
                  setBodyHtml(html);
                  setValue("body", html);
                }}
                placeholder="Write the full article here..."
              />
              <FieldError message={errors.body?.message} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
            <button
              type="button"
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#16285B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e3a7a] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {submitting
                ? "Submitting…"
                : initial
                  ? "Save changes"
                  : submitLabel || "Submit for review"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
