"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Alumni } from "@/types/alumni";
import { Eye, GraduationCap, Mail, MapPin, Phone, X } from "lucide-react";

interface AlumniViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alumni: Alumni | null;
}

export default function AlumniViewModal({ open, onOpenChange, alumni }: AlumniViewModalProps) {
  if (!alumni) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <Eye size={18} /> View Alumni
          </DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>

        <div className="modal__body">
          <div className="flex items-center gap-4 mb-4">
            {alumni.image && <img src={alumni.image} alt={alumni.name} className="w-20 h-20 rounded-full object-cover border border-[var(--admin-line)]" />}
            <div>
              <h3 className="m-0 text-xl font-bold text-[var(--admin-ink)]">{alumni.name}</h3>
              <p className="m-0 text-sm text-[var(--admin-muted)]">Batch: {alumni.batch} · {alumni.program}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5"><Mail size={14} />{alumni.email}</span>
            <span className="inline-flex items-center gap-1.5"><Phone size={14} />{alumni.phone}</span>
            {alumni.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{alumni.location}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            {alumni.currentCompany && <div><b>Company:</b> {alumni.currentCompany}</div>}
            {alumni.designation && <div><b>Designation:</b> {alumni.designation}</div>}
            {alumni.linkedin && <div><b>LinkedIn:</b> <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--admin-brand)] underline">{alumni.linkedin}</a></div>}
          </div>

          {alumni.bio && <div className="text-sm text-[var(--admin-ink)] whitespace-pre-wrap">{alumni.bio}</div>}
        </div>

        <div className="modal__foot">
          <button type="button" className="admin-btn" onClick={() => onOpenChange(false)}>Close</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
