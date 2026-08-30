"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Alumni } from "@/types/alumni";
import { Eye, X } from "lucide-react";

interface AlumniViewModalProps { open: boolean; onOpenChange: (open: boolean) => void; alumni: Alumni | null; }

export default function AlumniViewModal({ open, onOpenChange, alumni }: AlumniViewModalProps) {
  if (!alumni) return null;
  const row = (label: string, value: React.ReactNode) => (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.5rem", padding: "0.55rem 0", borderBottom: "1px dashed #e2e7f0" }}>
      <b style={{ fontSize: ".8rem", color: "#5c6678" }}>{label}</b><div>{value || "—"}</div>
    </div>
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2"><Eye size={18} /> Alumni</DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>
        <div className="modal__body">
          {row("Full name", alumni.name)}
          {row("Batch", alumni.batch)}
          {row("Program", alumni.program)}
          {row("Sector", <span className="badge badge--blue">{alumni.sector}</span>)}
          {row("Role / company", alumni.role)}
          {row("Location", alumni.location)}
          {row("Photo", alumni.photo ? <img src={alumni.photo} alt="" style={{ maxWidth: 180, maxHeight: 110, borderRadius: 8, border: "1px solid #e2e7f0" }} /> : "—")}
        </div>
        <div className="modal__foot"><button type="button" className="admin-btn" onClick={() => onOpenChange(false)}>Close</button></div>
      </DialogContent>
    </Dialog>
  );
}
