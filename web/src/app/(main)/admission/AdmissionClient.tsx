"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import type { AdmissionPageContent } from "@/types/page-content";
import type { FileEntry } from "@/types/application";
import { DynamicFormFields } from "./DynamicFormFields";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import DocumentUpload from "@/components/cloudinary/DocumentUpload";
import {
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  MapPin,
  Home,
  Upload,
  FileText,
  Send,
  Search,
  Eye,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface AdmissionClientProps {
  content: AdmissionPageContent;
}

type DynamicField = {
  id: string;
  label: string;
  fieldType: string;
};

function collectDynamicFields(content: AdmissionPageContent): DynamicField[] {
  const cfg = content.applicationForm || ({} as AdmissionPageContent["applicationForm"]);
  return [
    ...(cfg.personalInfoFields || []),
    ...(cfg.contactInfoFields || []),
    ...(cfg.academicInfoFields || []),
  ] as DynamicField[];
}

function extractFromFields(fields: DynamicField[], form: Record<string, any>, target: string): string {
  const patterns: Record<string, string[]> = {
    name: ["full_name", "fullname", "name", "student_name", "student"],
    email: ["email", "email_address"],
    phone: ["phone", "mobile", "contact", "phone_number"],
    program: ["programme", "program"],
    shift: ["shift"],
    gender: ["gender"],
    dob: ["dob", "date_of_birth", "birth_date"],
    nationality: ["nationality", "national"],
    date_option: ["date_option"],
  };
  const targets = patterns[target] || [];
  let matchedId: string | null = null;
  let score = 0;
  for (const f of fields) {
    const id = (f.id || "").toLowerCase();
    const label = (f.label || "").toLowerCase();
    for (const t of targets) {
      let s = 0;
      if (id === t) s = 3;
      else if (id.includes(t)) s = 2;
      else if (label.includes(t)) s = 1;
      if (s > score) {
        score = s;
        matchedId = f.id;
      }
    }
  }
  if (!matchedId) {
    // Fallback: also check the form object directly for common field names
    for (const t of targets) {
      if (form[t]) {
        const v = form[t];
        return typeof v === "string" ? v.trim() : String(v);
      }
    }
    return "";
  }
  const v = form[matchedId];
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v);
}

type FormData = Record<string, any>;

function buildInitialForm(content: AdmissionPageContent): FormData {
  const form: FormData = { agree_terms: true, date_option: "bs", nationality: "Nepali" };
  const cfg = content.applicationForm;
  if (!cfg) return form;
  const allFields = [
    ...(cfg.personalInfoFields || []),
    ...(cfg.contactInfoFields || []),
    ...(cfg.academicInfoFields || []),
  ];
  for (const f of allFields) {
    if (form[f.id] === undefined) {
      form[f.id] = f.fieldType === "checkbox" ? false : "";
    }
  }
  return form;
}

const INITIAL_FORM: FormData = {};

// Resolve the "temporary address same as permanent" checkbox and the
// permanent ↔ temporary address field pairs. Field ids/labels vary between
// the code defaults (e.g. "permanent_province") and stored CMS content
// (e.g. "province_permanent"), so we match by both.
function getSameAddressConfig(content: AdmissionPageContent) {
  const contactFields = content.applicationForm?.contactInfoFields || [];

  const sameAddressId = contactFields.find(
    (f: any) =>
      f.fieldType === "checkbox" &&
      ((f.id || "").toLowerCase().includes("same") ||
        (f.label || "").toLowerCase().includes("same as permanent"))
  )?.id;

  const locationRoles = ["province", "district", "city", "ward"];
  const hasRole = (f: any, role: string) =>
    (f.label || "").toLowerCase().includes(role) ||
    (f.id || "").toLowerCase().includes(role);

  const pairs = locationRoles
    .map((role) => {
      const permField = contactFields.find(
        (f: any) =>
          hasRole(f, role) &&
          ((f.label || "").toLowerCase().includes("permanent") ||
            (f.id || "").toLowerCase().includes("permanent"))
      );
      const tempField = contactFields.find(
        (f: any) =>
          hasRole(f, role) &&
          ((f.label || "").toLowerCase().includes("temporary") ||
            (f.id || "").toLowerCase().includes("temporary"))
      );
      return { permField, tempField };
    })
    .filter((p) => p.permField && p.tempField) as Array<{
    permField: { id: string };
    tempField: { id: string };
  }>;

  return { sameAddressId, pairs };
}

