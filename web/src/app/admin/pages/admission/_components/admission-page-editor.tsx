"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Plus, X } from "lucide-react";
import { toast } from "sonner";
import type { AdmissionPageContent } from "@/types/page-content";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import ApplicationFormSection from "./application-form-section";

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

export default function AdmissionPageEditor({ initialContent }: AdmissionPageEditorProps) {
  const [content, setContent] = useState<AdmissionPageContent>(initialContent);
  const [saving, setSaving] = useState(false);
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
      const response = await fetch("/api/admin/pages/admission", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }

      toast.success("Admission page updated successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Process steps helpers
  const addProcessStep = () => {
    setContent({
      ...content,
      admissionProcess: {
        ...content.admissionProcess,
        steps: [
          ...content.admissionProcess.steps,
          { number: String(content.admissionProcess.steps.length + 1), title: "New Step", description: "" },
        ],
      },
    });
  };

  const updateProcessStep = (index: number, field: "number" | "title" | "description", value: string) => {
    const newSteps = [...content.admissionProcess.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setContent({
      ...content,
      admissionProcess: { ...content.admissionProcess, steps: newSteps },
    });
  };

  const removeProcessStep = (index: number) => {
    setContent({
      ...content,
      admissionProcess: {
        ...content.admissionProcess,
        steps: content.admissionProcess.steps.filter((_, i) => i !== index),
      },
    });
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
                    onClick={addProcessStep}
                    className="admin-btn admin-btn--sm"
                  >
                    <Plus size={16} /> Add Step
                  </button>
                </div>
                <div className="space-y-3">
                  {content.admissionProcess.steps.map((step, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-500">Step {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeProcessStep(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Number</label>
                          <input
                            type="text"
                            value={step.number}
                            onChange={(e) => updateProcessStep(idx, "number", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => updateProcessStep(idx, "title", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                          <textarea
                            value={step.description}
                            onChange={(e) => updateProcessStep(idx, "description", e.target.value)}
                            rows={2}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                <textarea
                  value={content.applyOptions.description}
                  onChange={(e) => setContent({ ...content, applyOptions: { ...content.applyOptions, description: e.target.value } })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Online Option</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={content.applyOptions.onlineOption.title}
                      onChange={(e) => setContent({ ...content, applyOptions: { ...content.applyOptions, onlineOption: { ...content.applyOptions.onlineOption, title: e.target.value } } })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      value={content.applyOptions.onlineOption.description}
                      onChange={(e) => setContent({ ...content, applyOptions: { ...content.applyOptions, onlineOption: { ...content.applyOptions.onlineOption, description: e.target.value } } })}
                      rows={2}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={content.applyOptions.onlineOption.buttonText}
                      onChange={(e) => setContent({ ...content, applyOptions: { ...content.applyOptions, onlineOption: { ...content.applyOptions.onlineOption, buttonText: e.target.value } } })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Offline Option</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={content.applyOptions.offlineOption.title}
                      onChange={(e) => setContent({ ...content, applyOptions: { ...content.applyOptions, offlineOption: { ...content.applyOptions.offlineOption, title: e.target.value } } })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      value={content.applyOptions.offlineOption.description}
                      onChange={(e) => setContent({ ...content, applyOptions: { ...content.applyOptions, offlineOption: { ...content.applyOptions.offlineOption, description: e.target.value } } })}
                      rows={2}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={content.applyOptions.offlineOption.buttonText}
                      onChange={(e) => setContent({ ...content, applyOptions: { ...content.applyOptions, offlineOption: { ...content.applyOptions.offlineOption, buttonText: e.target.value } } })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
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
                <textarea
                  value={content.needHelp.description}
                  onChange={(e) => setContent({ ...content, needHelp: { ...content.needHelp, description: e.target.value } })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <textarea
                  value={content.cta.description}
                  onChange={(e) => setContent({ ...content, cta: { ...content.cta, description: e.target.value } })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>
  );
}
