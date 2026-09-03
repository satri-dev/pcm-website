"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Application } from "@/types/application";
import { CalendarDays, FileText, Mail, Phone, X } from "lucide-react";

interface ApplicationViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
}

const STATUS_LABELS: Record<string, string> = {
  "new": "New",
  "in-review": "In Review",
  "accepted": "Accepted",
  "rejected": "Rejected",
};

const STATUS_CLASS: Record<string, string> = {
  "new": "blue",
  "in-review": "gold",
  "accepted": "green",
  "rejected": "red",
};

function formatDate(dateString: string) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FieldGroup({
  title,
  data,
}: {
  title: string;
  data: Record<string, unknown> | undefined;
}) {
  if (!data || Object.keys(data).length === 0) return null;
  const entries = Object.entries(data).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return null;
  return (
    <section className="mb-4">
      <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
        {title}
      </h4>
      <dl className="m-0 text-sm space-y-1.5">
        {entries.map(([key, value]) => (
          <div key={key} className="grid grid-cols-[140px_1fr] gap-x-3">
            <dt className="m-0 font-semibold text-[var(--admin-muted)] capitalize">
              {key.replace(/_/g, " ")}
            </dt>
            <dd className="m-0 break-words">
              {String(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function FileList({ title, urls }: { title: string; urls?: string[] }) {
  if (!urls || urls.length === 0) return null;
  return (
    <section className="mb-4">
      <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
        {title}
      </h4>
      <div className="space-y-2">
        {urls.map((url, i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--admin-brand)] break-all hover:underline"
          >
            <FileText size={14} className="shrink-0 text-gray-400" />
            {url.split("/").pop() || url}
          </a>
        ))}
      </div>
    </section>
  );
}

export default function ApplicationViewModal({
  open,
  onOpenChange,
  application,
}: ApplicationViewModalProps) {
  if (!application) return null;

  const data = application.data ?? {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="apps-modal w-[min(100%,720px)] sm:max-w-[720px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Head */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <CalendarDays size={18} />
            Application Details
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

        {/* Body */}
        <div className="modal__body">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`badge badge--${STATUS_CLASS[application.status] || "gray"} lowercase`}>
              {STATUS_LABELS[application.status] || application.status}
            </span>
            <span className="badge badge--blue">
              {application.program?.toUpperCase() || "No program"}
            </span>
            {application.shift && (
              <span className="badge badge--gray capitalize">
                {application.shift}
              </span>
            )}
          </div>

          <h3 className="m-0 mb-1 text-xl font-bold text-[var(--admin-ink)]">
            {application.name}
          </h3>
          <p className="m-0 mb-4 text-sm text-[var(--admin-muted)]">
            Submitted {formatDate(application.submittedAt)}
          </p>

          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Mail size={14} />
              {application.email || "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone size={14} />
              {application.phone || "—"}
            </span>
          </div>

          <FieldGroup title="Basic Information" data={{
            ...(data.program ? { program: data.program } : {}),
            ...(data.shift ? { shift: data.shift } : {}),
            ...(data.gender ? { gender: data.gender } : {}),
            ...(data.dob ? { "date of birth": data.dob } : {}),
            ...(data.dateOption ? { "date option": data.dateOption } : {}),
            ...(data.nationality ? { nationality: data.nationality } : {}),
          }} />

          <FileList title="Documents" urls={data.documents as string[]} />
          <FileList title="Payment Slips" urls={data.paymentSlips as string[]} />

          {data.agreedToTerms === true && (
            <div className="mt-2 mb-4">
              <span className="badge badge--green">
                Terms agreed
              </span>
            </div>
          )}

          {/* Complete dynamic form data captured on submission */}
          <section className="mb-4 pt-4 border-t border-[var(--admin-line)]">
            <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
              Full Form Data
            </h4>
            {Object.entries(data.form ?? {}).length > 0 ? (
              <dl className="m-0 text-sm space-y-1.5">
                {Object.entries(data.form ?? {}).map(([key, value]) => {
                  const label = key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());
                  
                  // Check if value is an image URL
                  const isImageUrl = typeof value === "string" && 
                    (value.startsWith("http://") || value.startsWith("https://")) &&
                    (value.includes("cloudinary.com") || 
                     value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i));
                  
                  let display: React.ReactNode;
                  if (typeof value === "boolean") {
                    display = value ? "Yes" : "No";
                  } else if (Array.isArray(value)) {
                    display = value.length ? value.join(", ") : "—";
                  } else if (value === null || value === undefined || value === "") {
                    display = "—";
                  } else if (isImageUrl) {
                    // Display image thumbnail with link
                    display = (
                      <div className="flex items-center gap-2">
                        <img 
                          src={String(value)} 
                          alt={label}
                          className="h-20 w-20 object-cover rounded border border-gray-200"
                        />
                        <a 
                          href={String(value)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-[var(--admin-brand)] hover:underline break-all"
                        >
                          View full size
                        </a>
                      </div>
                    );
                  } else {
                    display = String(value);
                  }
                  
                  return (
                    <div key={key} className="grid grid-cols-[160px_1fr] gap-x-3">
                      <dt className="m-0 font-semibold text-[var(--admin-muted)]">{label}</dt>
                      <dd className="m-0 break-words">{display}</dd>
                    </div>
                  );
                })}
              </dl>
            ) : (
              <p className="m-0 text-sm text-[var(--admin-muted)]">No form data captured.</p>
            )}
          </section>
        </div>

        {/* Footer */}
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
