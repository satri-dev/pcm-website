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
  Scholarship,
  ScholarshipType,
  SCHOLARSHIP_TYPES,
} from "@/types/scholarships";
import { Save, X } from "lucide-react";

const scholarshipSchema = z.object({
  title: z
    .string()
    .min(3, "Scheme name must be at least 3 characters")
    .max(200),
  slug: z
    .string()
    .min(1, "This field is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  type: z.enum(["Merit", "Need-based", "University", "Category"]),
  desc: z.string().max(5000),
  active: z.boolean(),
});

type ScholarshipSchema = z.infer<typeof scholarshipSchema>;

interface ScholarshipsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarship: Scholarship | null;
  onSave: (scholarship: Scholarship) => void;
  saving?: boolean;
}

export default function ScholarshipsFormModal({
  open,
  onOpenChange,
  scholarship,
  onSave,
  saving = false,
}: ScholarshipsFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScholarshipSchema>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      title: "",
      slug: "",
      type: "Merit",
      desc: "",
      active: true,
    },
  });

  const titleValue = watch("title");
  useEffect(() => {
    if (!scholarship && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 100)
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, scholarship, setValue]);

  useEffect(() => {
    if (scholarship) {
      reset({
        title: scholarship.title,
        slug: scholarship.slug,
        type: scholarship.type,
        desc: scholarship.desc,
        active: scholarship.active,
      });
    } else {
      reset({
        title: "",
        slug: "",
        type: "Merit",
        desc: "",
        active: true,
      });
    }
  }, [scholarship, reset, open]);

  const onSubmit = async (data: ScholarshipSchema) => {
    const scholarshipData: Scholarship = {
      id: scholarship?.id || `scholarship-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      type: data.type as ScholarshipType,
      desc: data.desc,
      active: data.active,
      createdAt: scholarship?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(scholarshipData);
  };

  const fieldValue = (key: keyof ScholarshipSchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {scholarship ? "Edit Scholarship" : "Add Scholarship"}
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
              <div className={fieldValue("title")}>
                <label htmlFor="scholarship-title">
                  Scheme Name <span className="req">*</span>
                </label>
                <input
                  id="scholarship-title"
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Merit scholarships"
                />
                {errors.title && (
                  <div className="field__err">{errors.title.message}</div>
                )}
              </div>

              <div className={fieldValue("slug")}>
                <label htmlFor="scholarship-slug">
                  Slug <span className="req">*</span>
                </label>
                <input
                  id="scholarship-slug"
                  type="text"
                  {...register("slug")}
                />
                {errors.slug && (
                  <div className="field__err">{errors.slug.message}</div>
                )}
              </div>

              <div className={fieldValue("type")}>
                <label htmlFor="scholarship-type">
                  Type <span className="req">*</span>
                </label>
                <select id="scholarship-type" {...register("type")}>
                  {SCHOLARSHIP_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <div className="field__err">{errors.type.message}</div>
                )}
              </div>

              <div className="field">
                <label htmlFor="scholarship-active">Active</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="scholarship-active"
                    type="checkbox"
                    {...register("active")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-[var(--admin-muted)]">
                    {watch("active") ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>

              <div className={fieldValue("desc")}>
                <label htmlFor="scholarship-desc">Description</label>
                <textarea
                  id="scholarship-desc"
                  {...register("desc")}
                  rows={6}
                  placeholder="Describe the scholarship scheme..."
                />
                {errors.desc && (
                  <div className="field__err">{errors.desc.message}</div>
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
