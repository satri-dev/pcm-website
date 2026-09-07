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
  Settings2,
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
  // Personal Info (Step 1)
  programme: "Programme",
  program_name: "Programme",
  shift: "Shift",
  name: "Full Name",
  full_name: "Full Name",
  students_full_name: "Student's Full Name",
  gender: "Gender",
  dob: "Date of Birth",
  date_of_birth: "Date of Birth",
  date_option: "Date Format",
  nationality: "Nationality",
  phone: "Phone",
  phone_number: "Phone Number",
  personal_contact: "Personal Contact",
  email: "Email",
  email_address: "Email Address",
  
  // Guardian Info (Step 1)
  guardian_type: "Guardian Type",
  father_name: "Father's Name",
  father_phone: "Father's Phone",
  mother_name: "Mother's Name",
  mother_phone: "Mother's Phone",
  guardian_name: "Guardian Name",
  guardian_phone: "Guardian Phone",
  guardian_relationship: "Relationship with Guardian",
  relationship: "Relationship",
  permanent_province: "Province",
  province_permanent: "Province",
  permanent_district: "District",
  district_permanent: "District",
  permanent_city: "Municipality / City",
  city_municipality_permanent: "Municipality / City",
  permanent_ward: "Ward",
  ward_no_permanent: "Ward",
  same_address: "Same as Permanent",
  temporary_address_same_as_permanent: "Same as Permanent",
  temporary_province: "Province",
  province_temporary: "Province",
  temporary_district: "District",
  district_temporary: "District",
  temporary_city: "Municipality / City",
  city_municipality_temporary: "Municipality / City",
  temporary_ward: "Ward",
  ward_no_temporary: "Ward",
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
  imagee: "Profile Image",
};

/* ── Fields to skip (already shown in header or not meaningful) ── */
const SKIP_FIELDS = new Set(["agree_terms"]);

/* ── Section grouping by form steps ── */
function getSection(key: string): string {
  if (key.startsWith("see_")) return "SEE / SLC";
  if (key.startsWith("intermediate_")) return "+2 / Intermediate";
  if (key.startsWith("permanent_") || key.endsWith("_permanent")) return "Permanent Address";
  if (key.startsWith("temporary_") || key.endsWith("_temporary")) return "Temporary Address";
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

function FileEntryList({ title, entries, fieldLabels }: { title: string; entries?: FileEntry[]; fieldLabels?: string[] }) {
  if (!entries || entries.length === 0) return null;
  return (
    <div className="mb-5">
      <h4 className="flex items-center gap-2 text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-3 pb-2 border-b border-[var(--admin-line)]">
        <FileText size={14} />
        {title}
      </h4>
      <div className="space-y-2.5">
        {entries.map((entry, i) => {
          const { url, name } = getFileEntryInfo(entry);
          const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes("cloudinary.com/image");
          const fieldLabel = fieldLabels && fieldLabels[i] ? fieldLabels[i] : null;
          
          return (
            <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              {fieldLabel && (
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  {fieldLabel}
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
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
  
  // Get guardian type to filter fields
  const guardianType = form.guardian_type as string | undefined;

  // Group form fields by section
  const sections: Record<string, Array<{ key: string; label: string; value: React.ReactNode }>> = {};

  for (const [key, value] of Object.entries(form)) {
    if (SKIP_FIELDS.has(key)) continue;

    // Filter guardian fields based on selected type
    if (guardianType) {
      if (guardianType === "father") {
        if (["mother_name", "mother_phone", "guardian_name", "guardian_phone", "relationship"].includes(key)) {
          continue; // Skip mother and other guardian fields
        }
      } else if (guardianType === "mother") {
        if (["father_name", "father_phone", "guardian_name", "guardian_phone", "relationship"].includes(key)) {
          continue; // Skip father and other guardian fields
        }
      } else if (guardianType === "other") {
        if (["father_name", "father_phone", "mother_name", "mother_phone"].includes(key)) {
          continue; // Skip father and mother fields
        }
      }
    }

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
    "Step 1: Personal Information": <User size={14} />,
    "Step 2: Contact Information": <MapPin size={14} />,
    "Step 3: Academic Information": <GraduationCap size={14} />,
    "Step 4: Documents": <FileText size={14} />,
    "Step 5: Declaration": <CheckCircle2 size={14} />,
    "Step 6: Payment": <CreditCard size={14} />,
    "Other Information": <Settings2 size={14} />,
  };

  // Section display order (matches form steps)
  const sectionOrder = [
    "Step 1: Personal Information",
    "Step 2: Contact Information",
    "Step 3: Academic Information",
    "Step 4: Documents",
    "Step 5: Declaration",
    "Step 6: Payment",
    "Other Information",
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
          <FileEntryList 
            title="Documents" 
            entries={data.documents}
            fieldLabels={data.documents?.map((_, i) => {
              // Try to find which field this document belongs to by matching URLs in form data
              const docEntry = data.documents![i];
              const docUrl = typeof docEntry === 'string' ? docEntry : docEntry?.url;
              
              // Search through all form fields to find the one containing this URL
              for (const [fieldKey, fieldValue] of Object.entries(form)) {
                if (typeof fieldValue === 'string' && fieldValue === docUrl) {
                  // Found the field! Return its label
                  const label = FIELD_LABELS[fieldKey];
                  if (label) return label;
                  
                  // Generate label from field key
                  return fieldKey
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());
                }
              }
              
              // Fallback: Generic document label
              return `Document ${i + 1}`;
            })}
          />
          <FileEntryList 
            title="Payment Slips" 
            entries={data.paymentSlips}
            fieldLabels={data.paymentSlips?.map((_, i) => {
              // Try to find payment slip field name
              const slipEntry = data.paymentSlips![i];
              const slipUrl = typeof slipEntry === 'string' ? slipEntry : slipEntry?.url;
              
              for (const [fieldKey, fieldValue] of Object.entries(form)) {
                if (typeof fieldValue === 'string' && fieldValue === slipUrl) {
                  const label = FIELD_LABELS[fieldKey];
                  if (label) return label;
                  
                  return fieldKey
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());
                }
              }
              
              return `Payment Slip ${i + 1}`;
            })}
          />

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
