"use client";

import { useState, Dispatch, SetStateAction } from "react";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  X,
  FileText,
  ClipboardList,
  User,
  Phone,
  GraduationCap,
  Upload,
  ScrollText,
  Settings2,
  CheckCircle2,
} from "lucide-react";
import type { AdmissionPageContent } from "@/types/page-content";

interface ApplicationFormSectionProps {
  content: AdmissionPageContent;
  setContent: Dispatch<SetStateAction<AdmissionPageContent>>;
}

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "phone"
  | "date"
  | "dropdown"
  | "checkbox"
  | "radio"
  | "file"
  | "image";

type DynamicField = {
  id: string;
  label: string;
  fieldType: FieldType;
  placeholder?: string;
  required: boolean;
  options?: Array<{ value: string; label: string }>;
  helpText?: string;
  order: number;
};

type OptionsField = "personalInfoFields" | "contactInfoFields" | "academicInfoFields";

const FIELD_TYPE_OPTIONS: Array<{ value: FieldType; label: string }> = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "date", label: "Date" },
  { value: "dropdown", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio" },
  { value: "file", label: "File Upload" },
  { value: "image", label: "Image Upload" },
];

const inputClass =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 bg-white transition";

const labelClass = "block text-xs font-medium text-slate-600 mb-1";
const badge = (bg: string, text: string) =>
  `${bg} ${text} text-[11px] font-semibold px-2 py-0.5 rounded-full`;

const ALL_STEP_IDS = ["personalInfo", "contactInfo", "academicInfo", "documentUpload", "declaration", "paymentNote"];

