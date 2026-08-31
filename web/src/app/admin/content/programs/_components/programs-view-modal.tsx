"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Program } from "@/types/programs";
import { Eye, X, Users, Clock } from "lucide-react";

interface ProgramsViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program | null;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProgramsViewModal({
  open,
  onOpenChange,
  program,
}: ProgramsViewModalProps) {
  if (!program) return null;

  const statusBadge = program.status === "open" ? "green" : "red";

  const levelBadgeColor = (level: string) => {
    switch (level) {
      case "Bachelor": return "blue";
      case "Bachelor (Finance)": return "violet";
      case "Bachelor (IT)": return "gold";
      default: return "gray";
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
            <Eye size={18} />
            View Program
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
          {program.image && (
            <div className="img-prev mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={program.image} alt={program.name} />
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`badge badge--${levelBadgeColor(program.level)}`}>
              {program.level}
            </span>
            <span className={`badge badge--${statusBadge} lowercase`}>
              {program.status}
            </span>
            <span className="badge badge--blue">{program.code}</span>
          </div>

          <h3 className="m-0 mb-3 text-xl font-bold text-[var(--admin-ink)]">
            {program.name}
          </h3>

          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              {program.duration}
            </span>
            <span>{program.semesters} semesters</span>
            <span>{program.creditHours} credit hrs</span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={14} />
              {program.seats} seats
            </span>
            <span>{program.views.toLocaleString()} views</span>
          </div>

          {program.affiliation && (
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="badge badge--blue">{program.affiliation}</span>
            </div>
          )}

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0 mb-4 text-sm">
            <dt className="font-semibold">Slug</dt>
            <dd className="m-0 text-[var(--admin-muted)] break-all">
              {program.slug}
            </dd>
            <dt className="font-semibold">Created</dt>
            <dd className="m-0 text-[var(--admin-muted)]">
              {formatDate(program.createdAt)}
            </dd>
            <dt className="font-semibold">Updated</dt>
            <dd className="m-0 text-[var(--admin-muted)]">
              {formatDate(program.updatedAt)}
            </dd>
          </dl>

          {program.intro && (
            <section className="mb-4">
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Intro
              </h4>
              <div
                className="text-sm leading-relaxed [&_p]:my-2 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-1.5 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[var(--admin-brand)] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--admin-line)] [&_blockquote]:pl-3 [&_blockquote]:italic [&_img]:max-w-full [&_img]:rounded-lg"
                dangerouslySetInnerHTML={{ __html: program.intro }}
              />
            </section>
          )}

          {program.eligibility && (
            <section>
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Eligibility
              </h4>
              <div
                className="text-sm leading-relaxed [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[var(--admin-brand)] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: program.eligibility }}
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
