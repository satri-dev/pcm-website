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
            <Eye size={18} /> View Faculty
          </DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>

        <div className="modal__body">
          <div className="flex items-center gap-4 mb-4">
            {faculty.image && <img src={faculty.image} alt={faculty.name} className="w-20 h-20 rounded-full object-cover border border-[var(--admin-line)]" />}
            <div>
              <h3 className="m-0 text-xl font-bold text-[var(--admin-ink)]">{faculty.name}</h3>
              <p className="m-0 text-sm text-[var(--admin-muted)]">{faculty.designation} · {faculty.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5"><Mail size={14} />{faculty.email}</span>
            <span className="inline-flex items-center gap-1.5"><Phone size={14} />{faculty.phone}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div><b>Qualification:</b> {faculty.qualification}</div>
            <div><b>Experience:</b> {faculty.experience}</div>
            <div><b>Status:</b> <span className={`badge ${faculty.status === "active" ? "badge--green" : "badge--gray"}`}>{faculty.status}</span></div>
          </div>

          {faculty.bio && <div className="text-sm text-[var(--admin-ink)] whitespace-pre-wrap">{faculty.bio}</div>}
        </div>

        <div className="modal__foot">
          <button type="button" className="admin-btn" onClick={() => onOpenChange(false)}>Close</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
