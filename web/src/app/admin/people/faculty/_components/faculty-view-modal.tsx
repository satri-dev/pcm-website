"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Faculty } from "@/types/faculty";
import { Eye, Mail, Phone, X } from "lucide-react";

interface FacultyViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faculty: Faculty | null;
}

export default function FacultyViewModal({ open, onOpenChange, faculty }: FacultyViewModalProps) {
  if (!faculty) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <Eye size={18} /> Faculty
          </DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>

        <div className="modal__body">
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.5rem", padding: "0.55rem 0", borderBottom: "1px dashed #e2e7f0" }}>
            <b style={{ fontSize: ".8rem", color: "#5c6678" }}>Full name</b>
            <div>{faculty.name}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.5rem", padding: "0.55rem 0", borderBottom: "1px dashed #e2e7f0" }}>
            <b style={{ fontSize: ".8rem", color: "#5c6678" }}>Role</b>
            <div>{faculty.role}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.5rem", padding: "0.55rem 0", borderBottom: "1px dashed #e2e7f0" }}>
            <b style={{ fontSize: ".8rem", color: "#5c6678" }}>Group</b>
            <div><span className="badge badge--blue">{faculty.group}</span></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.5rem", padding: "0.55rem 0", borderBottom: "1px dashed #e2e7f0" }}>
            <b style={{ fontSize: ".8rem", color: "#5c6678" }}>Order</b>
            <div>{faculty.order ?? "—"}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.5rem", padding: "0.55rem 0", borderBottom: "1px dashed #e2e7f0" }}>
            <b style={{ fontSize: ".8rem", color: "#5c6678" }}>Photo</b>
            <div>{faculty.photo ? <img src={faculty.photo} alt="" style={{ maxWidth: 180, maxHeight: 110, borderRadius: 8, border: "1px solid #e2e7f0" }} /> : "—"}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.5rem", padding: "0.55rem 0", borderBottom: "1px dashed #e2e7f0" }}>
            <b style={{ fontSize: ".8rem", color: "#5c6678" }}>Email</b>
            <div>{faculty.email || "—"}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "0.5rem", padding: "0.55rem 0", borderBottom: "1px dashed #e2e7f0" }}>
            <b style={{ fontSize: ".8rem", color: "#5c6678" }}>Phone</b>
            <div>{faculty.phone || "—"}</div>
          </div>
        </div>

        <div className="modal__foot">
          <button type="button" className="admin-btn" onClick={() => onOpenChange(false)}>Close</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
