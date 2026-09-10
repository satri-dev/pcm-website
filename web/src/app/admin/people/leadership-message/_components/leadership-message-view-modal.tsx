"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LeadershipMessage } from "@/types/leadership-message";
import { Eye, X } from "lucide-react";

interface LeadershipMessageViewModalProps { open: boolean; onOpenChange: (open: boolean) => void; message: LeadershipMessage | null; }

export default function LeadershipMessageViewModal({ open, onOpenChange, message }: LeadershipMessageViewModalProps) {
  if (!message) return null;
  const row = (label: string, value: React.ReactNode) => (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.5rem", padding: "0.55rem 0", borderBottom: "1px dashed #e2e7f0" }}>
      <b style={{ fontSize: ".8rem", color: "#5c6678" }}>{label}</b><div>{value || "—"}</div>
    </div>
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2"><Eye size={18} /> Message</DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>
        <div className="modal__body">
          {message.photo && (
            <div style={{ display: "flex", justifyContent: "center", padding: "0.4rem 0 0.9rem" }}>
              <img src={message.photo} alt={message.author} style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "1px solid #e2e7f0" }} />
            </div>
          )}
          {row("Title", message.title)}
          {row("Author", message.author)}
          {row("Role", message.role)}
          {row("Order", String(message.order ?? "—"))}
          {row("Excerpt", <div style={{ whiteSpace: "pre-wrap" }}>{message.excerpt}</div>)}
        </div>
        <div className="modal__foot"><button type="button" className="admin-btn" onClick={() => onOpenChange(false)}>Close</button></div>
      </DialogContent>
    </Dialog>
  );
}
