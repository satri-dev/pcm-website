"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Testimonial, TestimonialStatus } from "@/types/testimonial";
import { CalendarDays, X } from "lucide-react";

interface TestimonialViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null;
  onApprove?: (item: Testimonial) => void;
  onReject?: (item: Testimonial) => void;
}

const STATUS_LABELS: Record<TestimonialStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_CLASS: Record<TestimonialStatus, string> = {
  pending: "gold",
  approved: "green",
  rejected: "red",
};

function formatDate(dateString: string) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TestimonialViewModal({
  open,
  onOpenChange,
  testimonial,
  onApprove,
  onReject,
}: TestimonialViewModalProps) {
  if (!testimonial) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[min(100%,680px)] sm:max-w-[680px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Head */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <CalendarDays size={18} />
            Testimonial Details
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
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`badge badge--${STATUS_CLASS[testimonial.status]} lowercase`}>
              {STATUS_LABELS[testimonial.status]}
            </span>
            {testimonial.program && (
              <span className="badge badge--blue">{testimonial.program}</span>
            )}
            {testimonial.batch && (
              <span className="badge badge--gray">Batch {testimonial.batch}</span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3 mb-1">
            {testimonial.photo ? (
              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="avatar-sm">
                {testimonial.name.substring(0, 2).toUpperCase()}
              </span>
            )}
            <div>
              <h3 className="m-0 text-xl font-bold text-[var(--admin-ink)]">
                {testimonial.name}
              </h3>
              <p className="m-0 text-sm text-[var(--admin-muted)]">
                {testimonial.position || "No position"} · Submitted{" "}
                {formatDate(testimonial.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-[var(--admin-line)] bg-[var(--admin-surface-2)] p-4">
            <div
              className="prose-sm text-sm leading-relaxed text-[var(--admin-ink)]"
              dangerouslySetInnerHTML={{ __html: testimonial.content }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal__foot">
          <div className="flex items-center justify-between w-full gap-2 flex-wrap">
            <button
              type="button"
              className="admin-btn"
              onClick={() => onOpenChange(false)}
            >
              Close
            </button>
            {testimonial.status !== "approved" && (
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={() => {
                  onApprove?.(testimonial);
                  onOpenChange(false);
                }}
              >
                Approve
              </button>
            )}
            {testimonial.status !== "rejected" && (
              <button
                type="button"
                className="admin-btn"
                onClick={() => {
                  onReject?.(testimonial);
                  onOpenChange(false);
                }}
              >
                Reject
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
