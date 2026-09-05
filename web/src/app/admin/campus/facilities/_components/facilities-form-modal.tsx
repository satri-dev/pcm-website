"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FacilityItem, FACILITY_CATEGORIES } from "../types/facilities";
import { Save, X } from "lucide-react";
import RichTextEditor from "../../../_components/editor/rich-text-editor";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const facilitySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(200, "Name is too long"),
  category: z.string().min(1, "Category is required").max(100),
  icon: z.string().min(1, "Icon is required").max(20, "Icon is too long"),
  image: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["published", "draft"]),
  order: z.number().int().min(0, "Order must be 0 or greater"),
});

type FacilitySchema = z.infer<typeof facilitySchema>;

interface FacilitiesFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility: FacilityItem | null;
  onSave: (facility: FacilityItem) => void;
  saving?: boolean;
}

export default function FacilitiesFormModal({
  open,
  onOpenChange,
  facility,
  onSave,
  saving = false,
}: FacilitiesFormModalProps) {
  const [descriptionHtml, setDescriptionHtml] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FacilitySchema>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: "",
      category: "Learning",
      icon: "🏫",
      image: "",
      description: "",
      status: "draft",
      order: 0,
    },
  });

  const image = watch("image");

  // Populate form when editing an existing facility or reset when adding new
  useEffect(() => {
    if (facility) {
      reset({
        name: facility.name,
        category: facility.category,
        icon: facility.icon,
        image: facility.image || "",
        description: facility.description,
        status: facility.status,
        order: facility.order,
      });
      setDescriptionHtml(facility.description);
    } else {
      reset({
        name: "",
        category: "Learning",
        icon: "🏫",
        image: "",
        description: "",
        status: "draft",
        order: 0,
      });
      setDescriptionHtml("");
    }
  }, [facility, reset, open]);

  const onSubmit = async (data: FacilitySchema) => {
    const facilityData: FacilityItem = {
      id: facility?.id || `facility-${Date.now()}`,
      name: data.name,
      category: data.category,
      icon: data.icon,
      image: data.image || undefined,
      description: data.description,
      status: data.status,
      order: data.order,
      createdAt: facility?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await onSave(facilityData);
  };

  const fieldCls = (key: keyof FacilitySchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Header */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {facility ? "Edit Facility" : "Add Facility"}
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
              {/* ── Details ─────────────────────────────────── */}
              <div className="form-section">
                <b>Details</b>
              </div>

              {/* Name */}
              <div className={`${fieldCls("name")} field--full`}>
                <label htmlFor="facility-name">
                  Facility Name <span className="req">*</span>
                </label>
                <input
                  id="facility-name"
                  type="text"
                  placeholder="e.g. Smart Classrooms"
                  {...register("name")}
                />
                {errors.name && (
                  <div className="field__err">{errors.name.message}</div>
                )}
              </div>

              {/* Category */}
              <div className={fieldCls("category")}>
                <label htmlFor="facility-category">
                  Category <span className="req">*</span>
                </label>
                <input
                  id="facility-category"
                  type="text"
                  list="facility-category-list"
                  placeholder="e.g. Learning, Library, …"
                  {...register("category")}
                />
                <datalist id="facility-category-list">
                  {FACILITY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                {errors.category && (
                  <div className="field__err">{errors.category.message}</div>
                )}
              </div>

              {/* Icon */}
              <div className={fieldCls("icon")}>
                <label htmlFor="facility-icon">
                  Icon (emoji) <span className="req">*</span>
                </label>
                <input
                  id="facility-icon"
                  type="text"
                  placeholder="e.g. 🏫"
                  {...register("icon")}
                />
                {errors.icon && (
                  <div className="field__err">{errors.icon.message}</div>
                )}
              </div>

              {/* Order */}
              <div className={fieldCls("order")}>
                <label htmlFor="facility-order">Display Order</label>
                <input
                  id="facility-order"
                  type="number"
                  min={0}
                  {...register("order", { valueAsNumber: true })}
                />
                {errors.order && (
                  <div className="field__err">{errors.order.message}</div>
                )}
              </div>

              {/* ── Description ──────────────────────────────── */}
              <div className="form-section">
                <b>Description</b>
              </div>

              <div
                className={`field field--full ${
                  errors.description ? "is-invalid" : ""
                }`}
              >
                <RichTextEditor
                  content={descriptionHtml}
                  onChange={(html) => {
                    setDescriptionHtml(html);
                    setValue("description", html);
                  }}
                  placeholder="Describe this facility..."
                />
                {errors.description && (
                  <div className="field__err">{errors.description.message}</div>
                )}
              </div>

              {/* ── Media ────────────────────────────────────── */}
              <div className="form-section">
                <b>Media</b>
              </div>

              <div className="field field--full">
                <label>Facility Image</label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <ImageUpload
                      onUpload={(result) => {
                        setValue("image", result.secure_url);
                      }}
                    />
                    <span className="text-[0.85rem] text-[var(--admin-muted)]">
                      or paste URL below
                    </span>
                  </div>
                  <input
                    type="text"
                    {...register("image")}
                    placeholder="Or paste image URL here..."
                    className="w-full"
                  />
                </div>

                {image && (
                  <div className="img-prev mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Facility preview" />
                    <button
                      type="button"
                      className="img-prev__remove"
                      onClick={() => setValue("image", "")}
                      aria-label="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* ── Publishing ───────────────────────────────── */}
              <div className="form-section">
                <b>Publishing</b>
              </div>

              <div className={fieldCls("status")}>
                <label htmlFor="facility-status">
                  Status <span className="req">*</span>
                </label>
                <select id="facility-status" {...register("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
            >
              <Save size={15} />
              {saving ? "Saving…" : "Save Facility"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
