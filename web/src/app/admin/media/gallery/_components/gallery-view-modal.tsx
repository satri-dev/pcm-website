"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Gallery } from "@/types/gallery";
import { CalendarDays, Eye, ImageIcon, X } from "lucide-react";

interface GalleryViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gallery: Gallery | null;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function GalleryViewModal({
  open,
  onOpenChange,
  gallery,
}: GalleryViewModalProps) {
  if (!gallery) return null;

  const photos = gallery.photos || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Head */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <Eye size={18} />
            View Album
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

        {/* Body */}
        <div className="modal__body">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="badge badge--blue">{gallery.category}</span>
          </div>

          <h3 className="m-0 mb-3 text-xl font-bold text-[var(--admin-ink)]">
            {gallery.title}
          </h3>

          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formatDate(gallery.date)}
            </span>
            <span>{gallery.photoCount} photos</span>
            <span>{gallery.views.toLocaleString()} views</span>
          </div>

          {photos.length > 0 && (
            <section>
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-3">
                Photos ({photos.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-[var(--admin-line)] overflow-hidden bg-[var(--admin-surface-2)]"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.title || `Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2">
                      {photo.title && (
                        <p className="text-xs font-medium text-[var(--admin-ink)] m-0 mb-1 truncate">
                          {photo.title}
                        </p>
                      )}
                      <p className="text-[0.65rem] text-[var(--admin-muted)] m-0 break-all leading-tight">
                        {photo.url}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {photos.length === 0 && (
            <div className="flex flex-col items-center py-8 text-[var(--admin-muted)]">
              <ImageIcon size={32} className="opacity-30 mb-2" />
              <p className="text-sm m-0">No photos in this album.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal__foot">
          <button
            type="button"
            className="admin-btn"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