export default function ApplicationFormSection({
  content,
  setContent,
}: ApplicationFormSectionProps) {
  const cf = content.applicationForm;
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (id: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allExpanded = expandedSteps.size === ALL_STEP_IDS.length;

  const toggleAll = () => {
    setExpandedSteps(allExpanded ? new Set() : new Set(ALL_STEP_IDS));
  };

  const updateForm = (patch: Partial<AdmissionPageContent["applicationForm"]>) =>
    setContent((prev) => ({ ...prev, applicationForm: { ...prev.applicationForm, ...patch } }));

  /* ---- Step labels ---- */
  const updateStepLabel = (index: number, value: string) => {
    const stepLabels = [...cf.stepLabels];
    stepLabels[index] = value;
    updateForm({ stepLabels });
  };

  /* ---- Dynamic field collections ---- */
  const getCollection = (key: OptionsField): DynamicField[] => cf[key];

  const addField = (key: OptionsField) => {
    const newField: DynamicField = {
      id: `field_${Date.now()}`,
      label: "New Field",
      fieldType: "text",
      required: false,
      order: cf[key].length + 1,
    };
    updateForm({ [key]: [...cf[key], newField] } as Partial<AdmissionPageContent["applicationForm"]>);
  };

  const updateField = (
    key: OptionsField,
    index: number,
    field: string,
    value: unknown,
  ) => {
    const list = [...cf[key]];
    const next = { ...list[index], [field]: value } as DynamicField;
    list[index] = next;
    updateForm({ [key]: list } as Partial<AdmissionPageContent["applicationForm"]>);
  };

  const removeField = (key: OptionsField, index: number) => {
    updateForm({
      [key]: cf[key].filter((_, i) => i !== index),
    } as Partial<AdmissionPageContent["applicationForm"]>);
  };

  const moveField = (key: OptionsField, index: number, direction: "up" | "down") => {
    const list = [...cf[key]];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    [list[index], list[newIndex]] = [list[newIndex], list[index]];
    list[index].order = index + 1;
    list[newIndex].order = newIndex + 1;
    updateForm({ [key]: list } as Partial<AdmissionPageContent["applicationForm"]>);
  };

  const addOption = (key: OptionsField, fieldIndex: number) => {
    const list = [...cf[key]];
    if (!list[fieldIndex].options) list[fieldIndex].options = [];
    list[fieldIndex].options!.push({ value: "", label: "" });
    updateForm({ [key]: list } as Partial<AdmissionPageContent["applicationForm"]>);
  };

  const updateOption = (
    key: OptionsField,
    fieldIndex: number,
    optionIndex: number,
    prop: "value" | "label",
    value: string,
  ) => {
    const list = [...cf[key]];
    if (!list[fieldIndex].options) return;
    list[fieldIndex].options![optionIndex][prop] = value;
    updateForm({ [key]: list } as Partial<AdmissionPageContent["applicationForm"]>);
  };

  const removeOption = (key: OptionsField, fieldIndex: number, optionIndex: number) => {
    const list = [...cf[key]];
    if (!list[fieldIndex].options) return;
    list[fieldIndex].options = list[fieldIndex].options!.filter((_, i) => i !== optionIndex);
    updateForm({ [key]: list } as Partial<AdmissionPageContent["applicationForm"]>);
  };

  /* ---- Document / declaration ---- */
  const updateDocumentStep = (field: string, value: string) => {
    updateForm({ documentStep: { ...cf.documentStep, [field]: value } } as Partial<
      AdmissionPageContent["applicationForm"]
    >);
  };

  const updateDeclarationStep = (field: string, value: string) => {
    updateForm({ declarationStep: { ...cf.declarationStep, [field]: value } } as Partial<
      AdmissionPageContent["applicationForm"]
    >);
  };

  const updateDocumentLabel = (index: number, value: string) => {
    const documentLabels = [...cf.documentStep.documentLabels];
    documentLabels[index] = { ...documentLabels[index], label: value };
    updateForm({ documentStep: { ...cf.documentStep, documentLabels } } as Partial<
      AdmissionPageContent["applicationForm"]
    >);
  };

  const updateDocumentType = (index: number, type: "document" | "image") => {
    const documentLabels = [...cf.documentStep.documentLabels];
    documentLabels[index] = { ...documentLabels[index], type };
    updateForm({ documentStep: { ...cf.documentStep, documentLabels } } as Partial<
      AdmissionPageContent["applicationForm"]
    >);
  };

  const steps: Array<{
    key: OptionsField;
    title: string;
    desc: string;
    icon: typeof User;
    accent: string;
  }> = [
    {
      key: "personalInfoFields",
      title: "Personal Information",
      desc: "Applicant identity, contact basics and programme selection",
      icon: User,
      accent: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      key: "contactInfoFields",
      title: "Contact Information",
      desc: "Permanent and temporary address details",
      icon: Phone,
      accent: "text-violet-600 bg-violet-50 border-violet-200",
    },
    {
      key: "academicInfoFields",
      title: "Academic Information",
      desc: "SEE and intermediate education records",
      icon: GraduationCap,
      accent: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <CheckCircle2 size={14} className="text-slate-400" />
          {expandedSteps.size} of {ALL_STEP_IDS.length} steps expanded
        </span>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
        >
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* Form basics */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 size={18} className="text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-800">Form Settings</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className={labelClass}>Step Labels</label>
            <div className="flex flex-wrap gap-2">
              {cf.stepLabels.map((label, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => updateStepLabel(idx, e.target.value)}
                    className="w-40 px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  {cf.stepLabels.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          applicationForm: {
                            ...prev.applicationForm,
                            stepLabels: prev.applicationForm.stepLabels.filter((_, i) => i !== idx),
                          },
                        }))
                      }
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    applicationForm: {
                      ...prev.applicationForm,
                      stepLabels: [...prev.applicationForm.stepLabels, "New Step"],
                    },
                  }))
                }
                className="h-9 px-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-dashed border-blue-300 transition"
              >
                <Plus size={15} /> Add Step
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              These labels appear in the multi-step navigation at the top of the admission form.
            </p>
          </div>

          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              type="text"
              value={cf.eyebrow}
              onChange={(e) => updateForm({ eyebrow: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Heading</label>
            <input
              type="text"
              value={cf.heading}
              onChange={(e) => updateForm({ heading: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Default Nationality</label>
            <input
              type="text"
              value={cf.nationalityDefault}
              onChange={(e) => updateForm({ nationalityDefault: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Dynamic step builders */}
      <div className="space-y-4">
        {steps.map((step, si) => {
          const Icon = step.icon;
          const fields = cf[step.key];
          const stepId = step.key === "personalInfoFields" ? "personalInfo" : step.key === "contactInfoFields" ? "contactInfo" : "academicInfo";
          const isExpanded = expandedSteps.has(stepId);
          return (
            <div
              key={step.key}
              className={`rounded-xl border bg-white shadow-sm overflow-hidden transition-colors ${isExpanded ? "border-slate-300" : "border-slate-200"}`}
            >
              <button
                type="button"
                onClick={() => toggleStep(stepId)}
                className="w-full flex items-start justify-between gap-3 px-5 py-4 bg-slate-50 border-b border-slate-200 hover:bg-slate-100/60 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${step.accent}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Step {si + 1} · {step.title}
                    </h3>
                    <p className="text-xs text-slate-500">{step.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                    {fields.length} field{fields.length === 1 ? "" : "s"}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="p-5">
                  <button
                    type="button"
                    onClick={() => addField(step.key)}
                    className="w-full py-2.5 rounded-lg border-2 border-dashed border-slate-300 text-sm font-medium text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/40 transition flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Field
                  </button>

                  <div className="mt-4 space-y-3">
                    {fields
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((field, idx) => (
                        <FieldEditor
                          key={field.id}
                          index={idx}
                          field={field}
                          isFirst={idx === 0}
                          isLast={idx === fields.length - 1}
                          onChange={(prop, value) => updateField(step.key, idx, prop, value)}
                          onMove={(dir) => moveField(step.key, idx, dir)}
                          onRemove={() => removeField(step.key, idx)}
                          onAddOption={() => addOption(step.key, idx)}
                          onUpdateOption={(oi, prop, v) => updateOption(step.key, idx, oi, prop, v)}
                          onRemoveOption={(oi) => removeOption(step.key, idx, oi)}
                        />
                      ))}
                  </div>

                  {fields.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-6">
                      No fields yet. Click &quot;Add Field&quot; to build this step.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Documents step */}
      <StepCard
        stepNumber={4}
        title="Document Upload"
        desc="List of documents students must attach"
        icon={Upload}
        accent="text-emerald-600 bg-emerald-50 border-emerald-200"
        badge={`${cf.documentStep.documentLabels.length} documents`}
        isExpanded={expandedSteps.has("documentUpload")}
        onToggle={() => toggleStep("documentUpload")}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Step Heading</label>
            <input
              type="text"
              value={cf.documentStep.heading}
              onChange={(e) => updateDocumentStep("heading", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <input
              type="text"
              value={cf.documentStep.description}
              onChange={(e) => updateDocumentStep("description", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass}>Document Labels</label>
            <button
              type="button"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  applicationForm: {
                    ...prev.applicationForm,
                    documentStep: {
                      ...prev.applicationForm.documentStep,
                      documentLabels: [
                        ...prev.applicationForm.documentStep.documentLabels,
                        { label: "New Document", type: "document" },
                      ],
                    },
                  },
                }))
              }
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {cf.documentStep.documentLabels.map((docEntry, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 text-xs text-slate-400 text-right">{idx + 1}.</span>
                <input
                  type="text"
                  value={docEntry.label}
                  onChange={(e) => updateDocumentLabel(idx, e.target.value)}
                  className={inputClass}
                  placeholder="Document label"
                />
                <select
                  value={docEntry.type}
                  onChange={(e) => updateDocumentType(idx, e.target.value as "document" | "image")}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 bg-white transition w-36"
                >
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                </select>
                <button
                  type="button"
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      applicationForm: {
                        ...prev.applicationForm,
                        documentStep: {
                          ...prev.applicationForm.documentStep,
                          documentLabels: prev.applicationForm.documentStep.documentLabels.filter(
                            (_, i) => i !== idx,
                          ),
                        },
                      },
                    }))
                  }
                  className="text-slate-400 hover:text-red-600 p-1.5 shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </StepCard>

      {/* Declaration step */}
      <StepCard
        stepNumber={5}
        title="Declaration & Consent"
        desc="Declaration text and agreement checkbox"
        icon={ScrollText}
        accent="text-rose-600 bg-rose-50 border-rose-200"
        badge="Declaration text"
        isExpanded={expandedSteps.has("declaration")}
        onToggle={() => toggleStep("declaration")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Step Heading</label>
              <input
                type="text"
                value={cf.declarationStep.heading}
                onChange={(e) => updateDeclarationStep("heading", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input
                type="text"
                value={cf.declarationStep.description}
                onChange={(e) => updateDeclarationStep("description", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Declaration Heading</label>
              <input
                type="text"
                value={cf.declarationStep.declarationHeading}
                onChange={(e) => updateDeclarationStep("declarationHeading", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Checkbox Label</label>
              <input
                type="text"
                value={cf.declarationStep.checkboxLabel}
                onChange={(e) => updateDeclarationStep("checkboxLabel", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Declaration Text</label>
            <textarea
              value={cf.declarationStep.declarationText}
              onChange={(e) => updateDeclarationStep("declarationText", e.target.value)}
              rows={5}
              className={inputClass}
              placeholder="Full declaration text that students must agree to"
            />
          </div>
        </div>
      </StepCard>

      {/* Payment note */}
      <div className={`rounded-xl border bg-white shadow-sm overflow-hidden transition-colors ${expandedSteps.has("paymentNote") ? "border-slate-300" : "border-slate-200"}`}>
        <button
          type="button"
          onClick={() => toggleStep("paymentNote")}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-slate-50 border-b border-slate-200 hover:bg-slate-100/60 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border flex items-center justify-center text-indigo-600 bg-indigo-50 border-indigo-200">
              <ClipboardList size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Step 6 · Payment</h3>
              <p className="text-xs text-slate-500">Bank details and payment slip upload</p>
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform duration-200 shrink-0 ${expandedSteps.has("paymentNote") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSteps.has("paymentNote") && (
          <div className="p-5">
            <div className="flex items-start gap-3">
              <ClipboardList size={18} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-600">No configuration needed</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  The payment step displays the bank details configured in the &quot;Bank Details&quot;
                  section above and lets applicants upload a payment slip.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Reusable step card shell ---- */
function StepCard({
  stepNumber,
  title,
  desc,
  icon: Icon,
  accent,
  badge,
  isExpanded,
  onToggle,
  children,
}: {
  stepNumber: number;
  title: string;
  desc: string;
  icon: typeof User;
  accent: string;
  badge: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border bg-white shadow-sm overflow-hidden transition-colors ${isExpanded ? "border-slate-300" : "border-slate-200"}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-3 px-5 py-4 bg-slate-50 border-b border-slate-200 hover:bg-slate-100/60 transition text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${accent}`}>
            <Icon size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Step {stepNumber} · {title}
            </h3>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-medium whitespace-nowrap">
            {badge}
          </span>
          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {isExpanded && <div className="p-5">{children}</div>}
    </div>
  );
}

/* ---- Field editor card ---- */
function FieldEditor({
  index,
  field,
  isFirst,
  isLast,
  onChange,
  onMove,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: {
  index: number;
  field: DynamicField;
  isFirst: boolean;
  isLast: boolean;
  onChange: (prop: string, value: unknown) => void;
  onMove: (dir: "up" | "down") => void;
  onRemove: () => void;
  onAddOption: () => void;
  onUpdateOption: (optionIndex: number, prop: "value" | "label", value: string) => void;
  onRemoveOption: (optionIndex: number) => void;
}) {
  return (
    <div className="border border-slate-200 rounded-lg bg-white transition hover:border-slate-300 focus-within:border-blue-400">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50/60 border-b border-slate-100 rounded-t-lg">
        <GripVertical size={15} className="text-slate-300" />
        <span className="text-xs font-mono text-slate-500">{field.id}</span>
        <div className="ml-auto flex items-center gap-1">
          <span
            className={badge(
              field.required ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-600",
              "",
            )}
          >
            {field.required ? "Required" : "Optional"}
          </span>
          <button
            type="button"
            onClick={() => onMove("up")}
            disabled={isFirst}
            className="p-1 text-slate-500 hover:bg-slate-200 rounded disabled:opacity-30"
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            onClick={() => onMove("down")}
            disabled={isLast}
            className="p-1 text-slate-500 hover:bg-slate-200 rounded disabled:opacity-30"
          >
            <ChevronDown size={16} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded ml-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Field Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onChange("label", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Field Type</label>
            <select
              value={field.fieldType}
              onChange={(e) => onChange("fieldType", e.target.value)}
              className={inputClass}
            >
              {FIELD_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Placeholder</label>
            <input
              type="text"
              value={field.placeholder || ""}
              onChange={(e) => onChange("placeholder", e.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Help Text</label>
            <input
              type="text"
              value={field.helpText || ""}
              onChange={(e) => onChange("helpText", e.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onChange("required", e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Required field</span>
        </label>

        {(field.fieldType === "dropdown" ||
          field.fieldType === "radio" ||
          field.fieldType === "checkbox") && (
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">Options</label>
              <button
                type="button"
                onClick={onAddOption}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <Plus size={14} /> Add Option
              </button>
            </div>
            <div className="space-y-2">
              {field.options?.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Value (e.g., bba)"
                    value={opt.value}
                    onChange={(e) => onUpdateOption(optIdx, "value", e.target.value)}
                    className={`${inputClass} !py-1.5 !text-xs`}
                  />
                  <input
                    type="text"
                    placeholder="Label (e.g., BBA)"
                    value={opt.label}
                    onChange={(e) => onUpdateOption(optIdx, "label", e.target.value)}
                    className={`${inputClass} !py-1.5 !text-xs`}
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveOption(optIdx)}
                    className="text-slate-400 hover:text-red-600 p-1 shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
