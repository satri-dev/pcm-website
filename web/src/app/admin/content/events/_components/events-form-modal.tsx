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
import { EventItem, EventType } from "@/types/events";
import { Save, X } from "lucide-react";
import RichTextEditor from "../../../_components/editor/rich-text-editor";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const eventSchema = z.object({
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
  type: z.string().min(1, "This field is required").max(100),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  seats: z.number().int().min(1, "At least 1 seat required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  status: z.enum(["published", "draft"]),
});

type EventSchema = z.infer<typeof eventSchema>;

interface EventsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventItem | null;
  onSave: (event: EventItem) => void;
  saving?: boolean;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function EventsFormModal({
  open,
  onOpenChange,
  event,
  onSave,
  saving = false,
}: EventsFormModalProps) {
  const [descriptionHtml, setDescriptionHtml] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      slug: "",
      type: "Workshop",
      date: todayISO(),
      location: "",
      seats: 40,
      description: "",
      image: "",
      status: "draft",
    },
  });

  const image = watch("image");

  const titleValue = watch("title");
  useEffect(() => {
    if (!event && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 100)
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, event, setValue]);

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        slug: event.slug,
        type: event.type,
        date: event.date,
        location: event.location,
        seats: event.seats,
        description: event.description,
        image: event.image || "",
        status: event.status,
      });
      setDescriptionHtml(event.description);
    } else {
      reset({
        title: "",
        slug: "",
        type: "Workshop",
        date: todayISO(),
        location: "",
        seats: 40,
        description: "",
        image: "",
        status: "draft",
      });
      setDescriptionHtml("");
    }
  }, [event, reset, open]);

  const removeImage = () => {
    setValue("image", "");
  };

  const onSubmit = async (data: EventSchema) => {
    const eventData: EventItem = {
      id: event?.id || `event-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      type: data.type as EventType,
      date: data.date,
      location: data.location,
      seats: data.seats,
      description: data.description,
      image: data.image || undefined,
      status: data.status,
      views: event?.views || 0,
      createdAt: event?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(eventData);
  };

  const fieldValue = (key: keyof EventSchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {event ? "Edit Event" : "Add Event"}
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
                <label htmlFor="event-title">
                  Event Title <span className="req">*</span>
                </label>
                <input id="event-title" type="text" {...register("title")} />
                {errors.title && (
                  <div className="field__err">{errors.title.message}</div>
                )}
              </div>

              <div className={fieldValue("type")}>
                <label htmlFor="event-type">
                  Type <span className="req">*</span>
                </label>
                <input 
                  id="event-type" 
                  type="text"
                  placeholder="e.g., Workshop, Seminar, Festival..."
                  {...register("type")}
                />
                {errors.type && (
                  <div className="field__err">{errors.type.message}</div>
                )}
              </div>

              <div className={fieldValue("date")}>
                <label htmlFor="event-date">
                  Date <span className="req">*</span>
                </label>
                <input
                  id="event-date"
                  type="date"
                  {...register("date")}
                />
                {errors.date && (
                  <div className="field__err">{errors.date.message}</div>
                )}
              </div>

              <div className={fieldValue("location")}>
                <label htmlFor="event-location">
                  Location <span className="req">*</span>
                </label>
                <input
                  id="event-location"
                  type="text"
                  {...register("location")}
                  placeholder="e.g. Auditorium Hall"
                />
                {errors.location && (
                  <div className="field__err">{errors.location.message}</div>
                )}
              </div>

              <div className={fieldValue("seats")}>
                <label htmlFor="event-seats">
                  Seats <span className="req">*</span>
                </label>
                <input
                  id="event-seats"
                  type="number"
                  {...register("seats", { valueAsNumber: true })}
                  min={1}
                />
                {errors.seats && (
                  <div className="field__err">{errors.seats.message}</div>
                )}
              </div>

              <div className="field">
                <label htmlFor="event-views">Views</label>
                <input
                  id="event-views"
                  type="number"
                  value={event?.views || 0}
                  disabled
                  className="bg-[var(--admin-surface-2)]"
                />
              </div>

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
                  placeholder="Describe the event..."
                />
                {errors.description && (
                  <div className="field__err">
                    {errors.description.message}
                  </div>
                )}
              </div>

              <div className="form-section">
                <b>Media</b>
              </div>

              <div className="field field--full">
                <label>Poster Image</label>
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
                    <img src={image} alt="" />
                  </div>
                )}

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
              </div>

              <div className="form-section">
                <b>Publishing</b>
              </div>

              <div className={fieldValue("status")}>
                <label htmlFor="event-status">Status</label>
                <select id="event-status" {...register("status")}>
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
