"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CampusMapItem } from "../types/campus";
import { Save, X } from "lucide-react";
import RichTextEditor from "../../../_components/editor/rich-text-editor";

const campusMapSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(200, "Name is too long"),
  category: z.enum(["Academic", "Administration", "Student Life", "Sports", "Library", "IT"]),
  icon: z.string().min(1, "Icon is required").max(20, "Icon is too long"),
  positionX: z
    .number()
    .min(0, "Position must be between 0 and 100")
    .max(100, "Position must be between 0 and 100"),
  positionY: z
    .number()
    .min(0, "Position must be between 0 and 100")
    .max(100, "Position must be between 0 and 100"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["published", "draft"]),
});

type CampusMapSchema = z.infer<typeof campusMapSchema>;

interface CampusMapFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landmark: CampusMapItem | null;
  onSave: (landmark: CampusMapItem) => void;
  saving?: boolean;
}

export default function CampusMapFormModal({
  open,
  onOpenChange,
  landmark,
  onSave,
  saving = false,
}: CampusMapFormModalProps) {
  const [descriptionHtml, setDescriptionHtml] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CampusMapSchema>({
    resolver: zodResolver(campusMapSchema),
    defaultValues: {
      name: "",
      category: "Academic",
      icon: "📍",
      positionX: 50,
      positionY: 50,
      description: "",
      status: "draft",
    },
  });

  // Populate form when editing an existing landmark or reset when adding new
  useEffect(() => {
    if (landmark) {
      reset({
        name: landmark.name,
        category: landmark.category,
        icon: landmark.icon,
        positionX: landmark.positionX,
        positionY: landmark.positionY,
        description: landmark.description,
        status: landmark.status,
      });
      setDescriptionHtml(landmark.description);
    } else {
      reset({
        name: "",
        category: "Academic",
        icon: "📍",
        positionX: 50,
        positionY: 50,
        description: "",
        status: "draft",
      });
      setDescriptionHtml("");
    }
  }, [landmark, reset, open]);

  const onSubmit = async (data: CampusMapSchema) => {
    const landmarkData: CampusMapItem = {
      id: landmark?.id || `campusmap-${Date.now()}`,
      name: data.name,
      category: data.category,
      icon: data.icon,
      positionX: data.positionX,
      positionY: data.positionY,
      description: data.description,
      status: data.status,
      createdAt: landmark?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await onSave(landmarkData);
  };

  const fieldCls = (key: keyof CampusMapSchema) =>
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
            {landmark ? "Edit Landmark" : "Add Landmark"}
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
                <label htmlFor="landmark-name">
                  Place Name <span className="req">*</span>
                </label>
                <input
                  id="landmark-name"
                  type="text"
                  placeholder="e.g. Main Library"
                  {...register("name")}
                />
                {errors.name && (
                  <div className="field__err">{errors.name.message}</div>
                )}
              </div>

              {/* Category */}
              <div className={fieldCls("category")}>
                <label htmlFor="landmark-category">
                  Category <span className="req">*</span>
                </label>
                <select id="landmark-category" {...register("category")}>
                  <option value="Academic">Academic</option>
                  <option value="Administration">Administration</option>
                  <option value="Student Life">Student Life</option>
                  <option value="Sports">Sports</option>
                  <option value="Library">Library</option>
                  <option value="IT">IT</option>
                </select>
                {errors.category && (
                  <div className="field__err">{errors.category.message}</div>
                )}
              </div>

              {/* Icon */}
              <div className={fieldCls("icon")}>
                <label htmlFor="landmark-icon">
                  Icon (emoji) <span className="req">*</span>
                </label>
                <input
                  id="landmark-icon"
                  type="text"
                  placeholder="e.g. 📍"
                  {...register("icon")}
                />
                {errors.icon && (
                  <div className="field__err">{errors.icon.message}</div>
                )}
              </div>

              {/* ── Position on Map ──────────────────────────── */}
              <div className="form-section">
                <b>Position on Map</b>
              </div>

              <div className={fieldCls("positionX")}>
                <label htmlFor="landmark-pos-x">
                  Horizontal Position % (0–100) <span className="req">*</span>
                </label>
                <input
                  id="landmark-pos-x"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  {...register("positionX", { valueAsNumber: true })}
                />
                {errors.positionX && (
                  <div className="field__err">{errors.positionX.message}</div>
                )}
              </div>

              <div className={fieldCls("positionY")}>
                <label htmlFor="landmark-pos-y">
                  Vertical Position % (0–100) <span className="req">*</span>
                </label>
                <input
                  id="landmark-pos-y"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  {...register("positionY", { valueAsNumber: true })}
                />
                {errors.positionY && (
                  <div className="field__err">{errors.positionY.message}</div>
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
                  placeholder="Describe this landmark..."
                />
                {errors.description && (
                  <div className="field__err">{errors.description.message}</div>
                )}
              </div>

              {/* ── Publishing ───────────────────────────────── */}
              <div className="form-section">
                <b>Publishing</b>
              </div>

              <div className={fieldCls("status")}>
                <label htmlFor="landmark-status">
                  Status <span className="req">*</span>
                </label>
                <select id="landmark-status" {...register("status")}>
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
              {saving ? "Saving…" : "Save Landmark"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
