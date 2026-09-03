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
import { Gallery, GalleryVideo, GALLERY_CATEGORIES } from "@/types/gallery";
import { Save, X, Plus, Trash2, Link2 } from "lucide-react";

const galleryVideoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  category: z.string().min(1, "Category is required").max(100),
  date: z.string().min(1, "Date is required"),
  videos: z.array(
    z.object({
      url: z.string().min(1, "YouTube URL is required"),
      title: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
  ),
});

type GalleryVideoSchema = z.infer<typeof galleryVideoSchema>;

interface GalleryVideoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gallery: Gallery | null;
  onSave: (gallery: Gallery) => void;
  saving?: boolean;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function GalleryVideoFormModal({
  open,
  onOpenChange,
  gallery,
  onSave,
  saving = false,
}: GalleryVideoFormModalProps) {
  const [videoRows, setVideoRows] = useState<GalleryVideo[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GalleryVideoSchema>({
    resolver: zodResolver(galleryVideoSchema),
    defaultValues: {
      title: "",
      category: "Events",
      date: todayISO(),
      videos: [],
    },
  });

  useEffect(() => {
    if (gallery) {
      reset({
        title: gallery.title,
        category: gallery.category,
        date: gallery.date,
        videos: gallery.videos || [],
      });
      setVideoRows(gallery.videos || []);
    } else {
      reset({
        title: "",
        category: "Events",
        date: todayISO(),
        videos: [],
      });
      setVideoRows([]);
    }
  }, [gallery, reset, open]);

  useEffect(() => {
    setValue("videos", videoRows);
  }, [videoRows, setValue]);

  const addVideoRow = () => {
    setVideoRows((prev) => [...prev, { url: "", title: "", tags: [] }]);
  };

  const removeVideoRow = (index: number) => {
    setVideoRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVideoRow = (
    index: number,
    field: keyof GalleryVideo,
    value: string | string[]
  ) => {
    setVideoRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const onSubmit = async (data: GalleryVideoSchema) => {
    const galleryData: Gallery = {
      id: gallery?.id || `gallery-${Date.now()}`,
      title: data.title,
      category: data.category,
      type: "video",
      image: gallery?.image,
      photos: gallery?.photos || [],
      videos: data.videos.filter((v) => v.url.trim()),
      date: data.date,
      photoCount: (gallery?.photos || []).length,
      views: gallery?.views || 0,
      createdAt: gallery?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(galleryData);
  };

  const fieldValue = (key: keyof GalleryVideoSchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {gallery ? "Edit Video" : "Add Video"}
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
                <label htmlFor="gallery-video-title">
                  Title <span className="req">*</span>
                </label>
                <input id="gallery-video-title" type="text" {...register("title")} />
                {errors.title && (
                  <div className="field__err">{errors.title.message}</div>
                )}
              </div>

              <div className={fieldValue("category")}>
                <label htmlFor="gallery-video-category">
                  Category <span className="req">*</span>
                </label>
                <input
                  id="gallery-video-category"
                  type="text"
                  list="gallery-video-category-list"
                  placeholder="e.g. Events, Sports, …"
                  {...register("category")}
                />
                <datalist id="gallery-video-category-list">
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                {errors.category && (
                  <div className="field__err">{errors.category.message}</div>
                )}
              </div>

              <div className={fieldValue("date")}>
                <label htmlFor="gallery-video-date">
                  Date <span className="req">*</span>
                </label>
                <input
                  id="gallery-video-date"
                  type="date"
                  {...register("date")}
                />
                {errors.date && (
                  <div className="field__err">{errors.date.message}</div>
                )}
              </div>

              <div className="form-section">
                <b>Video List</b>
              </div>

              <div className="field field--full">
                <label>Videos</label>
                <div className="list-field">
                  {videoRows.map((video, index) => (
                    <div key={index} className="list-field__row">
                      <div className="list-field__cell">
                        <label>YouTube URL</label>
                        <div className="file-field">
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                            <Link2 size={14} />
                            Paste a YouTube watch/embed URL
                          </span>
                          <input
                            type="text"
                            value={video.url}
                            onChange={(e) => updateVideoRow(index, "url", e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="mt-2"
                          />
                        </div>
                        {video.url.trim() && (
                          <div className="mt-2">
                            <div className="img-prev">
                              <img
                                src={youtubeThumb(video.url)}
                                alt=""
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="list-field__cell">
                        <label>Title</label>
                        <input
                          type="text"
                          value={video.title || ""}
                          onChange={(e) => updateVideoRow(index, "title", e.target.value)}
                          placeholder="Video title"
                        />
                      </div>
                      <div className="list-field__cell">
                        <label>Tags</label>
                        <input
                          type="text"
                          value={(video.tags || []).join(", ")}
                          onChange={(e) =>
                            updateVideoRow(
                              index,
                              "tags",
                              e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean)
                            )
                          }
                          placeholder="campus, event, 2026"
                        />
                      </div>
                      <button
                        type="button"
                        className="icon-btn list-field__del"
                        aria-label="Remove video"
                        onClick={() => removeVideoRow(index)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm"
                    style={{ marginTop: "0.5rem" }}
                    onClick={addVideoRow}
                  >
                    <Plus size={14} />
                    Add Video
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

function youtubeThumb(url: string): string {
  const id = youtubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

export function youtubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}
