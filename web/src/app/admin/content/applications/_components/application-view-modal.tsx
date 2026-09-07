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
  X,
  User,
  MapPin,
  GraduationCap,
  CreditCard,
  ExternalLink,
  Settings2,
} from "lucide-react";

interface ApplicationViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
}

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
const SKIP_FIELDS = new Set(["agree_terms", "date_option"]);

/* ── Section grouping by form steps ── */
function getSection(key: string): string {
  const lowerKey = key.toLowerCase();
  
  // Personal Information
  if (["programme", "program_name", "shift", "name", "full_name", "students_full_name", "gender", "dob", "date_of_birth", "date_option", "nationality", "phone", "phone_number", "personal_contact", "email", "email_address", "imagee"].includes(key)) {
    return "Step 1: Personal Information";
  }
  
  // Guardian Details (part of personal info)
  if (["guardian_type", "father_name", "father_phone", "mother_name", "mother_phone", "guardian_name", "guardian_phone", "guardian_relationship", "relationship"].includes(key)) {
    return "Step 1: Personal Information";
  }
  
  // Contact Information - includes all address fields
  if (lowerKey.includes("province") || lowerKey.includes("district") || 
      lowerKey.includes("city") || lowerKey.includes("ward") || 
      lowerKey.includes("address") || lowerKey.includes("permanent") || 
      lowerKey.includes("temporary") || key === "same_address") {
    return "Step 2: Contact Information";
  }
  
  // Academic Information - includes all SEE and Intermediate fields
  if (lowerKey.includes("see_") || lowerKey.includes("see") || 
      lowerKey.includes("slc") || lowerKey.includes("intermediate") || 
      lowerKey.includes("bod") || lowerKey.includes("board") ||
      (lowerKey.includes("school") && !lowerKey.includes("pre")) ||
      lowerKey.includes("gpa") || lowerKey.includes("percentage") ||
      (lowerKey.includes("mark") && !lowerKey.includes("marksheet")) ||
      (lowerKey.includes("year") && (lowerKey.includes("see") || lowerKey.includes("intermediate")))) {
    return "Step 3: Academic Information";
  }
  
  // Documents
  if (lowerKey.includes("photo") || lowerKey.includes("citizenship") || 
      lowerKey.includes("migration") || lowerKey.includes("transcript") || 
      lowerKey.includes("certificate") || lowerKey.includes("marksheet") ||
      lowerKey.includes("character")) {
    return "Step 4: Documents";
  }
  
  // Declaration (shown as a separate green banner, so route to its own group if present)
  if (key === "agree_terms" || lowerKey.includes("declaration") || lowerKey.includes("terms")) {
    return "Declaration";
  }
  
  // Payment / Payment Slip
  if (lowerKey.includes("payment") || lowerKey.includes("receipt") || lowerKey.includes("slip")) {
    return "Step 5: Payment Slip";
  }
  
  return "Other Information";
}

function SectionGroup({ title, icon, children, stepNumber }: { title: string; icon: React.ReactNode; children: React.ReactNode; stepNumber?: number }) {
  return (
    <div className="mb-5 rounded-xl border-2 border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-[var(--admin-brand)]/30 transition-all">
      <div className="bg-gradient-to-r from-[var(--admin-brand)] to-[var(--admin-brand)]/90 px-5 py-4">
        <div className="flex items-center gap-3">
          {stepNumber && (
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold text-base border-2 border-white/40 shrink-0">
              {stepNumber}
            </span>
          )}
          <div className="flex items-center gap-2.5 flex-1">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm text-white border border-white/25 shrink-0">
              {icon}
            </span>
            <h4 className="text-base font-bold text-white m-0 tracking-wide">
              {title}
            </h4>
          </div>
        </div>
      </div>
      <div className="p-5 bg-gradient-to-b from-gray-50/30 to-white">
        <dl className="m-0 text-sm space-y-0 bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 shadow-sm overflow-hidden">
          {children}
        </dl>
      </div>
    </div>
  );
}

