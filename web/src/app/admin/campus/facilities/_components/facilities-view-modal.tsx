"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FacilityItem } from "../types/facilities";
import { Eye, X } from "lucide-react";

interface FacilitiesViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility: FacilityItem | null;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const categoryBadgeColor = (category: string) => {
  switch (category) {
    case "Learning":
      return "blue";
    case "Library":
      return "violet";
    case "IT":
      return "green";
    case "Sports":
      return "red";
    case "Student Life":
      return "gold";
    default:
      return "gray";
  }
};

export default function FacilitiesViewModal({
  open,
  onOpenChange,
  facility,
}: FacilitiesViewModalProps) {
  if (!facility) return null;

  const statusBadge = facility.status === "published" ? "green" : "gold";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Header */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <Eye size={18} />
            View Facility
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
          {/* Image */}
          {facility.image && (
            <div className="img-prev mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={facility.image} alt={facility.name} />
            </div>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className={`badge badge--${categoryBadgeColor(facility.category)}`}
            >
              {facility.category}
            </span>
            <span className={`badge badge--${statusBadge} lowercase`}>
              {facility.status}
            </span>
          </div>

          {/* Title row with icon */}
          <h3 className="m-0 mb-3 text-xl font-bold text-[var(--admin-ink)] flex items-center gap-2">
            <span className="text-2xl">{facility.icon}</span>
            {facility.name}
          </h3>

          {/* Meta */}
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0 mb-4 text-sm">
            <dt className="font-semibold">Display Order</dt>
            <dd className="m-0 text-[var(--admin-muted)]">#{facility.order}</dd>

            <dt className="font-semibold">Created</dt>
            <dd className="m-0 text-[var(--admin-muted)]">
              {formatDate(facility.createdAt)}
            </dd>

            <dt className="font-semibold">Last Updated</dt>
            <dd className="m-0 text-[var(--admin-muted)]">
              {formatDate(facility.updatedAt)}
            </dd>
          </dl>

          {/* Description */}
          {facility.description && (
            <section>
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Description
              </h4>
              <div
                className="text-sm leading-relaxed [&_p]:my-2 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-1.5 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[var(--admin-brand)] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--admin-line)] [&_blockquote]:pl-3 [&_blockquote]:italic [&_img]:max-w-full [&_img]:rounded-lg"
                dangerouslySetInnerHTML={{ __html: facility.description }}
              />
            </section>
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
