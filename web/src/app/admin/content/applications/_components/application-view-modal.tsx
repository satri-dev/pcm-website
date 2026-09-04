"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Application, FileEntry } from "@/types/application";
import {
  CalendarDays,
  FileText,
  Mail,
  Phone,
  X,
  User,
  MapPin,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Image,
} from "lucide-react";

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

function capitalize(s: string) {
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getFileEntryInfo(entry: FileEntry): { url: string; name: string } {
  if (typeof entry === "string") {
    const url = entry;
    return { url, name: url.split("/").pop() || url };
  }
  return { url: entry.url, name: entry.name };
}

/* ── Label map: field IDs → human-readable labels ── */
const FIELD_LABELS: Record<string, string> = {
  program_name: "Programme",
  shift: "Shift",
  name: "Full Name",
  gender: "Gender",
  dob: "Date of Birth",
  date_option: "Date Format",
  nationality: "Nationality",
  phone: "Phone",
  personal_contact: "Personal Contact",
  email: "Email",
  guardian_type: "Guardian Type",
  father_name: "Father's Name",
  father_phone: "Father's Phone",
  mother_name: "Mother's Name",
  mother_phone: "Mother's Phone",
  guardian_name: "Guardian Name",
  guardian_phone: "Guardian Phone",
  relationship: "Relationship",
  permanent_province: "Province",
  permanent_district: "District",
  permanent_city: "Municipality / City",
  permanent_ward: "Ward",
  same_address: "Same as Permanent",
  temporary_province: "Province",
  temporary_district: "District",
  temporary_city: "Municipality / City",
  temporary_ward: "Ward",
  see_bod: "Board",
  see_school: "School",
  see_address: "Address",
  see_gpa: "GPA",
  see_year: "Year",
  see_full_mark: "Full Marks",
  see_mark_obtained: "Marks Obtained",
  see_percentage_obtained: "Percentage",
  intermediate_bod: "Board",
  intermediate_school: "School",
  intermediate_address: "Address",
  intermediate_gpa: "GPA",
  intermediate_year: "Year",
  intermediate_full_mark: "Full Marks",
  intermediate_mark_obtained: "Marks Obtained",
  intermediate_percentage_obtained: "Percentage",
  agree_terms: "Agreed to Terms",
};

/* ── Fields to skip (already shown in header or not meaningful) ── */
const SKIP_FIELDS = new Set(["agree_terms"]);

/* ── Section grouping ── */
function getSection(key: string): string {
  if (key.startsWith("see_")) return "SEE / SLC";
  if (key.startsWith("intermediate_")) return "+2 / Intermediate";
  if (key.startsWith("permanent_")) return "Permanent Address";
  if (key.startsWith("temporary_")) return "Temporary Address";
  if (["father_name", "father_phone", "mother_name", "mother_phone", "guardian_name", "guardian_phone", "guardian_type", "relationship"].includes(key)) return "Guardian Details";
  if (["program_name", "shift", "name", "gender", "dob", "date_option", "nationality", "phone", "personal_contact", "email"].includes(key)) return "Personal Details";
  return "Other";
}

function SectionGroup({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="flex items-center gap-2 text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-3 pb-2 border-b border-[var(--admin-line)]">
        {icon}
        {title}
      </h4>
      <dl className="m-0 text-sm space-y-2">{children}</dl>
    </div>
  );
}

function FieldRow({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  if (value === null || value === undefined || value === "" || value === "—") return null;
  return (
    <div className="grid grid-cols-[150px_1fr] gap-x-3 items-start">
      <dt className="m-0 font-semibold text-[var(--admin-muted)] text-xs leading-relaxed">{label}</dt>
      <dd className={`m-0 break-words leading-relaxed ${highlight ? "font-semibold text-[var(--admin-ink)]" : ""}`}>{value}</dd>
    </div>
  );
}

function FileEntryList({ title, entries }: { title: string; entries?: FileEntry[] }) {
  if (!entries || entries.length === 0) return null;
  return (
    <div className="mb-5">
      <h4 className="flex items-center gap-2 text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-3 pb-2 border-b border-[var(--admin-line)]">
        <FileText size={14} />
        {title}
      </h4>
      <div className="space-y-1.5">
        {entries.map((entry, i) => {
          const { url, name } = getFileEntryInfo(entry);
          const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes("cloudinary.com/image");
          return (
            <div key={i} className="flex items-center gap-3 text-sm">
              {isImage ? (
                <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
                  <img src={url} alt={name} className="h-12 w-12 object-cover rounded border border-gray-200" />
                  <div className="min-w-0">
                    <span className="block text-[var(--admin-brand)] font-medium truncate group-hover:underline">{name}</span>
                    <span className="text-xs text-[var(--admin-muted)]">Click to view full size</span>
                  </div>
                </a>
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[var(--admin-brand)] hover:underline min-w-0"
                >
                  <FileText size={14} className="shrink-0 text-gray-400" />
                  <span className="truncate">{name}</span>
                  <ExternalLink size={12} className="shrink-0 text-gray-300" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ApplicationViewModal({
  open,
  onOpenChange,
  application,
}: ApplicationViewModalProps) {
  if (!application) return null;

  const data = application.data ?? {};
  const form = (data.form ?? {}) as Record<string, unknown>;

  // Group form fields by section
  const sections: Record<string, Array<{ key: string; label: string; value: React.ReactNode }>> = {};

  for (const [key, value] of Object.entries(form)) {
    if (SKIP_FIELDS.has(key)) continue;

    const label = FIELD_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const section = getSection(key);

    let display: React.ReactNode;
    if (typeof value === "boolean") {
      display = value ? "Yes" : "No";
    } else if (Array.isArray(value)) {
      display = value.length ? value.join(", ") : "—";
    } else if (value === null || value === undefined || value === "") {
      display = "—";
    } else if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"))) {
      const isImage = value.includes("cloudinary.com") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value);
      if (isImage) {
        display = (
          <div className="flex items-center gap-2">
            <img src={value} alt={label} className="h-14 w-14 object-cover rounded border border-gray-200" />
            <a href={value} target="_blank" rel="noreferrer" className="text-xs text-[var(--admin-brand)] hover:underline">View full size</a>
          </div>
        );
      } else {
        display = (
          <a href={value} target="_blank" rel="noreferrer" className="text-[var(--admin-brand)] hover:underline break-all text-xs">
            {value.length > 60 ? value.slice(0, 60) + "…" : value}
          </a>
        );
      }
    } else {
      display = String(value);
    }

    if (!sections[section]) sections[section] = [];
    sections[section].push({ key, label, value: display });
  }

  // Section icon mapping
  const sectionIcons: Record<string, React.ReactNode> = {
    "Personal Details": <User size={14} />,
    "Guardian Details": <User size={14} />,
    "Permanent Address": <MapPin size={14} />,
    "Temporary Address": <MapPin size={14} />,
    "SEE / SLC": <GraduationCap size={14} />,
    "+2 / Intermediate": <GraduationCap size={14} />,
  };

  // Section display order
  const sectionOrder = [
    "Personal Details",
    "Guardian Details",
    "Permanent Address",
    "Temporary Address",
    "SEE / SLC",
    "+2 / Intermediate",
    "Other",
  ];

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
          {/* Header badges */}
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

          {/* Name & meta */}
          <h3 className="m-0 mb-1 text-xl font-bold text-[var(--admin-ink)]">
            {application.name}
          </h3>
          <p className="m-0 mb-4 text-sm text-[var(--admin-muted)]">
            Submitted {formatDate(application.submittedAt)}
          </p>

          {/* Contact row */}
          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-5 pb-4 border-b border-[var(--admin-line)]">
            <span className="inline-flex items-center gap-1.5">
              <Mail size={14} />
              {application.email || "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone size={14} />
              {application.phone || "—"}
            </span>
          </div>

          {/* Documents */}
          <FileEntryList title="Documents" entries={data.documents} />
          <FileEntryList title="Payment Slips" entries={data.paymentSlips} />

          {/* Terms */}
          {data.agreedToTerms === true && (
            <div className="mb-5">
              <span className="inline-flex items-center gap-1.5 text-sm text-green-700 font-medium">
                <CheckCircle2 size={14} className="text-green-500" />
                Terms &amp; Conditions Agreed
              </span>
            </div>
          )}

          {/* Dynamic form sections */}
          {sectionOrder.map((section) => {
            const fields = sections[section];
            if (!fields || fields.length === 0) return null;
            return (
              <SectionGroup key={section} title={section} icon={sectionIcons[section] || <User size={14} />}>
                {fields.map(({ key, label, value }) => (
                  <FieldRow key={key} label={label} value={value} />
                ))}
              </SectionGroup>
            );
          })}

          {Object.keys(sections).length === 0 && (
            <p className="m-0 text-sm text-[var(--admin-muted)]">No form data captured.</p>
          )}
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
