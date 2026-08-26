"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Club } from "@/types/clubs";
import { Eye, X } from "lucide-react";

interface ClubsViewModalProps { open: boolean; onOpenChange: (open: boolean) => void; club: Club | null; }

export default function ClubsViewModal({ open, onOpenChange, club }: ClubsViewModalProps) {
  if (!club) return null;
  const row = (label: string, value: React.ReactNode) => (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.5rem", padding: "0.55rem 0", borderBottom: "1px dashed #e2e7f0" }}>
      <b style={{ fontSize: ".8rem", color: "#5c6678" }}>{label}</b><div>{value || "---"}</div>
    </div>
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,720px)] sm:max-w-[720px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2"><Eye size={18} /> {club.icon} {club.name}</DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>
        <div className="modal__body">
          {row("Name", club.name)}
          {row("Icon", <span className="text-2xl">{club.icon}</span>)}
          {row("Tagline", club.tagline)}
          {row("Description", <div style={{ whiteSpace: "pre-wrap" }}>{club.desc}</div>)}
          {row("Image", club.image ? <img src={club.image} alt="" style={{ maxWidth: 180, maxHeight: 110, borderRadius: 8, border: "1px solid #e2e7f0" }} /> : "---")}
          {club.members && club.members.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <b style={{ fontSize: ".8rem", color: "#5c6678", display: "block", marginBottom: 8 }}>Members ({club.members.length})</b>
              <div className="flex flex-col gap-2">
                {club.members.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--admin-line)] bg-[var(--admin-surface)]">
                    <div className="flex-1"><div className="font-semibold text-sm">{m.name}</div><small className="text-[var(--admin-muted)]">{m.position}{m.program ? ` / ${m.program}` : ""}</small></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="modal__foot"><button type="button" className="admin-btn" onClick={() => onOpenChange(false)}>Close</button></div>
      </DialogContent>
    </Dialog>
  );
}