export default function AdmissionClient({ content }: AdmissionClientProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(() => buildInitialForm(content));
  const [docFiles, setDocFiles] = useState<(FileEntry | null)[]>([]);
  const [payFiles, setPayFiles] = useState<FileEntry[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [validating, setValidating] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const update = useCallback((field: string, value: any) => {
    setStepErrors([]);
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      const { sameAddressId, pairs } = getSameAddressConfig(content);
      const checked = sameAddressId ? !!prev[sameAddressId] : false;

      if (field && sameAddressId && field === sameAddressId) {
        // Toggling the checkbox: copy permanent → temporary (check) or clear (uncheck)
        for (const { permField, tempField } of pairs) {
          next[tempField.id] = value ? prev[permField.id] || "" : "";
        }
      } else if (checked && pairs.length > 0) {
        // While "same as permanent" is on:
        // - changing a permanent field syncs its temporary counterpart
        // - edits to a temporary field are reverted (it is locked)
        const paired = pairs.find(
          (p) => p.permField.id === field || p.tempField.id === field
        );
        if (paired) {
          if (field === paired.permField.id) {
            next[paired.tempField.id] = value;
          } else {
            next[field] = prev[paired.permField.id] || "";
          }
        }
      }
      return next;
    });
  }, [content]);

  const handleProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert("Photo too large. Max 2MB."); return; }
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const documentLabels = content.applicationForm?.documentStep?.documentLabels ?? [];

  const sameAddressChecked = (() => {
    const { sameAddressId } = getSameAddressConfig(content);
    return sameAddressId ? !!form[sameAddressId] : false;
  })();

  const disabledFieldIds = useMemo(() => {
    const set = new Set<string>();
    if (sameAddressChecked) {
      const { pairs } = getSameAddressConfig(content);
      for (const { tempField } of pairs) set.add(tempField.id);
    }
    return set;
  }, [sameAddressChecked, content]);

  const handleDocUpload = (index: number) => (r: { secure_url: string; original_filename: string }) => {
    setDocFiles((prev) => {
      const next = [...prev];
      next[index] = { url: r.secure_url, name: r.original_filename };
      return next;
    });
  };

  const handlePayUpload = (r: { secure_url: string; original_filename: string }) => {
    setPayFiles((prev) => [...prev, { url: r.secure_url, name: r.original_filename }]);
  };

  const removeDoc = (idx: number) => setDocFiles((prev) => {
    const next = [...prev];
    next[idx] = null;
    return next;
  });
  const removePay = (idx: number) => setPayFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleNext = async () => {
    setStepErrors([]);

    // Local validation for document step — all slots must be filled
    if (step === 3) {
      const expected = documentLabels.length;
      const filled = docFiles.filter((d) => d !== null).length;
      if (expected > 0 && filled < expected) {
        setStepErrors([`Please upload all ${expected} required documents (${filled}/${expected} uploaded)`]);
        return;
      }
      if (expected === 0 && filled === 0) {
        setStepErrors(["Please upload at least one document"]);
        return;
      }
      setStep(step + 1);
      return;
    }

    setValidating(true);
    try {
      const res = await fetch("/api/applications/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, form, documents: docFiles.filter((d): d is FileEntry => d !== null), paymentSlips: payFiles }),
      });
      const data = await res.json();
      if (data.valid) {
        setStep(step + 1);
      } else {
        setStepErrors(data.errors || ["Please fill in all required fields"]);
      }
    } catch {
      setStepErrors(["Validation failed. Please try again."]);
    } finally {
      setValidating(false);
    }
  };

  const progressPct = Math.round((step / 6) * 100);

  const handleSubmit = async () => {
    if (!form.agree_terms || submitting) return;
    setSubmitting(true);

    try {
      const dynamicFields = collectDynamicFields(content);
      const record = form as unknown as Record<string, any>;
      const payload = {
        name: extractFromFields(dynamicFields, record, "name") || "Unknown",
        email: extractFromFields(dynamicFields, record, "email"),
        phone: extractFromFields(dynamicFields, record, "phone"),
        program: extractFromFields(dynamicFields, record, "program"),
        shift: extractFromFields(dynamicFields, record, "shift"),
        gender: extractFromFields(dynamicFields, record, "gender"),
        dob: extractFromFields(dynamicFields, record, "dob"),
        dateOption: extractFromFields(dynamicFields, record, "date_option"),
        nationality: extractFromFields(dynamicFields, record, "nationality"),
        documents: docFiles.filter((d): d is FileEntry => d !== null),
        paymentSlips: payFiles,
        agreedToTerms: form.agree_terms,
        form,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to submit application");
      }

      setSubmitted(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [submitted]);

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#51B747] flex items-center justify-center mx-auto mb-5">
            <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-[#16285B] mb-2">{content.successMessage.heading}</h2>
          <p className="text-gray-600 mb-2">{content.successMessage.message}</p>
          <p className="text-gray-500 text-sm mb-6">{content.successMessage.reference}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#16285B] text-white font-semibold hover:bg-[#1e3a7a] transition-colors">Back to Home</Link>
            <button onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); setDocFiles([]); setPayFiles([]); setProfilePhoto(null); setStep(0); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">Submit Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#16285B]" style={{ color: "#ffffff" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="relative z-10 w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(3rem,6vw,4.5rem)] grid gap-4">
          <nav className="flex flex-wrap items-center gap-1.5 text-[0.74rem] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
            <Link href="/" className="text-[#51B747] hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span>{content.hero.breadcrumbText}</span>
          </nav>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold" style={{ color: "#ffffff" }}>{content.hero.title}</h1>
          <p className="max-w-[56ch]" style={{ color: "rgba(255,255,255,0.7)" }}>{content.hero.subtitle}</p>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-[clamp(3.5rem,8vw,6.5rem)]">
        <div className="w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          <div className="text-center mb-12">
            <span className="text-[0.74rem] tracking-[0.2em] uppercase font-semibold text-[#21409a]">{content.admissionProcess.eyebrow}</span>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mt-2 font-semibold text-gray-900">{content.admissionProcess.heading}</h2>
          </div>
          <div className="max-w-[820px] mx-auto grid gap-6">
            {content.admissionProcess.steps.map((s) => (
              <div key={s.number} className="flex gap-5 items-start p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-11 h-11 rounded-full bg-[#16285B] text-white flex items-center justify-center font-bold text-sm shrink-0">{s.number}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Ways to Apply */}
      <section className="py-[clamp(3.5rem,8vw,6.5rem)] bg-[#f5f8ff]">
        <div className="w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          <div className="grid lg:grid-cols-[auto_1fr_auto] gap-10 items-start">
            <img src={content.applyOptions.bannerImage} alt="Admissions open for the 2083 intake at PCM" loading="lazy" className="w-full max-w-[280px] h-auto object-contain hidden lg:block" />
            <div>
              <div className="mb-8">
                <span className="text-[0.74rem] tracking-[0.2em] uppercase font-semibold text-[#21409a]">{content.applyOptions.eyebrow}</span>
                <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mt-2 font-semibold text-gray-900">{content.applyOptions.heading}</h2>
                <p className="text-gray-600 mt-3 max-w-2xl">{content.applyOptions.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#f0f4ff] flex items-center justify-center mb-4"><Search className="w-6 h-6 text-[#16285B]" /></div>
                  <h3 className="font-bold text-gray-900 mb-2">{content.applyOptions.onlineOption.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{content.applyOptions.onlineOption.description}</p>
                  <a href="#apply-form" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16285B] text-white font-semibold text-sm hover:bg-[#1e3a7a] transition-colors">{content.applyOptions.onlineOption.buttonText} <ArrowRight className="w-4 h-4" /></a>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#f0f4ff] flex items-center justify-center mb-4"><Upload className="w-6 h-6 text-[#16285B]" /></div>
                  <h3 className="font-bold text-gray-900 mb-2">{content.applyOptions.offlineOption.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{content.applyOptions.offlineOption.description}</p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer">{content.applyOptions.offlineOption.buttonText} <Upload className="w-4 h-4" /></span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-[#21409a]" /> {content.requiredDocuments.heading}</h3>
              <ul className="space-y-2.5 mb-5">
                {content.requiredDocuments.documents.map((doc) => (
                  <li key={doc} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#21409a] mt-0.5 shrink-0" strokeWidth={2.5} />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-[#f0f4ff] rounded-xl p-4">
                <h4 className="font-bold text-gray-900 text-sm mb-1">{content.requiredDocuments.scheduleBox.heading}</h4>
                <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: `${content.requiredDocuments.scheduleBox.examInfo}<br />${content.requiredDocuments.scheduleBox.deadlineInfo}` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Admission Form */}
      <section className="py-[clamp(3.5rem,8vw,6.5rem)]" id="apply-form">
        <div className="w-full max-w-[960px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          <div className="text-center mb-10">
            <span className="text-[0.74rem] tracking-[0.2em] uppercase font-semibold text-[#21409a]">{content.applicationForm.eyebrow}</span>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mt-2 font-semibold text-gray-900">{content.applicationForm.heading}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-gray-100">
              <div className="h-full bg-[#16285B] rounded-r transition-all duration-400" style={{ width: `${progressPct}%` }} />
            </div>

            {/* Stepper Header */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
              {content.applicationForm.stepLabels.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${i < step ? "bg-[#51B747] text-white" : i === step ? "bg-[#16285B] text-white" : "bg-gray-100 text-gray-400 border-2 border-gray-200"}`}>
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-[#16285B] font-semibold" : i < step ? "text-[#51B747]" : "text-gray-400"}`}>{label}</span>
                  {i < content.applicationForm.stepLabels.length - 1 && <div className="hidden sm:block w-4 lg:w-8 h-0.5 bg-gray-200 rounded mx-1" />}
                </div>
              ))}
            </div>

            <form onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => { if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "BUTTON" && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault(); }}>
              <div className="p-6 sm:p-8">
                {/* STEP 1: Personal Info - Dynamic Fields */}
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {content.applicationForm.stepLabels[0] || "Personal Information"}
                      </h3>
                      <p className="text-sm text-gray-500">Tell us about yourself</p>
                    </div>

                    {/* Dynamic Fields from Admin */}
                    <DynamicFormFields
                      fields={content.applicationForm.personalInfoFields}
                      formData={form}
                      onUpdate={update}
                    />
                  </div>
                )}

                {/* STEP 2: Contact Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {content.applicationForm.stepLabels[1] || "Contact Details"}
                      </h3>
                      <p className="text-sm text-gray-500">Where can we reach you?</p>
                    </div>

                    {/* Dynamic Fields from Admin */}
                    <DynamicFormFields
                      fields={content.applicationForm.contactInfoFields}
                      formData={form}
                      onUpdate={update}
                      disabledFieldIds={disabledFieldIds}
                    />
                  </div>
                )}

                {/* STEP 3: Academic Info */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {content.applicationForm.stepLabels[2] || "Academic Information"}
                      </h3>
                      <p className="text-sm text-gray-500">Your educational background</p>
                    </div>

                    {/* Dynamic Fields from Admin */}
                    <DynamicFormFields
                      fields={content.applicationForm.academicInfoFields}
                      formData={form}
                      onUpdate={update}
                    />
                  </div>
                )}

                {/* STEP 4: Document Upload */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {content.applicationForm.documentStep?.heading || "Document Upload"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {content.applicationForm.documentStep?.description || "Upload your required documents"}
                      </p>
                    </div>

                    {documentLabels.map((docEntry: { label: string; type: "document" | "image" }, i: number) => (
                      <div key={i} className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <Check className="w-4 h-4 text-[#51B747] shrink-0" strokeWidth={2.5} />
                          {docEntry.label}
                        </label>
                        {docFiles[i] ? (
                          (() => {
                            const entry = docFiles[i]!;
                            const url = typeof entry === "string" ? entry : entry.url;
                            const name = typeof entry === "string" ? url.split("/").pop() || url : entry.name;
                            return (
                              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-3.5 py-2.5">
                                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#16285B] truncate block hover:underline">{name}</a>
                                </div>
                                <button type="button" onClick={() => removeDoc(i)} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="flex flex-col items-start gap-2">
                            {docEntry.type === "image" ? (
                              <>
                                <ImageUpload onUpload={handleDocUpload(i)} />
                                <p className="text-xs text-gray-400">JPEG, JPG, PNG, WEBP · Max 5 MB</p>
                              </>
                            ) : (
                              <>
                                <DocumentUpload onUpload={handleDocUpload(i)} />
                                <p className="text-xs text-gray-400">PDF, DOC, DOCX · Max 5 MB</p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* STEP 5: Declaration */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Declaration & Consent</h3>
                      <p className="text-sm text-gray-500">Review and confirm your application</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                      <h4 className="font-bold text-gray-900 mb-2">Declaration</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">I hereby declare that all the information provided in this application form is true and correct to the best of my knowledge. I understand that if any information is found to be false or misleading, my admission may be cancelled. I agree to abide by the rules and regulations of Pokhara College of Management.</p>
                    </div>

                    <label className="flex items-center gap-3 p-3.5 bg-green-50 border border-green-200 rounded-xl cursor-pointer hover:border-green-400 transition-all">
                      <input type="checkbox" checked={form.agree_terms} onChange={(e) => update("agree_terms", e.target.checked)} className="w-5 h-5 accent-[#51B747] cursor-pointer" />
                      <span className="text-sm font-semibold text-green-800">I have read and agree to the declaration above</span>
                    </label>
                  </div>
                )}

                {/* STEP 6: Payment */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Payment & Review</h3>
                      <p className="text-sm text-gray-500">Upload payment slip and review your application</p>
                    </div>

                    <div className="bg-[#16285B] rounded-xl p-5 text-white">
                      <h4 className="font-bold mb-3 flex items-center gap-2"><CreditCard className="w-5 h-5" /> {content.bankDetails.heading}</h4>
                      <div className="space-y-0">
                        {[
                          { l: "Bank", v: content.bankDetails.bankName },
                          { l: "Account Name", v: content.bankDetails.accountName },
                          { l: "Account No", v: content.bankDetails.accountNumber },
                          { l: "Branch", v: content.bankDetails.branch },
                          { l: "Admission Fee", v: content.bankDetails.admissionFee, accent: true },
                        ].map((row) => (
                          <div key={row.l} className="flex justify-between py-2 border-b border-white/10 last:border-b-0 text-sm">
                            <span className="text-white/65 font-medium">{row.l}</span>
                            <span className={`font-semibold ${row.accent ? "text-[#51B747] text-base" : "text-white"}`}>{row.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Payment Slip</label>
                      <div className="flex flex-col items-start gap-3">
                        <ImageUpload onUpload={handlePayUpload} />
                        <p className="text-xs text-gray-400">Accepted: JPEG, JPG, PNG, WEBP · Max 5 MB</p>
                      </div>
                      {payFiles.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {payFiles.map((entry, i) => {
                            const url = typeof entry === "string" ? entry : entry.url;
                            const name = typeof entry === "string" ? url.split("/").pop() || url : entry.name;
                            return (
                              <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-3.5 py-2.5">
                                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#16285B] truncate block hover:underline">{name}</a>
                                </div>
                                <button type="button" onClick={() => removePay(i)} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3 pb-2.5 border-b-2 border-[#16285B]">
                        <Eye className="w-5 h-5 text-[#16285B]" />
                        <h4 className="font-bold text-[#16285B] text-sm">Application Summary</h4>
                      </div>
                      <div className="space-y-0">
                        <div className="text-xs font-bold text-[#16285B] uppercase tracking-wide pt-2 pb-1 border-b border-gray-200">Personal Information</div>
                        {(() => {
                          const dynamicFields = collectDynamicFields(content);
                          const record = form as unknown as Record<string, any>;
                          const get = (target: string) => {
                            const v = extractFromFields(dynamicFields, record, target);
                            return v || "—";
                          };
                          const capitalize = (s: string) => s && s !== "—" ? s.charAt(0).toUpperCase() + s.slice(1) : "—";
                          return [
                            { l: "Programme", v: capitalize(get("program")) },
                            { l: "Shift", v: capitalize(get("shift")) },
                            { l: "Full Name", v: get("name") },
                            { l: "Gender", v: capitalize(get("gender")) },
                            { l: "Date of Birth", v: get("dob") },
                            { l: "Nationality", v: get("nationality") },
                            { l: "Phone", v: get("phone") },
                            { l: "Email", v: get("email") },
                          ];
                        })().map((row) => (
                          <div key={row.l} className="flex gap-3 py-1.5 border-b border-gray-100 last:border-b-0 text-sm">
                            <span className="font-semibold text-gray-400 min-w-[120px] flex-shrink-0 text-xs">{row.l}</span>
                            <span className="font-semibold text-gray-900">{row.v}</span>
                          </div>
                        ))}

                        <div className="text-xs font-bold text-[#16285B] uppercase tracking-wide pt-3 pb-1 border-b border-gray-200">Address</div>
                        {(() => {
                          const contactFields = content.applicationForm?.contactInfoFields || [];
                          const getAddress = (type: "permanent" | "temporary") => {
                            const roles = ["province", "district", "city", "ward"];
                            return roles.map(role => {
                              const f = contactFields.find((cf: any) => cf.label.toLowerCase().includes(role) && cf.label.toLowerCase().includes(type));
                              return f ? form[f.id] : "";
                            }).filter(Boolean).join(", ") || "—";
                          };
                          return [
                            { l: "Permanent", v: getAddress("permanent") },
                            { l: "Temporary", v: getAddress("temporary") },
                          ];
                        })().map((row) => (
                          <div key={row.l} className="flex gap-3 py-1.5 border-b border-gray-100 last:border-b-0 text-sm">
                            <span className="font-semibold text-gray-400 min-w-[120px] flex-shrink-0 text-xs">{row.l}</span>
                            <span className="font-semibold text-gray-900">{row.v}</span>
                          </div>
                        ))}

                        <div className="text-xs font-bold text-[#16285B] uppercase tracking-wide pt-3 pb-1 border-b border-gray-200">Academic Information</div>
                        {(() => {
                          const academicFields = content.applicationForm?.academicInfoFields || [];
                          const record = form as unknown as Record<string, any>;
                          const getVal = (keywords: string[]) => {
                            const f = academicFields.find((cf: any) => keywords.some(k => cf.label.toLowerCase().includes(k) || cf.id.toLowerCase().includes(k)));
                            return f ? (record[f.id] || "—") : "—";
                          };
                          return [
                            { l: "SEE GPA / Year", v: [getVal(["gpa"]), getVal(["see", "year"])].filter(v => v && v !== "—").join(" \u00b7 ") || "—" },
                            { l: "+2 GPA / Year", v: [getVal(["intermediate gpa"]), getVal(["intermediate year"])].filter(v => v && v !== "—").join(" \u00b7 ") || "—" },
                          ];
                        })().map((row) => (
                          <div key={row.l} className="flex gap-3 py-1.5 border-b border-gray-100 last:border-b-0 text-sm">
                            <span className="font-semibold text-gray-400 min-w-[120px] flex-shrink-0 text-xs">{row.l}</span>
                            <span className="font-semibold text-gray-900">{row.v}</span>
                          </div>
                        ))}

                        <div className="text-xs font-bold text-[#16285B] uppercase tracking-wide pt-3 pb-1 border-b border-gray-200">Uploads</div>
                        {[
                          { l: "Documents", v: `${docFiles.length} file${docFiles.length !== 1 ? "s" : ""}` },
                          { l: "Payment Slip", v: `${payFiles.length} file${payFiles.length !== 1 ? "s" : ""}` },
                        ].map((row) => (
                          <div key={row.l} className="flex gap-3 py-1.5 border-b border-gray-100 last:border-b-0 text-sm">
                            <span className="font-semibold text-gray-400 min-w-[120px] flex-shrink-0 text-xs">{row.l}</span>
                            <span className="font-semibold text-gray-900">{row.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation Errors */}
                {stepErrors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <span className="text-sm font-semibold text-red-700">Please fix the following:</span>
                    </div>
                    <ul className="space-y-1 ml-7">
                      {stepErrors.map((err, i) => (
                        <li key={i} className="text-sm text-red-600 list-disc">{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-100">
                  {step > 0 ? (
                    <button type="button" onClick={() => { setStepErrors([]); setStep(step - 1); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </button>
                  ) : <div />}
                  {step < 5 ? (
                    <button type="button" disabled={validating} onClick={handleNext} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#16285B] text-white font-semibold text-sm hover:bg-[#1e3a7a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                      {validating ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Validating...</> : <>Next <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  ) : (
                    <button type="button" disabled={submitting || !form.agree_terms} onClick={handleSubmit} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#51B747] text-white font-semibold text-sm hover:bg-[#3F9E35] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                      {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> : <>Submit Application <Send className="w-4 h-4" /></>}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="bg-[#f0f4ff] rounded-xl p-5 mt-6">
            <h4 className="font-bold text-gray-900 text-sm mb-1">{content.needHelp.heading}</h4>
            <p className="text-sm text-gray-600">
              {content.needHelp.description}{' '}
              <a href={`mailto:${content.needHelp.email}`} className="text-[#16285B] font-semibold">{content.needHelp.email}</a>
              {' '}or call {content.needHelp.phone}.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-[clamp(2.5rem,5vw,4rem)]">
        <div className="w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          <div className="relative overflow-hidden rounded-[22px] shadow-[0_4px_6px_-1px_rgba(22,40,91,0.1),0_2px_4px_-2px_rgba(22,40,91,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#16285b] to-[#14265a]" />
            <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_85%_10%,rgba(81,183,71,0.28),transparent_60%),radial-gradient(500px_300px_at_10%_90%,rgba(65,103,201,0.35),transparent_60%)]" />
            <div className="relative z-10 grid grid-cols-[1.3fr_auto] gap-[clamp(1.25rem,3vw,2.5rem)] items-center p-[clamp(2rem,5vw,3.5rem)_clamp(1.5rem,4vw,3rem)] max-md:grid-cols-1 max-md:text-center" style={{ color: "#ffffff" }}>
              <div>
                <span className="inline-flex items-center gap-2 text-[0.74rem] tracking-[0.2em] uppercase text-[#51B747]">{content.cta.eyebrow}</span>
                <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mt-2 mb-2 font-semibold">{content.cta.heading}</h2>
                <p className="max-w-[56ch] max-md:mx-auto" style={{ color: "rgba(255,255,255,0.72)" }}>{content.cta.description}</p>
              </div>
              <div className="flex flex-wrap gap-3.5 max-md:justify-center">
                <a href={content.cta.primaryButtonLink} className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-[14px] font-bold text-[0.98rem] bg-[#51B747] text-[#16285b] hover:bg-[#3f9e35] hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(81,183,71,0.28)] transition-all">{content.cta.primaryButtonText} <ArrowRight className="w-4 h-4" /></a>
                <Link href={content.cta.secondaryButtonLink} className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-[14px] font-bold text-[0.98rem] bg-transparent text-white border border-white/35 hover:border-white hover:text-white transition-all">{content.cta.secondaryButtonText}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
