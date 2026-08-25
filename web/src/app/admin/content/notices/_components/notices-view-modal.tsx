"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Notice } from "@/types/notices";
import { CalendarDays, Eye, FileText, X } from "lucide-react";

interface NoticeViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: Notice | null;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NoticeViewModal({
  open,
  onOpenChange,
  notice,
}: NoticeViewModalProps) {
  if (!notice) return null;

  const statusBadge = notice.status === "published" ? "green" : "gold";

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
            View Notice
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
            <span className="badge badge--blue">{notice.category}</span>
            <span className={`badge badge--${statusBadge} lowercase`}>
              {notice.status}
            </span>
          </div>

          <h3 className="m-0 mb-3 text-xl font-bold text-[var(--admin-ink)]">
            {notice.title}
          </h3>

          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formatDate(notice.date)}
            </span>
            <span>{notice.views.toLocaleString()} views</span>
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0 mb-4 text-sm">
            <dt className="font-semibold">Slug</dt>
            <dd className="m-0 text-[var(--admin-muted)] break-all">
              {notice.slug}
            </dd>
          </dl>

          {notice.description && (
            <section className="mb-4">
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Description
              </h4>
              <p className="text-sm leading-relaxed m-0">
                {notice.description}
              </p>
            </section>
          )}

          {notice.fileName && (
            <section>
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Attachment
              </h4>
              <a
                href={notice.fileUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--admin-brand)] hover:underline"
              >
                <FileText size={16} />
                {notice.fileName}
              </a>
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
