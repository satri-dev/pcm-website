"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "../types/download";
import {
  CalendarDays,
  Eye,
  FileText,
  Download as DownloadIcon,
  X,
} from "lucide-react";

interface DownloadViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  download: Download | null;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DownloadViewModal({
  open,
  onOpenChange,
  download,
}: DownloadViewModalProps) {
  if (!download) return null;

  const statusBadge = download.status === "published" ? "green" : "gold";

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
            View Download
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
            <span className="badge badge--blue">{download.category}</span>
            <span className={`badge badge--${statusBadge} lowercase`}>
              {download.status}
            </span>
          </div>

          <h3 className="m-0 mb-3 text-xl font-bold text-[var(--admin-ink)]">
            {download.title}
          </h3>

          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formatDate(download.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <DownloadIcon size={14} />
              {download.downloadCount} downloads
            </span>
          </div>

          {download.description && (
            <section className="mb-4">
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Description
              </h4>
              <div
                className="text-sm leading-relaxed m-0 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: download.description }}
              />
            </section>
          )}

          <section className="mb-4">
            <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
              File Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-[var(--admin-muted)]">File Name:</span>
                <div className="font-medium">{download.fileName || "—"}</div>
              </div>
              <div>
                <span className="text-[var(--admin-muted)]">File Type:</span>
                <div className="font-medium">
                  {download.fileType || "—"}
                </div>
              </div>
              <div>
                <span className="text-[var(--admin-muted)]">File Size:</span>
                <div className="font-medium">
                  {download.fileSize || "—"}
                </div>
              </div>
            </div>
          </section>

          {download.fileUrl && (
            <section>
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Download Link
              </h4>
              <a
                href={download.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--admin-brand)] hover:underline"
              >
                <FileText size={16} />
                {download.fileName || "Download file"}
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