function FieldRow({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  if (value === null || value === undefined || value === "" || value === "—") return null;
  return (
    <div className="grid grid-cols-[150px_1fr] gap-x-5 items-start px-4 py-3 hover:bg-blue-50/30 transition-colors">
      <dt className="m-0 font-bold text-gray-700 text-xs leading-relaxed pt-0.5 uppercase tracking-wide">{label}</dt>
      <dd className={`m-0 break-words leading-relaxed ${highlight ? "font-bold text-[var(--admin-brand)]" : "text-gray-900 font-medium"}`}>{value}</dd>
    </div>
  );
}

function FileRow({ label, entry }: { label: string; entry: FileEntry }) {
  const { url, name } = getFileEntryInfo(entry);
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes("cloudinary.com/image");
  return (
    <div className="grid grid-cols-[150px_1fr] gap-x-5 items-center px-4 py-3 hover:bg-blue-50/30 transition-colors">
      <dt className="m-0 font-bold text-gray-700 text-xs leading-relaxed uppercase tracking-wide">{label}</dt>
      <dd className="m-0 min-w-0">
        {isImage ? (
          <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 group w-full">
            <img src={url} alt={name} className="h-14 w-14 object-cover rounded border-2 border-gray-200 group-hover:border-[var(--admin-brand)] transition-colors shrink-0" />
            <div className="min-w-0">
              <span className="block text-[var(--admin-brand)] font-medium truncate group-hover:underline">{name}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <ExternalLink size={12} />
                Click to view full size
              </span>
            </div>
          </a>
        ) : (
          <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 group w-full min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded bg-blue-50 group-hover:bg-blue-100 transition-colors shrink-0">
              <FileText size={18} className="text-[var(--admin-brand)]" />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-[var(--admin-brand)] font-medium group-hover:underline">{name}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <ExternalLink size={12} />
                Click to download
              </span>
            </div>
          </a>
        )}
      </dd>
    </div>
  );
}

export default function ApplicationViewModal({
  open,
  onOpenChange,
  application,
}: ApplicationViewModalProps) {
  const [documentLabels, setDocumentLabels] = React.useState<string[]>([]);
  const [paymentLabels, setPaymentLabels] = React.useState<string[]>([]);

  // Fetch document labels from admission page config
  React.useEffect(() => {
    if (!open) return;
    
    async function fetchLabels() {
      try {
        const response = await fetch('/api/admin/pages/admission');
        if (response.ok) {
          const data = await response.json();
          const docLabels = data.data?.content?.applicationForm?.documentStep?.documentLabels || [];
          
          // Extract all document labels — both 'document' and 'image' types
          // (admins can mark a slot as either a document or an image upload)
          const docs = docLabels.map((item: { label: string; type: "document" | "image" }) => item.label);
          setDocumentLabels(docs);
          setPaymentLabels(['Payment Slip 1', 'Payment Slip 2', 'Payment Slip 3']);
        }
      } catch (error) {
        console.error('Failed to fetch document labels:', error);
      }
    }
    
    fetchLabels();
  }, [open]);
  
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
    "Step 5: Payment Slip": <CreditCard size={14} />,
    "Other Information": <Settings2 size={14} />,
  };

  // Section display order (matches form steps)
  const sectionOrder = [
    "Step 1: Personal Information",
    "Step 2: Contact Information",
    "Step 3: Academic Information",
    "Step 4: Documents",
    "Step 5: Payment Slip",
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
          {/* Submitted On — simple highlighted line at the top */}
          <div className="mb-5 rounded-lg border border-[var(--admin-brand)]/30 bg-[var(--admin-brand)]/5 px-4 py-3 flex items-center gap-2.5">
            <CalendarDays size={16} className="text-[var(--admin-brand)] shrink-0" />
            <span className="text-sm font-bold text-[var(--admin-ink)]">
              Submitted On:
            </span>
            <span className="text-sm font-semibold text-[var(--admin-brand)]">
              {formatDate(application.submittedAt)}
            </span>
          </div>

          {/* Stepwise sections in order: Personal → Contact → Academic → Documents → Payment Slip */}
          {sectionOrder.map((section, index) => {
            const fields = sections[section];
            const stepNumber = index + 1;

            // Documents & Payment Slip are file lists, not form fields
            if (section === "Step 4: Documents") {
              if (!data.documents || data.documents.length === 0) return null;
              return (
                <SectionGroup
                  key={section}
                  title={section}
                  icon={sectionIcons[section] || <FileText size={14} />}
                  stepNumber={stepNumber}
                >
                  {data.documents.map((entry, i) => (
                    <FileRow
                      key={i}
                      label={documentLabels[i] || `Document ${i + 1}`}
                      entry={entry}
                    />
                  ))}
                </SectionGroup>
              );
            }

            if (section === "Step 5: Payment Slip") {
              if (!data.paymentSlips || data.paymentSlips.length === 0) return null;
              return (
                <SectionGroup
                  key={section}
                  title={section}
                  icon={sectionIcons[section] || <CreditCard size={14} />}
                  stepNumber={stepNumber}
                >
                  {data.paymentSlips.map((entry, i) => (
                    <FileRow
                      key={i}
                      label={paymentLabels[i] || `Payment Slip ${i + 1}`}
                      entry={entry}
                    />
                  ))}
                </SectionGroup>
              );
            }

            if (!fields || fields.length === 0) return null;

            return (
              <SectionGroup
                key={section}
                title={section}
                icon={sectionIcons[section] || <User size={14} />}
                stepNumber={stepNumber}
              >
                {fields.map(({ key, label, value }) => (
                  <FieldRow key={key} label={label} value={value} />
                ))}
              </SectionGroup>
            );
          })}

          {Object.keys(sections).length === 0 && !data.documents?.length && !data.paymentSlips?.length && (
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
