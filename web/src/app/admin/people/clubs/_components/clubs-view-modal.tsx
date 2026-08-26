"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Club } from "@/types/clubs";
import { Eye, Mail, Phone, X } from "lucide-react";

interface ClubsViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  club: Club | null;
}

export default function ClubsViewModal({ open, onOpenChange, club }: ClubsViewModalProps) {
  if (!club) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <Eye size={18} /> View Club
          </DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>

        <div className="modal__body">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="badge badge--blue">{club.category}</span>
            <span className={`badge ${club.status === "active" ? "badge--green" : "badge--gray"}`}>{club.status}</span>
          </div>

          <h3 className="m-0 mb-3 text-xl font-bold text-[var(--admin-ink)]">{club.name}</h3>

          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5"><Mail size={14} />{club.email}</span>
            {club.phone && <span className="inline-flex items-center gap-1.5"><Phone size={14} />{club.phone}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            {club.president && <div><b>President:</b> {club.president}</div>}
            {club.vicePresident && <div><b>Vice President:</b> {club.vicePresident}</div>}
            <div><b>Faculty Coordinator:</b> {club.facultyCoordinator}</div>
            <div><b>Members:</b> {club.memberCount}</div>
          </div>

          {club.description && <div className="text-sm text-[var(--admin-ink)] whitespace-pre-wrap">{club.description}</div>}
        </div>

        <div className="modal__foot">
          <button type="button" className="admin-btn" onClick={() => onOpenChange(false)}>Close</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
