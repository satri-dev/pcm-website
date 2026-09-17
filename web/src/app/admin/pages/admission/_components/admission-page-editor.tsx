"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { AdmissionPageContent } from "@/types/page-content";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import ApplicationFormSection from "./application-form-section";
import { SectionSaveButton } from "@/app/admin/pages/_components/section-save-button";
import RichTextEditor from "@/app/admin/_components/editor/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// Sonner-based confirmation popup that resolves true only if the user confirms.
function confirmAction({
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    toast.custom(
      (id) => (
        <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <div>
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => {
                toast.dismiss(id);
                resolve(false);
              }}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              onClick={() => {
                toast.dismiss(id);
                resolve(true);
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  });
}

interface AdmissionPageEditorProps {
  initialContent: AdmissionPageContent;
}

const SECTIONS = [
  { id: "hero", title: "Hero Section", desc: "Hero title, subtitle and breadcrumb" },
  { id: "process", title: "Admission Process", desc: "Process steps with titles and descriptions" },
  { id: "apply", title: "Apply Options", desc: "Online/offline options and banner image" },
  { id: "documents", title: "Required Documents", desc: "Document list and entrance schedule" },
  { id: "form", title: "Application Form", desc: "Form configuration and options" },
  { id: "bank", title: "Bank Details", desc: "Bank account information for payment" },
  { id: "success", title: "Success Message", desc: "Post-submission success message" },
  { id: "needhelp", title: "Need Help", desc: "Help section with contact information" },
  { id: "cta", title: "Call to Action", desc: "CTA banner with buttons" },
  { id: "seo", title: "SEO & Metadata", desc: "Title, description, keywords and OG image" },
];
const ALL_SECTION_IDS = SECTIONS.map((s) => s.id);

// Maps a UI section id to the key it lives under in AdmissionPageContent
const UI_TO_KEY: Record<string, keyof AdmissionPageContent> = {
  hero: "hero",
  process: "admissionProcess",
  apply: "applyOptions",
  documents: "requiredDocuments",
  form: "applicationForm",
  bank: "bankDetails",
  success: "successMessage",
  needhelp: "needHelp",
  cta: "cta",
  seo: "seo",
};

const slugify = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");

function normalizeApplicationForm(
  applicationForm: AdmissionPageContent["applicationForm"],
): AdmissionPageContent["applicationForm"] {
  return {
    ...applicationForm,
    personalInfoFields: applicationForm.personalInfoFields.map((f, i) => ({
      ...f,
      id: slugify(f.label) || f.id,
      order: i + 1,
    })),
    contactInfoFields: applicationForm.contactInfoFields.map((f, i) => ({
      ...f,
      id: slugify(f.label) || f.id,
      order: i + 1,
    })),
    academicInfoFields: applicationForm.academicInfoFields.map((f, i) => ({
      ...f,
      id: slugify(f.label) || f.id,
      order: i + 1,
    })),
  };
}

export default function AdmissionPageEditor({ initialContent }: AdmissionPageEditorProps) {
  const [content, setContent] = useState<AdmissionPageContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>(
    {},
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allExpanded = expandedSections.size === SECTIONS.length;

  const toggleAll = () => {
    setExpandedSections(allExpanded ? new Set() : new Set(ALL_SECTION_IDS));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const contentToSave = {
        ...content,
        applicationForm: normalizeApplicationForm(content.applicationForm),
      };

      const response = await fetch("/api/admin/pages/admission", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentToSave }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }

      setContent(contentToSave);
      toast.success("Admission page updated successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const saveSection = async (sectionId: string) => {
    const dataKey = UI_TO_KEY[sectionId];
    const dataValue =
      dataKey === "applicationForm"
        ? normalizeApplicationForm(content.applicationForm)
        : content[dataKey];

    setSavingSection(sectionId);
    setSectionErrors((prev) => ({ ...prev, [sectionId]: "" }));

    try {
      const response = await fetch("/api/admin/pages/admission", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: dataKey, content: dataValue }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }

      setContent({ ...content, [dataKey]: dataValue });
      const sectionTitle = SECTIONS.find((s) => s.id === sectionId)?.title;
      toast.success(`${sectionTitle ?? "Section"} saved successfully!`);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to save changes";
      setSectionErrors((prev) => ({ ...prev, [sectionId]: errorMsg }));
      console.error("Section save error:", error);
      toast.error(errorMsg);
    } finally {
      setSavingSection(null);
    }
  };

  // Process steps helpers
  const [stepModal, setStepModal] = useState<
    { mode: "add" } | { mode: "edit"; index: number } | null
  >(null);
  const [stepDraft, setStepDraft] = useState<{
    number: string;
    title: string;
    description: string;
  }>({ number: "", title: "", description: "" });

  const openAddStep = () => {
    setStepDraft({
      number: String(content.admissionProcess.steps.length + 1),
      title: "",
      description: "",
    });
    setStepModal({ mode: "add" });
  };

  const openEditStep = (index: number) => {
    setStepDraft({ ...content.admissionProcess.steps[index] });
    setStepModal({ mode: "edit", index });
  };

  const closeStepModal = () => setStepModal(null);

  const saveStep = () => {
    if (!stepModal) return;
    setContent((prev) => {
      const steps = [...prev.admissionProcess.steps];
      if (stepModal.mode === "edit") {
        steps[stepModal.index] = { ...stepDraft };
      } else {
        steps.push({ ...stepDraft });
      }
      return {
        ...prev,
        admissionProcess: { ...prev.admissionProcess, steps },
      };
    });
    closeStepModal();
  };

  const removeProcessStep = async (index: number) => {
    const ok = await confirmAction({
      title: `Remove step "${content.admissionProcess.steps[index].title || `#${index + 1}`}"?`,
      description: "This will remove it from the admission process.",
    });
    if (!ok) return;
    setContent((prev) => ({
      ...prev,
      admissionProcess: {
        ...prev.admissionProcess,
        steps: prev.admissionProcess.steps.filter((_, i) => i !== index),
      },
    }));
    toast.success("Step removed", { position: "bottom-right" });
  };

  // Apply option helpers
  const [optionModal, setOptionModal] = useState<"online" | "offline" | null>(null);
  const [optionDraft, setOptionDraft] = useState<{
    title: string;
    description: string;
    buttonText: string;
  }>({ title: "", description: "", buttonText: "" });

  const openEditOption = (key: "online" | "offline") => {
    setOptionDraft({ ...content.applyOptions[`${key}Option`] });
    setOptionModal(key);
  };

  const closeOptionModal = () => setOptionModal(null);

  const saveOption = () => {
    if (!optionModal) return;
    setContent((prev) => ({
      ...prev,
      applyOptions: {
        ...prev.applyOptions,
        [`${optionModal}Option`]: { ...optionDraft },
      },
    }));
    closeOptionModal();
  };

  // Documents helpers
  const addDocument = () => {
    setContent({
      ...content,
      requiredDocuments: {
        ...content.requiredDocuments,
        documents: [...content.requiredDocuments.documents, "New Document"],
      },
    });
  };

  const updateDocument = (index: number, value: string) => {
    const newDocs = [...content.requiredDocuments.documents];
    newDocs[index] = value;
    setContent({
      ...content,
      requiredDocuments: { ...content.requiredDocuments, documents: newDocs },
    });
  };

  const removeDocument = (index: number) => {
    setContent({
      ...content,
      requiredDocuments: {
        ...content.requiredDocuments,
        documents: content.requiredDocuments.documents.filter((_, i) => i !== index),
      },
    });
  };

  // SEO keywords helpers
  const addKeyword = () => {
    setContent({
      ...content,
      seo: {
        ...content.seo,
        keywords: [...content.seo.keywords, ""],
      },
    });
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...content.seo.keywords];
    newKeywords[index] = value;
    setContent({
      ...content,
      seo: { ...content.seo, keywords: newKeywords },
    });
  };

  const removeKeyword = (index: number) => {
    setContent({
      ...content,
      seo: {
        ...content.seo,
        keywords: content.seo.keywords.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="pp-toolbar">
        <span className="pp-toolbar__stat">
          <CheckCircle2 size={15} />
          {expandedSections.size} of {SECTIONS.length} sections expanded
        </span>
        <button
          type="button"
          className="admin-btn admin-btn--sm ml-auto"
          onClick={toggleAll}
        >
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* Hero Section */}
      <section className={`pp-section ${expandedSections.has("hero") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("hero")} onClick={() => toggleSection("hero")}>
          <span className="pp-section__num">1</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Hero Section</span>
            <span className="pp-section__desc">Hero title, subtitle and breadcrumb</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("hero") && (
          <div className="pp-section__body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subtitle</label>
                <textarea
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Breadcrumb Text</label>
                <input
                  type="text"
                  value={content.hero.breadcrumbText}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, breadcrumbText: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <SectionSaveButton
              id="hero"
              saving={savingSection === "hero"}
              error={sectionErrors.hero}
              onSave={saveSection}
            />
          </div>
        )}
      </section>

      {/* Admission Process Section */}
      <section className={`pp-section ${expandedSections.has("process") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("process")} onClick={() => toggleSection("process")}>
          <span className="pp-section__num">2</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Admission Process</span>
            <span className="pp-section__desc">Process steps with titles and descriptions</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("process") && (
          <div className="pp-section__body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Eyebrow</label>
                <input
                  type="text"
                  value={content.admissionProcess.eyebrow}
                  onChange={(e) => setContent({ ...content, admissionProcess: { ...content.admissionProcess, eyebrow: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heading</label>
                <input
                  type="text"
                  value={content.admissionProcess.heading}
                  onChange={(e) => setContent({ ...content, admissionProcess: { ...content.admissionProcess, heading: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Process Steps</label>
                  <button
                    type="button"
                    onClick={openAddStep}
                    className="admin-btn admin-btn--sm"
                  >
                    <Plus size={16} /> Add Step
                  </button>
                </div>
                {content.admissionProcess.steps.length === 0 ? (
                  <p className="text-sm text-[var(--admin-muted)]">
                    No steps yet. Click &quot;Add Step&quot; to create one.
                  </p>
                ) : (
                  <div className="pp-table-wrap rounded-lg border border-gray-200">
                    <Table className="table-fixed">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 bg-gray-50">#</TableHead>
                          <TableHead className="w-20 truncate bg-gray-50">NUMBER</TableHead>
                          <TableHead className="truncate bg-gray-50">TITLE</TableHead>
                          <TableHead className="bg-gray-50">DESCRIPTION</TableHead>
                          <TableHead className="w-28 text-right bg-gray-50">ACTIONS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {content.admissionProcess.steps.map((step, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="w-12 py-2.5">{idx + 1}</TableCell>
                            <TableCell className="w-20 py-2.5 text-sm text-gray-500">
                              {step.number}
                            </TableCell>
                            <TableCell className="truncate py-2.5 text-sm font-semibold">
                              {step.title}
                            </TableCell>
                            <TableCell className="cell-ellipsis py-2.5 text-sm text-gray-500">
                              {step.description ? stripHtml(step.description) : "—"}
                            </TableCell>
                            <TableCell className="py-2.5">
                              <div className="row-actions justify-end">
                                <button
                                  type="button"
                                  className="act-btn"
                                  onClick={() => openEditStep(idx)}
                                  title="Edit step"
                                >
                                  <Pencil size={15} />
                                </button>
                                <button
                                  type="button"
                                  className="act-btn danger"
                                  onClick={() => removeProcessStep(idx)}
                                  title="Remove step"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
            <SectionSaveButton
              id="process"
              saving={savingSection === "process"}
              error={sectionErrors.process}
              onSave={saveSection}
            />
          </div>
        )}
      </section>

      {/* Apply Options Section */}
      <section className={`pp-section ${expandedSections.has("apply") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("apply")} onClick={() => toggleSection("apply")}>
          <span className="pp-section__num">3</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Apply Options</span>
            <span className="pp-section__desc">Online/offline options and banner image</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("apply") && (
          <div className="pp-section__body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Eyebrow</label>
                <input
                  type="text"
                  value={content.applyOptions.eyebrow}
                  onChange={(e) => setContent({ ...content, applyOptions: { ...content.applyOptions, eyebrow: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heading</label>
                <input
                  type="text"
                  value={content.applyOptions.heading}
                  onChange={(e) => setContent({ ...content, applyOptions: { ...content.applyOptions, heading: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <RichTextEditor
                  content={content.applyOptions.description}
                  onChange={(html) => setContent({ ...content, applyOptions: { ...content.applyOptions, description: html } })}
                  placeholder="Start filling up the online application..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Banner Image</label>
                <ImageUpload
                  onUpload={(result) => setContent({ ...content, applyOptions: { ...content.applyOptions, bannerImage: result.secure_url } })}
                />
                {content.applyOptions.bannerImage && (
                  <div className="mt-3 flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                    <img
                      src={content.applyOptions.bannerImage}
                      alt="Banner preview"
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Current banner image
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {content.applyOptions.bannerImage}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setContent({ ...content, applyOptions: { ...content.applyOptions, bannerImage: "" } })}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Apply Options</h4>
                <div className="pp-table-wrap rounded-lg border border-gray-200">
                  <Table className="table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 bg-gray-50">#</TableHead>
                        <TableHead className="w-1/3 truncate bg-gray-50">TITLE</TableHead>
                        <TableHead className="truncate bg-gray-50">BUTTON TEXT</TableHead>
                        <TableHead className="w-28 text-right bg-gray-50">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(
                        [
                          { key: "online", label: content.applyOptions.onlineOption.title || "Online", buttonText: content.applyOptions.onlineOption.buttonText },
                          { key: "offline", label: content.applyOptions.offlineOption.title || "Offline", buttonText: content.applyOptions.offlineOption.buttonText },
                        ] as const
                      ).map((opt, idx) => (
                        <TableRow key={opt.key}>
                          <TableCell className="w-12 py-2.5">{idx + 1}</TableCell>
                          <TableCell className="truncate py-2.5 text-sm font-semibold">
                            {opt.label}
                          </TableCell>
                          <TableCell className="truncate py-2.5 text-sm text-gray-500">
                            {opt.buttonText || "—"}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <div className="row-actions justify-end">
                              <button
                                type="button"
                                className="act-btn"
                                onClick={() => openEditOption(opt.key)}
                                title={`Edit ${opt.key} option`}
                              >
                                <Pencil size={15} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            <SectionSaveButton
              id="apply"
              saving={savingSection === "apply"}
              error={sectionErrors.apply}
              onSave={saveSection}
            />
          </div>
        )}
      </section>

      {/* Required Documents Section */}
      <section className={`pp-section ${expandedSections.has("documents") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("documents")} onClick={() => toggleSection("documents")}>
          <span className="pp-section__num">4</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Required Documents</span>
            <span className="pp-section__desc">Document list and entrance schedule</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("documents") && (
          <div className="pp-section__body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heading</label>
                <input
                  type="text"
                  value={content.requiredDocuments.heading}
                  onChange={(e) => setContent({ ...content, requiredDocuments: { ...content.requiredDocuments, heading: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Documents</label>
                  <button
                    type="button"
                    onClick={addDocument}
                    className="admin-btn admin-btn--sm"
                  >
                    <Plus size={16} /> Add Document
                  </button>
                </div>
                <div className="space-y-2">
                  {content.requiredDocuments.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={doc}
                        onChange={(e) => updateDocument(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeDocument(idx)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Schedule Box</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Heading</label>
                    <input
                      type="text"
                      value={content.requiredDocuments.scheduleBox.heading}
                      onChange={(e) => setContent({ ...content, requiredDocuments: { ...content.requiredDocuments, scheduleBox: { ...content.requiredDocuments.scheduleBox, heading: e.target.value } } })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Exam Info</label>
                    <input
                      type="text"
                      value={content.requiredDocuments.scheduleBox.examInfo}
                      onChange={(e) => setContent({ ...content, requiredDocuments: { ...content.requiredDocuments, scheduleBox: { ...content.requiredDocuments.scheduleBox, examInfo: e.target.value } } })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Deadline Info</label>
                    <input
                      type="text"
                      value={content.requiredDocuments.scheduleBox.deadlineInfo}
                      onChange={(e) => setContent({ ...content, requiredDocuments: { ...content.requiredDocuments, scheduleBox: { ...content.requiredDocuments.scheduleBox, deadlineInfo: e.target.value } } })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <SectionSaveButton
              id="documents"
              saving={savingSection === "documents"}
              error={sectionErrors.documents}
              onSave={saveSection}
            />
          </div>
        )}
      </section>

      {/* Application Form Section */}
      <section className={`pp-section ${expandedSections.has("form") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("form")} onClick={() => toggleSection("form")}>
          <span className="pp-section__num">5</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Application Form</span>
            <span className="pp-section__desc">Form configuration and options</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("form") && (
          <div className="pp-section__body">
            <ApplicationFormSection content={content} setContent={setContent} />
            <SectionSaveButton
              id="form"
              saving={savingSection === "form"}
              error={sectionErrors.form}
              onSave={saveSection}
            />
          </div>
        )}
      </section>

      {/* Bank Details Section */}
      <section className={`pp-section ${expandedSections.has("bank") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("bank")} onClick={() => toggleSection("bank")}>
          <span className="pp-section__num">6</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Bank Details</span>
            <span className="pp-section__desc">Bank account information for payment</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("bank") && (
          <div className="pp-section__body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heading</label>
                <input
                  type="text"
                  value={content.bankDetails.heading}
                  onChange={(e) => setContent({ ...content, bankDetails: { ...content.bankDetails, heading: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bank Name</label>
                <input
                  type="text"
                  value={content.bankDetails.bankName}
                  onChange={(e) => setContent({ ...content, bankDetails: { ...content.bankDetails, bankName: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Name</label>
                <input
                  type="text"
                  value={content.bankDetails.accountName}
                  onChange={(e) => setContent({ ...content, bankDetails: { ...content.bankDetails, accountName: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Number</label>
                <input
                  type="text"
                  value={content.bankDetails.accountNumber}
                  onChange={(e) => setContent({ ...content, bankDetails: { ...content.bankDetails, accountNumber: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Branch</label>
                <input
                  type="text"
                  value={content.bankDetails.branch}
                  onChange={(e) => setContent({ ...content, bankDetails: { ...content.bankDetails, branch: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admission Fee</label>
                <input
                  type="text"
                  value={content.bankDetails.admissionFee}
                  onChange={(e) => setContent({ ...content, bankDetails: { ...content.bankDetails, admissionFee: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <SectionSaveButton
              id="bank"
              saving={savingSection === "bank"}
              error={sectionErrors.bank}
              onSave={saveSection}
            />
          </div>
        )}
      </section>

      {/* Success Message Section */}
      <section className={`pp-section ${expandedSections.has("success") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("success")} onClick={() => toggleSection("success")}>
          <span className="pp-section__num">7</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Success Message</span>
            <span className="pp-section__desc">Post-submission success message</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("success") && (
          <div className="pp-section__body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heading</label>
                <input
                  type="text"
                  value={content.successMessage.heading}
                  onChange={(e) => setContent({ ...content, successMessage: { ...content.successMessage, heading: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                <textarea
                  value={content.successMessage.message}
                  onChange={(e) => setContent({ ...content, successMessage: { ...content.successMessage, message: e.target.value } })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reference Text</label>
                <input
                  type="text"
                  value={content.successMessage.reference}
                  onChange={(e) => setContent({ ...content, successMessage: { ...content.successMessage, reference: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <SectionSaveButton
              id="success"
              saving={savingSection === "success"}
              error={sectionErrors.success}
              onSave={saveSection}
            />
          </div>
        )}
      </section>

      {/* Need Help Section */}
      <section className={`pp-section ${expandedSections.has("needhelp") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("needhelp")} onClick={() => toggleSection("needhelp")}>
          <span className="pp-section__num">8</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Need Help</span>
            <span className="pp-section__desc">Help section with contact information</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("needhelp") && (
          <div className="pp-section__body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heading</label>
                <input
                  type="text"
                  value={content.needHelp.heading}
                  onChange={(e) => setContent({ ...content, needHelp: { ...content.needHelp, heading: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <RichTextEditor
                  content={content.needHelp.description}
                  onChange={(html) => setContent({ ...content, needHelp: { ...content.needHelp, description: html } })}
                  placeholder="For any queries or technical assistance..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={content.needHelp.email}
                  onChange={(e) => setContent({ ...content, needHelp: { ...content.needHelp, email: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="info@pcm.edu.np"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                <input
                  type="text"
                  value={content.needHelp.phone}
                  onChange={(e) => setContent({ ...content, needHelp: { ...content.needHelp, phone: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(061) 544761, 570124"
                />
              </div>
            </div>
            <SectionSaveButton
              id="needhelp"
              saving={savingSection === "needhelp"}
              error={sectionErrors.needhelp}
              onSave={saveSection}
            />
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className={`pp-section ${expandedSections.has("cta") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("cta")} onClick={() => toggleSection("cta")}>
          <span className="pp-section__num">9</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Call to Action</span>
            <span className="pp-section__desc">CTA banner with buttons</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("cta") && (
          <div className="pp-section__body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Eyebrow Text</label>
                <input
                  type="text"
                  value={content.cta.eyebrow}
                  onChange={(e) => setContent({ ...content, cta: { ...content.cta, eyebrow: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter to Learn — Go Forth to Serve"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heading</label>
                <input
                  type="text"
                  value={content.cta.heading}
                  onChange={(e) => setContent({ ...content, cta: { ...content.cta, heading: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <RichTextEditor
                  content={content.cta.description}
                  onChange={(html) => setContent({ ...content, cta: { ...content.cta, description: html } })}
                  placeholder="Applications are open for the upcoming intake..."
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Primary Button</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={content.cta.primaryButtonText}
                      onChange={(e) => setContent({ ...content, cta: { ...content.cta, primaryButtonText: e.target.value } })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={content.cta.primaryButtonLink}
                      onChange={(e) => setContent({ ...content, cta: { ...content.cta, primaryButtonLink: e.target.value } })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#apply-form or /page"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Secondary Button</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={content.cta.secondaryButtonText}
                      onChange={(e) => setContent({ ...content, cta: { ...content.cta, secondaryButtonText: e.target.value } })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={content.cta.secondaryButtonLink}
                      onChange={(e) => setContent({ ...content, cta: { ...content.cta, secondaryButtonLink: e.target.value } })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/about or /contact"
                    />
                  </div>
                </div>
              </div>
            </div>
            <SectionSaveButton
              id="cta"
              saving={savingSection === "cta"}
              error={sectionErrors.cta}
              onSave={saveSection}
            />
          </div>
        )}
      </section>

      {/* SEO Section */}
      <section className={`pp-section ${expandedSections.has("seo") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("seo")} onClick={() => toggleSection("seo")}>
          <span className="pp-section__num">10</span>
          <span className="pp-section__text">
            <span className="pp-section__title">SEO & Metadata</span>
            <span className="pp-section__desc">Title, description, keywords and OG image</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("seo") && (
          <div className="pp-section__body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">SEO Title</label>
                <input
                  type="text"
                  value={content.seo.title}
                  onChange={(e) => setContent({ ...content, seo: { ...content.seo, title: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">SEO Description</label>
                <textarea
                  value={content.seo.description}
                  onChange={(e) => setContent({ ...content, seo: { ...content.seo, description: e.target.value } })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">OG Image</label>
                <div className="space-y-3">
                  <ImageUpload
                    onUpload={(result) => setContent({ ...content, seo: { ...content.seo, ogImage: result.secure_url } })}
                  />
                  {content.seo.ogImage ? (
                    <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                      <img
                        src={content.seo.ogImage}
                        alt="OG image preview"
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Current OG image
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {content.seo.ogImage}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setContent({ ...content, seo: { ...content.seo, ogImage: "" } })}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Keywords</label>
                  <button type="button" onClick={addKeyword} className="admin-btn admin-btn--sm">
                    <Plus size={16} /> Add Keyword
                  </button>
                </div>
                <div className="space-y-2">
                  {content.seo.keywords.map((keyword, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => updateKeyword(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                      />
                      <button type="button" onClick={() => removeKeyword(idx)} className="text-red-600 hover:text-red-800 p-1">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <SectionSaveButton
              id="seo"
              saving={savingSection === "seo"}
              error={sectionErrors.seo}
              onSave={saveSection}
            />
          </div>
        )}
      </section>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 -mx-6 shadow-lg">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn--primary w-full sm:w-auto"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <Dialog
        open={stepModal !== null}
        onOpenChange={(open) => !open && closeStepModal()}
      >
        <DialogContent
          showCloseButton={false}
          className="news-modal w-[min(100%,520px)] sm:max-w-[520px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
        >
          <div className="modal__head">
            <DialogTitle className="m-0 text-[1.05rem] font-normal">
              {stepModal?.mode === "edit" ? "Edit Step" : "Add Step"}
            </DialogTitle>
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Close"
              onClick={closeStepModal}
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal__body">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="step-number">Number</label>
                <input
                  id="step-number"
                  type="text"
                  value={stepDraft.number}
                  onChange={(e) =>
                    setStepDraft((d) => ({ ...d, number: e.target.value }))
                  }
                  placeholder="1"
                />
              </div>
              <div className="field field--full">
                <label htmlFor="step-title">
                  Title <span className="req">*</span>
                </label>
                <input
                  id="step-title"
                  type="text"
                  value={stepDraft.title}
                  onChange={(e) =>
                    setStepDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  placeholder="Fill and submit the application form"
                />
              </div>
              <div className="field field--full">
                <label htmlFor="step-description">Description</label>
                <RichTextEditor
                  content={stepDraft.description}
                  onChange={(html) =>
                    setStepDraft((d) => ({ ...d, description: html }))
                  }
                  placeholder="Visit the admissions portal and complete the online application..."
                />
              </div>
            </div>
          </div>

          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={closeStepModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={saveStep}
              disabled={!stepDraft.title.trim()}
            >
              {stepModal?.mode === "edit" ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={optionModal !== null}
        onOpenChange={(open) => !open && closeOptionModal()}
      >
        <DialogContent
          showCloseButton={false}
          className="news-modal w-[min(100%,520px)] sm:max-w-[520px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
        >
          <div className="modal__head">
            <DialogTitle className="m-0 text-[1.05rem] font-normal">
              Edit {optionModal === "offline" ? "Offline" : "Online"} Option
            </DialogTitle>
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Close"
              onClick={closeOptionModal}
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal__body">
            <div className="form-grid">
              <div className="field field--full">
                <label htmlFor="option-title">
                  Title <span className="req">*</span>
                </label>
                <input
                  id="option-title"
                  type="text"
                  value={optionDraft.title}
                  onChange={(e) =>
                    setOptionDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  placeholder="Apply online"
                />
              </div>
              <div className="field field--full">
                <label htmlFor="option-description">Description</label>
                <RichTextEditor
                  content={optionDraft.description}
                  onChange={(html) =>
                    setOptionDraft((d) => ({ ...d, description: html }))
                  }
                  placeholder="Fill the online form and submit with required documents..."
                />
              </div>
              <div className="field field--full">
                <label htmlFor="option-button-text">Button Text</label>
                <input
                  id="option-button-text"
                  type="text"
                  value={optionDraft.buttonText}
                  onChange={(e) =>
                    setOptionDraft((d) => ({ ...d, buttonText: e.target.value }))
                  }
                  placeholder="Apply Online"
                />
              </div>
            </div>
          </div>

          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={closeOptionModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={saveOption}
              disabled={!optionDraft.title.trim()}
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
