"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Scholarship } from "@/types/scholarships";
import { Eye, X } from "lucide-react";

interface ScholarshipsViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarship: Scholarship | null;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ScholarshipsViewModal({
  open,
  onOpenChange,
  scholarship,
}: ScholarshipsViewModalProps) {
  if (!scholarship) return null;

  const typeBadgeColor = (type: string) => {
    switch (type) {
      case "Merit": return "blue";
      case "Need-based": return "green";
      case "University": return "violet";
      case "Category": return "gold";
      default: return "gray";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <Eye size={18} />
            View Scholarship
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

        <div className="modal__body">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`badge badge--${typeBadgeColor(scholarship.type)}`}>
              {scholarship.type}
            </span>
            <span
              className={`badge badge--${
                scholarship.active ? "green" : "gray"
              } lowercase`}
            >
              {scholarship.active ? "Active" : "Inactive"}
            </span>
          </div>

          <h3 className="m-0 mb-3 text-xl font-bold text-[var(--admin-ink)]">
            {scholarship.title}
          </h3>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0 mb-4 text-sm">
            <dt className="font-semibold">Slug</dt>
            <dd className="m-0 text-[var(--admin-muted)] break-all">
              {scholarship.slug}
            </dd>
            <dt className="font-semibold">Created</dt>
            <dd className="m-0 text-[var(--admin-muted)]">
              {formatDate(scholarship.createdAt)}
            </dd>
            <dt className="font-semibold">Updated</dt>
            <dd className="m-0 text-[var(--admin-muted)]">
              {formatDate(scholarship.updatedAt)}
            </dd>
          </dl>

          {scholarship.desc && (
            <section>
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Description
              </h4>
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: scholarship.desc }}
              />
            </section>
          )}
        </div>

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
