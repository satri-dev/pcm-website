"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import type { BlogStudent } from "@/types/blog-student";

interface BlogStudentViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: BlogStudent | null;
}

export default function BlogStudentViewModal({
  open,
  onOpenChange,
  item,
}: BlogStudentViewModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[min(100%,680px)] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            Article Preview
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
          {!item ? (
            <p className="text-[var(--admin-muted)]">No article selected.</p>
          ) : (
            <div className="grid gap-4">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full aspect-[16/8] object-cover rounded-xl"
                />
              )}

              <div className="flex flex-wrap items-center gap-2 text-[0.78rem]">
                <span className={`badge ${item.status === "approved" ? "badge--green" : "badge--gold"}`}>
                  {item.status}
                </span>
                <span className="badge badge--blue">{item.category || "Other"}</span>
                {item.tag && <span className="badge badge--violet">{item.tag}</span>}
              </div>

              <div>
                <h3 className="text-[1.2rem] font-bold text-[var(--admin-ink)]">
                  {item.title}
                </h3>
                <p className="text-[0.85rem] text-[var(--admin-muted)]">
                  By <b>{item.author}</b> · {formatDate(item.date)} · /blogs-student/{item.slug}
                </p>
              </div>

              {item.excerpt && (
                <div>
                  <b className="text-[var(--admin-ink)]">Summary</b>
                  <div
                    className="prose prose-sm max-w-none mt-1 text-[var(--admin-ink)]"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: item.excerpt }}
                  />
                </div>
              )}

              {item.body && (
                <div>
                  <b className="text-[var(--admin-ink)]">Body</b>
                  <div
                    className="prose prose-sm max-w-none mt-1 text-[var(--admin-ink)]"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: item.body }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal__foot justify-end">
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