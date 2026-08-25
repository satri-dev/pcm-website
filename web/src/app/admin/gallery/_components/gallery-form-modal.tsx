"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Gallery, GalleryPhoto, GALLERY_CATEGORIES } from "@/types/gallery";
import { Save, X, Upload, Plus, Trash2 } from "lucide-react";

const gallerySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  category: z.enum(["Campus", "Events", "Students", "Faculty", "Activities", "Infrastructure", "Graduation"]),
  image: z.string().optional(),
  photos: z.array(z.object({
    url: z.string().min(1, "Photo URL is required"),
    caption: z.string().optional(),
  })),
  date: z.string().min(1, "Date is required"),
  photoCount: z.number().min(0, "Photo count must be a positive number"),
});

type GallerySchema = z.infer<typeof gallerySchema>;

const IMAGE_URL_RE = /^(data:image\/|https?:\/\/.+\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$)/i;

interface GalleryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gallery: Gallery | null;
  onSave: (gallery: Gallery) => void;
  saving?: boolean;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function GalleryFormModal({
  open,
  onOpenChange,
  gallery,
  onSave,
  saving = false,
}: GalleryFormModalProps) {
  const coverFileRef = useRef<HTMLInputElement>(null);
  const [coverError, setCoverError] = useState("");
  const [photoRows, setPhotoRows] = useState<GalleryPhoto[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<GallerySchema>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: "",
      category: "Campus",
      image: "",
      photos: [],
      date: todayISO(),
      photoCount: 0,
    },
  });

  const image = watch("image");
  const photoCount = watch("photoCount");

  useEffect(() => {
    setCoverError("");
    if (gallery) {
      reset({
        title: gallery.title,
        category: gallery.category,
        image: gallery.image || "",
        photos: gallery.photos || [],
        date: gallery.date,
        photoCount: gallery.photoCount,
      });
      setPhotoRows(gallery.photos || []);
    } else {
      reset({
        title: "",
        category: "Campus",
        image: "",
        photos: [],
        date: todayISO(),
        photoCount: 0,
      });
      setPhotoRows([]);
    }
  }, [gallery, reset, open]);

  useEffect(() => {
    setValue("photos", photoRows);
    setValue("photoCount", photoRows.length);
  }, [photoRows, setValue]);

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const limitBytes = 5 * 1048576;
    if (file.size > limitBytes) {
      setCoverError("File too large — max 5MB");
      e.target.value = "";
      return;
    }
    if (file.type.indexOf("image/") !== 0) {
      setCoverError("Please choose an image file");
      e.target.value = "";
      return;
    }
    setCoverError("");
    const reader = new FileReader();
    reader.onload = () => {
      setValue("image", String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const removeCoverImage = () => {
    setValue("image", "");
    if (coverFileRef.current) coverFileRef.current.value = "";
  };

  const addPhotoRow = () => {
    setPhotoRows((prev) => [...prev, { url: "", caption: "" }]);
  };

  const removePhotoRow = (index: number) => {
    setPhotoRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePhotoRow = (index: number, field: keyof GalleryPhoto, value: string | string[]) => {
    setPhotoRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const limitBytes = 5 * 1048576;
    if (file.size > limitBytes) {
      alert("File too large — max 5MB");
      e.target.value = "";
      return;
    }
    if (file.type.indexOf("image/") !== 0) {
      alert("Please choose an image file");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updatePhotoRow(index, "url", String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: GallerySchema) => {
    const galleryData: Gallery = {
      id: gallery?.id || `gallery-${Date.now()}`,
      title: data.title,
      category: data.category,
      image: data.image || "",
      photos: data.photos,
      date: data.date,
      photoCount: data.photos.length,
      views: gallery?.views || 0,
      createdAt: gallery?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(galleryData);
  };

  const fieldValue = (key: keyof GallerySchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {gallery ? "Edit Gallery Item" : "Add Gallery Item"}
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
                <label htmlFor="gallery-title">
                  Title <span className="req">*</span>
                </label>
                <input id="gallery-title" type="text" {...register("title")} />
                {errors.title && (
                  <div className="field__err">{errors.title.message}</div>
                )}
              </div>

              <div className={fieldValue("category")}>
                <label htmlFor="gallery-category">
                  Category <span className="req">*</span>
                </label>
                <select id="gallery-category" {...register("category")}>
                  <option value="">— Select —</option>
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <div className="field__err">{errors.category.message}</div>
                )}
              </div>

              <div className={fieldValue("date")}>
                <label htmlFor="gallery-date">
                  Date <span className="req">*</span>
                </label>
                <input
                  id="gallery-date"
                  type="date"
                  {...register("date")}
                />
                {errors.date && (
                  <div className="field__err">{errors.date.message}</div>
                )}
              </div>

              <div className={fieldValue("photoCount")}>
                <label htmlFor="gallery-photoCount">
                  Photos <span className="req">*</span>
                </label>
                <input
                  id="gallery-photoCount"
                  type="number"
                  {...register("photoCount", { valueAsNumber: true })}
                  min={0}
                />
                {errors.photoCount && (
                  <div className="field__err">{errors.photoCount.message}</div>
                )}
              </div>

              <div
                className={`field field--full ${
                  coverError ? "is-invalid" : ""
                }`}
              >
                <label>Cover Image</label>
                <div className="file-field">
                  <input
                    ref={coverFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm cursor-pointer flex-none"
                    onClick={() => coverFileRef.current?.click()}
                  >
                    <Upload size={14} />
                    Choose file · max 5MB image
                  </button>
                  <input
                    type="text"
                    {...register("image")}
                    placeholder="…or paste a URL to an existing file"
                  />
                </div>
                {image && (
                  <div className="img-prev">
                    {IMAGE_URL_RE.test(image) ? (
                      <img src={image} alt="" />
                    ) : (
                      <span className="badge badge--blue">
                        {image.split("/").pop()}
                      </span>
                    )}
                  </div>
                )}
                {image && (
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm admin-btn--ghost text-[var(--admin-red)] border-[rgba(214,69,69,0.3)] hover:border-[rgba(214,69,69,0.3)]"
                    onClick={removeCoverImage}
                  >
                    <X size={13} />
                    Remove
                  </button>
                )}
                <span className="hint">
                  Upload cover image (max 5MB) or paste a URL
                </span>
                {coverError && <div className="field__err">{coverError}</div>}
              </div>

              <div className="form-section">
                <b>Photo List</b>
              </div>

              <div className="field field--full">
                <label>Photos</label>
                <div className="list-field">
                  {photoRows.map((photo, index) => (
                    <div key={index} className="list-field__row">
                      <div className="list-field__cell">
                        <label>Photo URL</label>
                        <div className="file-field">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoFileChange(e, index)}
                          />
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm cursor-pointer flex-none"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e) => handlePhotoFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>, index);
                              input.click();
                            }}
                          >
                            <Upload size={14} />
                            Choose
                          </button>
                          <input
                            type="text"
                            value={photo.url}
                            onChange={(e) => updatePhotoRow(index, "url", e.target.value)}
                            placeholder="…or paste a URL"
                          />
                        </div>
                        {photo.url && IMAGE_URL_RE.test(photo.url) && (
                          <div className="img-prev">
                            <img src={photo.url} alt="" />
                          </div>
                        )}
                      </div>
                      <div className="list-field__cell">
                        <label>Title</label>
                        <input
                          type="text"
                          value={photo.title || ""}
                          onChange={(e) => updatePhotoRow(index, "title", e.target.value)}
                          placeholder="Photo title"
                        />
                      </div>
                      <div className="list-field__cell">
                        <label>Tags</label>
                        <input
                          type="text"
                          value={(photo.tags || []).join(", ")}
                          onChange={(e) => updatePhotoRow(index, "tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                          placeholder="campus, event, 2026"
                        />
                      </div>
                      <button
                        type="button"
                        className="icon-btn list-field__del"
                        aria-label="Remove photo"
                        onClick={() => removePhotoRow(index)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm"
                    style={{ marginTop: "0.5rem" }}
                    onClick={addPhotoRow}
                  >
                    <Plus size={14} />
                    Add Photo
                  </button>
                </div>
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
