"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LeadershipMessage } from "@/types/leadership-message";
import { Eye, Mail, Phone, X } from "lucide-react";

interface LeadershipMessageViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: LeadershipMessage | null;
}

export default function LeadershipMessageViewModal({ open, onOpenChange, message }: LeadershipMessageViewModalProps) {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <Eye size={18} /> View Message
          </DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>

        <div className="modal__body">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="badge badge--blue">{message.type}</span>
            <span className={`badge ${message.status === "active" ? "badge--green" : "badge--gray"}`}>{message.status}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            {message.image && <img src={message.image} alt={message.name} className="w-20 h-20 rounded-full object-cover border border-[var(--admin-line)]" />}
            <div>
              <h3 className="m-0 text-xl font-bold text-[var(--admin-ink)]">{message.name}</h3>
              <p className="m-0 text-sm text-[var(--admin-muted)]">{message.designation}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5"><Mail size={14} />{message.email}</span>
            <span className="inline-flex items-center gap-1.5"><Phone size={14} />{message.phone}</span>
          </div>

          <div className="text-sm text-[var(--admin-ink)] whitespace-pre-wrap bg-[var(--admin-surface-2)] p-4 rounded-lg border border-[var(--admin-line)]">
            {message.message}
          </div>
        </div>

        <div className="modal__foot">
          <button type="button" className="admin-btn" onClick={() => onOpenChange(false)}>Close</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
