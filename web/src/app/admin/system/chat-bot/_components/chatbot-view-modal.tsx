"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChatbotEntry } from "../types/chatbot";
import { Eye, X } from "lucide-react";

interface ChatbotViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: ChatbotEntry | null;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ChatbotViewModal({
  open,
  onOpenChange,
  entry,
}: ChatbotViewModalProps) {
  if (!entry) return null;

  const channelBadgeColor = (channel: string) => {
    switch (channel) {
      case "Website":
        return "blue";
      case "Facebook Messenger":
        return "blue";
      case "WhatsApp":
        return "green";
      case "Instagram":
        return "violet";
      case "Viber":
        return "violet";
      case "General":
        return "gray";
      default:
        return "gray";
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
            <Eye size={18} /> View Chatbot Entry
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
            <span
              className={`badge badge--${channelBadgeColor(entry.channel)}`}
            >
              {entry.channel}
            </span>
            <span
              className={`badge badge--${entry.active ? "green" : "red"}`}
            >
              {entry.active ? "Active" : "Inactive"}
            </span>
          </div>

          <h3 className="m-0 mb-3 text-xl font-bold text-[var(--admin-ink)]">
            {entry.question}
          </h3>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0 mb-4 text-sm">
            <dt className="font-semibold">Channel</dt>
            <dd className="m-0 text-[var(--admin-muted)]">{entry.channel}</dd>
            <dt className="font-semibold">Created</dt>
            <dd className="m-0 text-[var(--admin-muted)]">
              {formatDate(entry.createdAt)}
            </dd>
            <dt className="font-semibold">Updated</dt>
            <dd className="m-0 text-[var(--admin-muted)]">
              {formatDate(entry.updatedAt)}
            </dd>
          </dl>

          {entry.keywords.length > 0 && (
            <section className="mb-4">
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {entry.keywords.map((kw) => (
                  <span key={kw} className="badge badge--gray">
                    {kw}
                  </span>
                ))}
              </div>
            </section>
          )}

          {entry.answer && (
            <section>
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Answer
              </h4>
              <div
                className="text-sm leading-relaxed [&_p]:my-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[var(--admin-brand)] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: entry.answer }}
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
