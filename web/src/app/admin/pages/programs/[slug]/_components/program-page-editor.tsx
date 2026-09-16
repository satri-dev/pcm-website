"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Info,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { Program } from "@/types/programs";
import ImageUpload from "@/components/cloudinary/ImageUpload";
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

/* ----------------------------------------------------------------
   Types
----------------------------------------------------------------- */
interface TextItem {
  title: string;
  description: string;
}
interface AdmissionItem {
  title: string;
  detail: string;
}
interface Course {
  code: string;
  description: string;
  credits: string;
}
interface Semester {
  label: string;
  courses: Course[];
}
interface QuickFactsContent {
  level: string;
  duration: string;
  semesters: number;
  creditHours: number;
  eligibility: string;
  affiliation: string;
  labels: {
    heading: string;
    level: string;
    duration: string;
    semesters: string;
    creditHours: string;
    eligibility: string;
    affiliation: string;
  };
}
interface CtaButton {
  text: string;
  url: string;
}
export interface ProgramPageContent {
  hero: { tagline: string };
  overview: { title: string; body: string };
  concentrations: TextItem[];
  careers: string[];
  admissionRequirements: AdmissionItem[];
  quickFacts: QuickFactsContent;
  curriculum: Semester[];
  totalCredits: string;
  curriculumSection: { eyebrow: string; title: string; description: string };
  coordinator: { name: string; initials: string; image: string; role: string; quote: string };
  growthSection: { title: string; items: TextItem[] };
  callout: { title: string; body: string };
  cta: {
    title: string;
    body: string;
    buttons: {
      primary: CtaButton;
      secondary: CtaButton;
    };
  };
}

interface SectionMeta {
  id: string;
  title: string;
  desc: string;
}

const SECTIONS: SectionMeta[] = [
  { id: "hero", title: "Hero Section", desc: "Tagline shown under the program name" },
  { id: "overview", title: "Overview", desc: "Section title and body paragraphs" },
  { id: "concentrations", title: "Areas of Concentration", desc: "Icon cards on the page" },
  { id: "careers", title: "Career Opportunities", desc: "Career titles shown as pills" },
  { id: "admission", title: "Admission Requirements", desc: "Eligibility requirements list" },
  { id: "quickFacts", title: "Quick Facts", desc: "Sidebar facts, labels & buttons" },
  { id: "curriculum", title: "Curriculum", desc: "Semesters and courses" },
  { id: "coordinator", title: "Program Coordinator", desc: "Coordinator profile card" },
  { id: "growth", title: "Growth Section", desc: "How students grow at PCM" },
  { id: "callout", title: "Callout & CTA", desc: "Bottom callout and CTA boxes" },
];

const ALL_SECTION_IDS = SECTIONS.map((s) => s.id);

function isSectionFilled(id: string, f: ProgramPageContent): boolean {
  switch (id) {
    case "hero":
      return f.hero.tagline.trim().length > 0;
    case "overview":
      return f.overview.title.trim().length > 0 || f.overview.body.trim().length > 0;
    case "concentrations":
      return f.concentrations.length > 0;
    case "careers":
      return f.careers.length > 0;
    case "admission":
      return f.admissionRequirements.length > 0;
    case "quickFacts":
      return Boolean(
        f.quickFacts.labels.heading ||
          f.quickFacts.labels.level ||
          f.quickFacts.labels.duration ||
          f.quickFacts.labels.semesters ||
          f.quickFacts.labels.creditHours ||
          f.quickFacts.labels.eligibility ||
          f.quickFacts.labels.affiliation ||
          f.quickFacts.level ||
          f.quickFacts.duration ||
          f.quickFacts.semesters ||
          f.quickFacts.creditHours ||
          f.quickFacts.eligibility ||
          f.quickFacts.affiliation
      );
    case "curriculum":
      return f.curriculum.length > 0;
    case "coordinator":
      return Boolean(f.coordinator.name || f.coordinator.initials || f.coordinator.role);
    case "growth":
      return f.growthSection.title.trim().length > 0 || f.growthSection.items.length > 0;
    case "callout":
      return Boolean(
        f.callout.title || f.callout.body || f.cta.title || f.cta.body
      );
    default:
      return false;
  }
}

/* ----------------------------------------------------------------
   Small building blocks
----------------------------------------------------------------- */
function Field({
  label,
  hint,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className="pp-add-btn" onClick={onClick}>
      <Plus size={15} />
      {children}
    </button>
  );
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
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
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
      { duration: Infinity, position: "top-center" }
    );
  });
}

function RemoveButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className="pp-remove-btn"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <Trash2 size={15} />
    </button>
  );
}

function SubSection({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pp-callout">
      <div className="pp-callout__head">{title}</div>
      {desc && <p className="pp-callout__desc">{desc}</p>}
      <div className="form-grid">{children}</div>
    </div>
  );
}

function CollapsibleSection({
  number,
  id,
  title,
  desc,
  isExpanded,
  isFilled,
  onToggle,
  children,
  footer,
}: {
  number: number;
  id: string;
  title: string;
  desc: string;
  isExpanded: boolean;
  isFilled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className={`pp-section ${isExpanded ? "is-expanded" : ""}`} id={`section-${id}`}>
      <button
        type="button"
        className="pp-section__toggle"
        aria-expanded={isExpanded}
        onClick={onToggle}
      >
        <span className="pp-section__num">{number}</span>
        <span className="pp-section__text">
          <span className="pp-section__title">{title}</span>
          <span className="pp-section__desc">{desc}</span>
        </span>
        <span className={`badge ${isFilled ? "badge--green" : "badge--gray"}`}>
          {isFilled ? "Complete" : "Empty"}
        </span>
        <span className="pp-section__chevron">
          <ChevronDown size={18} />
        </span>
      </button>
      {isExpanded && (
        <div className="pp-section__body">
          {children}
          {footer}
        </div>
      )}
    </section>
  );
}

function OverviewNav({
  sections,
  filledSections,
  expandedSections,
  onToggle,
}: {
  sections: SectionMeta[];
  filledSections: boolean[];
  expandedSections: Set<string>;
  onToggle: (id: string) => void;
}) {
  const filledCount = filledSections.filter(Boolean).length;
  const pct = Math.round((filledCount / sections.length) * 100);

  return (
    <div className="pp-overview">
      <div className="pp-overview__head">
        <span className="pp-overview__heading">Page Overview</span>
        <span className="badge badge--blue">
          {filledCount}/{sections.length} filled
        </span>
      </div>
      <div className="pp-overview__list">
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`pp-overview__item ${
              expandedSections.has(s.id) ? "is-expanded" : ""
            } ${filledSections[i] ? "is-filled" : ""}`}
            onClick={() => onToggle(s.id)}
          >
            <span className="pp-overview__num">{i + 1}</span>
            <span className="min-w-0 truncate">{s.title}</span>
            <span className="pp-overview__dot" />
          </button>
        ))}
      </div>
      <div className="pp-overview__progress">
        <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--admin-muted)]">
          <span>Completion</span>
          <span className="font-semibold text-[var(--admin-ink)]">{pct}%</span>
        </div>
        <div className="pp-overview__bar">
          <div className="pp-overview__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Editor
----------------------------------------------------------------- */
interface ProgramPageEditorProps {
  program: Program;
  initialContent?: Partial<ProgramPageContent>;
}

// Legacy content stored overview.body as an array of paragraphs; normalize to HTML.
function normalizeOverviewBody(body: unknown): string {
  if (Array.isArray(body)) return body.map((p) => `<p>${p}</p>`).join("");
  return typeof body === "string" ? body : "";
}

// Plain-text preview for table cells (descriptions are stored as rich-text HTML).
function stripHtml(html: string): string {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function defaults(initialContent: Partial<ProgramPageContent>): ProgramPageContent {
  return {
    hero: { tagline: initialContent?.hero?.tagline ?? "" },
    overview: {
      title: initialContent?.overview?.title ?? "",
      body: normalizeOverviewBody(initialContent?.overview?.body ?? ""),
    },
    concentrations: initialContent?.concentrations ?? [],
    careers: initialContent?.careers ?? [],
    admissionRequirements: initialContent?.admissionRequirements ?? [],
    quickFacts: {
      level: initialContent?.quickFacts?.level ?? "",
      duration: initialContent?.quickFacts?.duration ?? "",
      semesters: initialContent?.quickFacts?.semesters ?? 0,
      creditHours: initialContent?.quickFacts?.creditHours ?? 0,
      eligibility: initialContent?.quickFacts?.eligibility ?? "",
      affiliation: initialContent?.quickFacts?.affiliation ?? "",
      labels: {
        heading: initialContent?.quickFacts?.labels?.heading || "Quick facts",
        level: initialContent?.quickFacts?.labels?.level || "Level",
        duration: initialContent?.quickFacts?.labels?.duration || "Duration",
        semesters: initialContent?.quickFacts?.labels?.semesters || "Semesters",
        creditHours: initialContent?.quickFacts?.labels?.creditHours || "Credit hours",
        eligibility: initialContent?.quickFacts?.labels?.eligibility || "Eligibility",
        affiliation: initialContent?.quickFacts?.labels?.affiliation || "Affiliation",
      },
    },
    curriculum: initialContent?.curriculum ?? [],
    totalCredits: initialContent?.totalCredits ?? "",
    curriculumSection: {
      eyebrow: initialContent?.curriculumSection?.eyebrow ?? "Curriculum",
      title: initialContent?.curriculumSection?.title ?? "Program structure & syllabus",
      description:
        initialContent?.curriculumSection?.description ??
        "A carefully sequenced eight-semester journey from fundamentals to specialisation, capstone projects and a professional internship.",
    },
    coordinator: {
      name: initialContent?.coordinator?.name ?? "",
      initials: initialContent?.coordinator?.initials ?? "",
      image: initialContent?.coordinator?.image ?? "",
      role: initialContent?.coordinator?.role ?? "",
      quote: initialContent?.coordinator?.quote ?? "",
    },
    growthSection: {
      title: initialContent?.growthSection?.title ?? "",
      items: initialContent?.growthSection?.items ?? [],
    },
    callout: {
      title: initialContent?.callout?.title ?? "",
      body: initialContent?.callout?.body ?? "",
    },
    cta: {
      title: initialContent?.cta?.title || "Ready to apply?",
      body: initialContent?.cta?.body || "Apply online in minutes, or reach out and we'll guide you through every step.",
      buttons: {
        primary: {
          text: initialContent?.cta?.buttons?.primary?.text || "Apply Now",
          url: initialContent?.cta?.buttons?.primary?.url || "/admission",
        },
        secondary: {
          text: initialContent?.cta?.buttons?.secondary?.text || "Ask a question",
          url: initialContent?.cta?.buttons?.secondary?.url || "/contact",
        },
      },
    },
  };
}

export default function ProgramPageEditor({
  program,
  initialContent = {},
}: ProgramPageEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>(
    {},
  );
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set() // All sections collapsed initially
  );
  const [formData, setFormData] = useState<ProgramPageContent>(() => defaults(initialContent));

  const update = (next: ProgramPageContent | ((prev: ProgramPageContent) => ProgramPageContent)) => {
    setDirty(true);
    setSaved(false);
    setFormData(next);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const allExpanded = expandedSections.size === SECTIONS.length;

  const toggleAll = () => {
    setExpandedSections(allExpanded ? new Set() : new Set(ALL_SECTION_IDS));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/pages/programs/${program.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programSlug: program.slug, content: formData }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Save failed (HTTP ${res.status})`);
      }

      setDirty(false);
      setSaved(true);
      toast.success(`${program.name} page content saved successfully`);
      router.refresh();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Save failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  // Which data keys each section owns — used to save only that section.
  const sectionPayload = (
    id: string,
    f: ProgramPageContent,
  ): Record<string, unknown> => {
    switch (id) {
      case "hero":
        return { hero: f.hero };
      case "overview":
        return { overview: f.overview };
      case "concentrations":
        return { concentrations: f.concentrations };
      case "careers":
        return { careers: f.careers };
      case "admission":
        return { admissionRequirements: f.admissionRequirements };
      case "quickFacts":
        return { quickFacts: f.quickFacts, cta: { buttons: f.cta.buttons } };
      case "curriculum":
        return {
          curriculum: f.curriculum,
          totalCredits: f.totalCredits,
          curriculumSection: f.curriculumSection,
        };
      case "coordinator":
        return { coordinator: f.coordinator };
      case "growth":
        return { growthSection: f.growthSection };
      case "callout":
        return { callout: f.callout, cta: { title: f.cta.title, body: f.cta.body } };
      default:
        return {};
    }
  };

  const saveSection = async (sectionId: string) => {
    setSavingSection(sectionId);
    setSectionErrors((prev) => ({ ...prev, [sectionId]: "" }));
    setError("");

    try {
      const res = await fetch(`/api/admin/pages/programs/${program.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programSlug: program.slug,
          section: sectionId,
          content: sectionPayload(sectionId, formData),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Save failed (HTTP ${res.status})`);
      }

      setDirty(false);
      setSaved(true);
      router.refresh();
      const sectionTitle = SECTIONS.find((s) => s.id === sectionId)?.title;
      toast.success(`${sectionTitle ?? "Section"} saved successfully!`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Save failed";
      setSectionErrors((prev) => ({ ...prev, [sectionId]: errorMsg }));
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSavingSection(null);
    }
  };

  const filledSections = SECTIONS.map((s) => isSectionFilled(s.id, formData));

  const [concentrationModal, setConcentrationModal] = useState<
    { mode: "add" } | { mode: "edit"; index: number } | null
  >(null);
  const [concentrationDraft, setConcentrationDraft] = useState<TextItem>({
    title: "",
    description: "",
  });

  const openAddConcentration = () => {
    setConcentrationDraft({ title: "", description: "" });
    setConcentrationModal({ mode: "add" });
  };

  const openEditConcentration = (index: number) => {
    setConcentrationDraft({ ...formData.concentrations[index] });
    setConcentrationModal({ mode: "edit", index });
  };

  const closeConcentrationModal = () => setConcentrationModal(null);

  const saveConcentration = () => {
    if (!concentrationModal) return;
    update((f) => {
      if (concentrationModal.mode === "edit") {
        return {
          ...f,
          concentrations: f.concentrations.map((item, i) =>
            i === concentrationModal.index ? { ...concentrationDraft } : item
          ),
        };
      }
      return {
        ...f,
        concentrations: [...f.concentrations, { ...concentrationDraft }],
      };
    });
    closeConcentrationModal();
  };

  const removeConcentration = async (index: number) => {
    const ok = await confirmAction({
      title: `Remove concentration "${formData.concentrations[index].title || `#${index + 1}`}"?`,
      description: "This will remove it from the Areas of Concentration list.",
    });
    if (ok) {
      update((f) => ({
        ...f,
        concentrations: f.concentrations.filter((_, i) => i !== index),
      }));
    }
  };

  const [admissionModal, setAdmissionModal] = useState<
    { mode: "add" } | { mode: "edit"; index: number } | null
  >(null);
  const [admissionDraft, setAdmissionDraft] = useState<AdmissionItem>({
    title: "",
    detail: "",
  });

  const openAddAdmission = () => {
    setAdmissionDraft({ title: "", detail: "" });
    setAdmissionModal({ mode: "add" });
  };

  const openEditAdmission = (index: number) => {
    setAdmissionDraft({ ...formData.admissionRequirements[index] });
    setAdmissionModal({ mode: "edit", index });
  };

  const closeAdmissionModal = () => setAdmissionModal(null);

  const saveAdmission = () => {
    if (!admissionModal) return;
    update((f) => {
      if (admissionModal.mode === "edit") {
        return {
          ...f,
          admissionRequirements: f.admissionRequirements.map((item, i) =>
            i === admissionModal.index ? { ...admissionDraft } : item
          ),
        };
      }
      return {
        ...f,
        admissionRequirements: [...f.admissionRequirements, { ...admissionDraft }],
      };
    });
    closeAdmissionModal();
  };

  const removeAdmission = async (index: number) => {
    const ok = await confirmAction({
      title: `Remove requirement "${formData.admissionRequirements[index].title || `#${index + 1}`}"?`,
      description: "This will remove it from the Admission Requirements list.",
    });
    if (ok) {
      update((f) => ({
        ...f,
        admissionRequirements: f.admissionRequirements.filter((_, i) => i !== index),
      }));
    }
  };

  const [semesterModal, setSemesterModal] = useState<
    { mode: "add" } | { mode: "edit"; index: number } | null
  >(null);
  const [semesterDraft, setSemesterDraft] = useState<Semester>({
    label: "",
    courses: [],
  });

  const openAddSemester = () => {
    setSemesterDraft({ label: "", courses: [] });
    setSemesterModal({ mode: "add" });
  };

  const openEditSemester = (index: number) => {
    const sem = formData.curriculum[index];
    setSemesterDraft({ label: sem.label, courses: sem.courses.map((c) => ({ ...c })) });
    setSemesterModal({ mode: "edit", index });
  };

  const closeSemesterModal = () => setSemesterModal(null);

  const saveSemester = () => {
    if (!semesterModal) return;
    update((f) => {
      if (semesterModal.mode === "edit") {
        return {
          ...f,
          curriculum: f.curriculum.map((s, i) =>
            i === semesterModal.index ? { label: semesterDraft.label, courses: semesterDraft.courses } : s
          ),
        };
      }
      return {
        ...f,
        curriculum: [
          ...f.curriculum,
          { label: semesterDraft.label, courses: semesterDraft.courses },
        ],
      };
    });
    closeSemesterModal();
  };

  const removeSemester = async (index: number) => {
    const ok = await confirmAction({
      title: `Remove "${formData.curriculum[index].label || `Sem ${index + 1}`}"?`,
      description: "All of its courses will also be removed. This cannot be undone.",
    });
    if (ok) {
      update((f) => ({
        ...f,
        curriculum: f.curriculum.filter((_, i) => i !== index),
      }));
    }
  };

  const updateSemesterCourse = (
    courseIdx: number,
    field: "code" | "description" | "credits",
    value: string
  ) => {
    setSemesterDraft((d) => ({
      ...d,
      courses: d.courses.map((c, ci) =>
        ci === courseIdx ? { ...c, [field]: value } : c
      ),
    }));
  };

  const addSemesterCourse = () => {
    setSemesterDraft((d) => ({
      ...d,
      courses: [...d.courses, { code: "", description: "", credits: "" }],
    }));
  };

  const removeSemesterCourse = (courseIdx: number) => {
    setSemesterDraft((d) => ({
      ...d,
      courses: d.courses.filter((_, ci) => ci !== courseIdx),
    }));
  };

  const [coordinatorModal, setCoordinatorModal] = useState(false);
  const [coordinatorDraft, setCoordinatorDraft] = useState({
    name: "",
    initials: "",
    image: "",
    role: "",
    quote: "",
  });

  const openEditCoordinator = () => {
    setCoordinatorDraft({ ...formData.coordinator });
    setCoordinatorModal(true);
  };

  const closeCoordinatorModal = () => setCoordinatorModal(false);

  const saveCoordinator = () => {
    update((f) => ({ ...f, coordinator: { ...coordinatorDraft } }));
    closeCoordinatorModal();
  };

  const [growthModal, setGrowthModal] = useState<
    { mode: "add" } | { mode: "edit"; index: number } | null
  >(null);
  const [growthDraft, setGrowthDraft] = useState<TextItem>({
    title: "",
    description: "",
  });

  const openAddGrowthItem = () => {
    setGrowthDraft({ title: "", description: "" });
    setGrowthModal({ mode: "add" });
  };

  const openEditGrowthItem = (index: number) => {
    setGrowthDraft({ ...formData.growthSection.items[index] });
    setGrowthModal({ mode: "edit", index });
  };

  const closeGrowthModal = () => setGrowthModal(null);

  const saveGrowthItem = () => {
    if (!growthModal) return;
    update((f) => {
      if (growthModal.mode === "edit") {
        return {
          ...f,
          growthSection: {
            ...f.growthSection,
            items: f.growthSection.items.map((itm, i) =>
              i === growthModal.index ? { ...growthDraft } : itm
            ),
          },
        };
      }
      return {
        ...f,
        growthSection: {
          ...f.growthSection,
          items: [...f.growthSection.items, { ...growthDraft }],
        },
      };
    });
    closeGrowthModal();
  };

  const removeGrowthItem = async (index: number) => {
    const ok = await confirmAction({
      title: `Remove "${formData.growthSection.items[index].title || `#${index + 1}`}"?`,
      description: "This will remove it from the Growth items list.",
    });
    if (ok) {
      update((f) => ({
        ...f,
        growthSection: {
          ...f.growthSection,
          items: f.growthSection.items.filter((_, i) => i !== index),
        },
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="pp-editor" style={{ paddingBottom: "80px" }}>
      {error && (
        <div className="pp-banner pp-banner--error" role="alert">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="pp-info">
        <span className="pp-info__icon">
          <Info size={16} />
        </span>
        <p className="pp-info__text">
          Editing the full page content for <strong>{program.name}</strong>. Each section is
          collapsible — expand one to edit it. To change program metadata (name, seats,
          status), use{" "}
          <Link href="/admin/content/programs">Programs Management</Link>.
        </p>
        <Link
          href={`/programs/${program.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn--sm"
        >
          <ExternalLink size={14} />
          View page
        </Link>
      </div>

      <div className="pp-toolbar">
        <Link href="/admin/pages/programs" className="admin-btn admin-btn--sm">
          <ArrowLeft size={15} />
          All programs
        </Link>
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

      <div className="pp-editor__main">
        <div className="min-w-0 space-y-4">
          <CollapsibleSection
            number={1}
            id="hero"
            title={SECTIONS[0].title}
            desc={SECTIONS[0].desc}
            isExpanded={expandedSections.has("hero")}
            isFilled={filledSections[0]}
            onToggle={() => toggleSection("hero")}
            footer={
              <SectionSaveButton
                id="hero"
                saving={savingSection === "hero"}
                error={sectionErrors.hero}
                onSave={saveSection}
              />
            }
          >
            <Field
              label="Hero Tagline"
              htmlFor="hero-tagline"
              hint="Shows below the program name"
              className="max-w-2xl"
            >
              <input
                id="hero-tagline"
                type="text"
                value={formData.hero.tagline}
                onChange={(e) => update((f) => ({ ...f, hero: { tagline: e.target.value } }))}
                placeholder="e.g., Design your career in computer applications"
              />
            </Field>
          </CollapsibleSection>

          <CollapsibleSection
            number={2}
            id="overview"
            title={SECTIONS[1].title}
            desc={SECTIONS[1].desc}
            isExpanded={expandedSections.has("overview")}
            isFilled={filledSections[1]}
            onToggle={() => toggleSection("overview")}
            footer={
              <SectionSaveButton
                id="overview"
                saving={savingSection === "overview"}
                error={sectionErrors.overview}
                onSave={saveSection}
              />
            }
          >
            <div className="form-grid">
              <Field label="Section Title" htmlFor="overview-title" className="field--full">
                <input
                  id="overview-title"
                  type="text"
                  value={formData.overview.title}
                  onChange={(e) =>
                    update((f) => ({ ...f, overview: { ...f.overview, title: e.target.value } }))
                  }
                  placeholder="Why study BCA at PCM?"
                />
              </Field>
              <Field
                label="Body Paragraphs"
                htmlFor="overview-body"
                className="field--full"
              >
                <RichTextEditor
                  content={formData.overview.body}
                  onChange={(html) =>
                    update((f) => ({
                      ...f,
                      overview: { ...f.overview, body: html },
                    }))
                  }
                  placeholder="Write the overview content..."
                />
              </Field>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            number={3}
            id="concentrations"
            title={SECTIONS[2].title}
            desc={SECTIONS[2].desc}
            isExpanded={expandedSections.has("concentrations")}
            isFilled={filledSections[2]}
            onToggle={() => toggleSection("concentrations")}
            footer={
              <SectionSaveButton
                id="concentrations"
                saving={savingSection === "concentrations"}
                error={sectionErrors.concentrations}
                onSave={saveSection}
              />
            }
          >
            <div className="space-y-3">
              {formData.concentrations.length === 0 ? (
                <p className="text-sm text-[var(--admin-muted)]">
                  No concentrations yet. Click &quot;Add Concentration&quot; to create one.
                </p>
              ) : (
                <div className="pp-table-wrap rounded-lg border border-[var(--admin-line)]">
                  <Table className="table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 bg-[var(--admin-surface-2)]">#</TableHead>
                        <TableHead className="w-2/5 truncate bg-[var(--admin-surface-2)]">TITLE</TableHead>
                        <TableHead className="bg-[var(--admin-surface-2)]">DESCRIPTION</TableHead>
                        <TableHead className="w-28 text-right bg-[var(--admin-surface-2)]">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.concentrations.map((conc, idx) => (
                        <TableRow key={`concentration-${idx}`}>
                          <TableCell className="w-12 py-2.5">{idx + 1}</TableCell>
                          <TableCell className="truncate py-2.5 text-sm font-semibold">
                            {conc.title || "Untitled"}
                          </TableCell>
                          <TableCell className="cell-ellipsis py-2.5 text-sm text-[var(--admin-muted)]">
                            {conc.description ? stripHtml(conc.description) : "—"}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <div className="row-actions justify-end">
                              <button
                                type="button"
                                className="act-btn"
                                onClick={() => openEditConcentration(idx)}
                                title="Edit concentration"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                className="act-btn danger"
                                onClick={() => removeConcentration(idx)}
                                title="Remove concentration"
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
              <AddButton onClick={openAddConcentration}>
                Add Concentration
              </AddButton>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            number={4}
            id="careers"
            title={SECTIONS[3].title}
            desc={SECTIONS[3].desc}
            isExpanded={expandedSections.has("careers")}
            isFilled={filledSections[3]}
            onToggle={() => toggleSection("careers")}
            footer={
              <SectionSaveButton
                id="careers"
                saving={savingSection === "careers"}
                error={sectionErrors.careers}
                onSave={saveSection}
              />
            }
          >
            <div className="space-y-3">
              {formData.careers.map((career, idx) => (
                <div key={`career-${idx}`} className="pp-inline-row">
                  <input
                    type="text"
                    value={career}
                    onChange={(e) =>
                      update((f) => ({
                        ...f,
                        careers: f.careers.map((c, i) => (i === idx ? e.target.value : c)),
                      }))
                    }
                    placeholder="Software Engineer"
                  />
                  <RemoveButton
                    onClick={() =>
                      update((f) => ({
                        ...f,
                        careers: f.careers.filter((_, i) => i !== idx),
                      }))
                    }
                    label={`Remove career ${idx + 1}`}
                  />
                </div>
              ))}
              <AddButton
                onClick={() => update((f) => ({ ...f, careers: [...f.careers, ""] }))}
              >
                Add Career
              </AddButton>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            number={5}
            id="admission"
            title={SECTIONS[4].title}
            desc={SECTIONS[4].desc}
            isExpanded={expandedSections.has("admission")}
            isFilled={filledSections[4]}
            onToggle={() => toggleSection("admission")}
            footer={
              <SectionSaveButton
                id="admission"
                saving={savingSection === "admission"}
                error={sectionErrors.admission}
                onSave={saveSection}
              />
            }
          >
            <div className="space-y-3">
              {formData.admissionRequirements.length === 0 ? (
                <p className="text-sm text-[var(--admin-muted)]">
                  No requirements yet. Click &quot;Add Requirement&quot; to create one.
                </p>
              ) : (
                <div className="pp-table-wrap rounded-lg border border-[var(--admin-line)]">
                  <Table className="table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 bg-[var(--admin-surface-2)]">#</TableHead>
                        <TableHead className="w-2/5 truncate bg-[var(--admin-surface-2)]">TITLE</TableHead>
                        <TableHead className="bg-[var(--admin-surface-2)]">DETAIL</TableHead>
                        <TableHead className="w-28 text-right bg-[var(--admin-surface-2)]">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.admissionRequirements.map((req, idx) => (
                        <TableRow key={`admission-${idx}`}>
                          <TableCell className="w-12 py-2.5">{idx + 1}</TableCell>
                          <TableCell className="truncate py-2.5 text-sm font-semibold">
                            {req.title || "Untitled"}
                          </TableCell>
                          <TableCell className="cell-ellipsis py-2.5 text-sm text-[var(--admin-muted)]">
                            {req.detail ? stripHtml(req.detail) : "—"}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <div className="row-actions justify-end">
                              <button
                                type="button"
                                className="act-btn"
                                onClick={() => openEditAdmission(idx)}
                                title="Edit requirement"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                className="act-btn danger"
                                onClick={() => removeAdmission(idx)}
                                title="Remove requirement"
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
              <AddButton onClick={openAddAdmission}>
                Add Requirement
              </AddButton>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            number={6}
            id="quickFacts"
            title={SECTIONS[5].title}
            desc={SECTIONS[5].desc}
            isExpanded={expandedSections.has("quickFacts")}
            isFilled={filledSections[5]}
            onToggle={() => toggleSection("quickFacts")}
            footer={
              <SectionSaveButton
                id="quickFacts"
                saving={savingSection === "quickFacts"}
                error={sectionErrors.quickFacts}
                onSave={saveSection}
              />
            }
          >
            <SubSection
              title="Field Values"
              desc="Override the sidebar fact values. Values come from the program record by default — leave a field blank to keep the default."
            >
              <Field label="Section Heading" className="field--full">
                <input
                  type="text"
                  value={formData.quickFacts.labels.heading}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      quickFacts: {
                        ...f.quickFacts,
                        labels: { ...f.quickFacts.labels, heading: e.target.value },
                      },
                    }))
                  }
                  placeholder="Quick facts"
                />
              </Field>
              <Field label="Level">
                <input
                  type="text"
                  value={formData.quickFacts.level}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      quickFacts: { ...f.quickFacts, level: e.target.value },
                    }))
                  }
                  placeholder="Bachelor"
                />
              </Field>
              <Field label="Duration">
                <input
                  type="text"
                  value={formData.quickFacts.duration}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      quickFacts: { ...f.quickFacts, duration: e.target.value },
                    }))
                  }
                  placeholder="4 Years"
                />
              </Field>
              <Field label="Semesters">
                <input
                  type="number"
                  min={0}
                  value={formData.quickFacts.semesters || ""}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      quickFacts: {
                        ...f.quickFacts,
                        semesters: e.target.value === "" ? 0 : Number(e.target.value),
                      },
                    }))
                  }
                  placeholder="8"
                />
              </Field>
              <Field label="Credit Hours">
                <input
                  type="number"
                  min={0}
                  value={formData.quickFacts.creditHours || ""}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      quickFacts: {
                        ...f.quickFacts,
                        creditHours: e.target.value === "" ? 0 : Number(e.target.value),
                      },
                    }))
                  }
                  placeholder="120"
                />
              </Field>
              <Field label="Eligibility">
                <input
                  type="text"
                  value={formData.quickFacts.eligibility}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      quickFacts: { ...f.quickFacts, eligibility: e.target.value },
                    }))
                  }
                  placeholder="10+2 / A-Level"
                />
              </Field>
              <Field label="Affiliation">
                <input
                  type="text"
                  value={formData.quickFacts.affiliation}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      quickFacts: { ...f.quickFacts, affiliation: e.target.value },
                    }))
                  }
                  placeholder="Pokhara University"
                />
              </Field>
            </SubSection>

            <SubSection title="Sidebar Buttons" desc="Call-to-action buttons on the program page.">
              <Field label="Primary Button Text">
                <input
                  type="text"
                  value={formData.cta.buttons.primary.text}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      cta: {
                        ...f.cta,
                        buttons: {
                          ...f.cta.buttons,
                          primary: { ...f.cta.buttons.primary, text: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Apply for BCA"
                />
              </Field>
              <Field label="Primary Button URL">
                <input
                  type="text"
                  value={formData.cta.buttons.primary.url}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      cta: {
                        ...f.cta,
                        buttons: {
                          ...f.cta.buttons,
                          primary: { ...f.cta.buttons.primary, url: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="/admission"
                />
              </Field>
              <Field label="Secondary Button Text">
                <input
                  type="text"
                  value={formData.cta.buttons.secondary.text}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      cta: {
                        ...f.cta,
                        buttons: {
                          ...f.cta.buttons,
                          secondary: { ...f.cta.buttons.secondary, text: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="Ask a question"
                />
              </Field>
              <Field label="Secondary Button URL">
                <input
                  type="text"
                  value={formData.cta.buttons.secondary.url}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      cta: {
                        ...f.cta,
                        buttons: {
                          ...f.cta.buttons,
                          secondary: { ...f.cta.buttons.secondary, url: e.target.value },
                        },
                      },
                    }))
                  }
                  placeholder="/contact"
                />
              </Field>
            </SubSection>
          </CollapsibleSection>

          <CollapsibleSection
            number={7}
            id="curriculum"
            title={SECTIONS[6].title}
            desc={SECTIONS[6].desc}
            isExpanded={expandedSections.has("curriculum")}
            isFilled={filledSections[6]}
            onToggle={() => toggleSection("curriculum")}
            footer={
              <SectionSaveButton
                id="curriculum"
                saving={savingSection === "curriculum"}
                error={sectionErrors.curriculum}
                onSave={saveSection}
              />
            }
          >
            <SubSection
              title="Section Heading"
              desc="Edit the heading that appears above the curriculum section on the public page."
            >
              <Field label="Eyebrow Text">
                <input
                  type="text"
                  value={formData.curriculumSection.eyebrow}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      curriculumSection: { ...f.curriculumSection, eyebrow: e.target.value },
                    }))
                  }
                  placeholder="Curriculum"
                />
              </Field>
              <Field label="Section Title">
                <input
                  type="text"
                  value={formData.curriculumSection.title}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      curriculumSection: { ...f.curriculumSection, title: e.target.value },
                    }))
                  }
                  placeholder="Program structure & syllabus"
                />
              </Field>
              <Field label="Description" className="field--full">
                <RichTextEditor
                  content={formData.curriculumSection.description}
                  onChange={(html) =>
                    update((f) => ({
                      ...f,
                      curriculumSection: {
                        ...f.curriculumSection,
                        description: html,
                      },
                    }))
                  }
                  placeholder="A carefully sequenced eight-semester journey from fundamentals to specialisation..."
                />
              </Field>
            </SubSection>

            <Field
              label="Total Credits"
              hint="Shown next to the curriculum section"
              className="field--full mb-4"
            >
              <input
                type="text"
                value={formData.totalCredits}
                onChange={(e) => update((f) => ({ ...f, totalCredits: e.target.value }))}
                placeholder="126 Credit Hours"
              />
            </Field>

            <div className="space-y-3">
              {formData.curriculum.length === 0 ? (
                <p className="text-sm text-[var(--admin-muted)]">
                  No semesters yet. Click &quot;Add Semester&quot; to create one.
                </p>
              ) : (
                <div className="pp-table-wrap rounded-lg border border-[var(--admin-line)]">
                  <Table className="table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 bg-[var(--admin-surface-2)]">#</TableHead>
                        <TableHead className="w-1/3 truncate bg-[var(--admin-surface-2)]">SEMESTER</TableHead>
                        <TableHead className="bg-[var(--admin-surface-2)]">COURSES</TableHead>
                        <TableHead className="w-28 text-right bg-[var(--admin-surface-2)]">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.curriculum.map((sem, semIdx) => (
                        <TableRow key={`semester-${semIdx}`}>
                          <TableCell className="w-12 py-2.5">{semIdx + 1}</TableCell>
                          <TableCell className="truncate py-2.5 text-sm font-semibold">
                            {sem.label || `Sem ${semIdx + 1}`}
                          </TableCell>
                          <TableCell className="py-2.5 text-sm text-[var(--admin-muted)]">
                            {sem.courses.length} {sem.courses.length === 1 ? "course" : "courses"}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <div className="row-actions justify-end">
                              <button
                                type="button"
                                className="act-btn"
                                onClick={() => openEditSemester(semIdx)}
                                title="Edit semester"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                className="act-btn danger"
                                onClick={() => removeSemester(semIdx)}
                                title="Remove semester"
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
              <AddButton onClick={openAddSemester}>Add Semester</AddButton>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            number={8}
            id="coordinator"
            title={SECTIONS[7].title}
            desc={SECTIONS[7].desc}
            isExpanded={expandedSections.has("coordinator")}
            isFilled={filledSections[7]}
            onToggle={() => toggleSection("coordinator")}
            footer={
              <SectionSaveButton
                id="coordinator"
                saving={savingSection === "coordinator"}
                error={sectionErrors.coordinator}
                onSave={saveSection}
              />
            }
          >
            <div className="space-y-3">
              <div className="pp-table-wrap rounded-lg border border-[var(--admin-line)]">
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 bg-[var(--admin-surface-2)]">#</TableHead>
                      <TableHead className="w-1/3 truncate bg-[var(--admin-surface-2)]">NAME</TableHead>
                      <TableHead className="truncate bg-[var(--admin-surface-2)]">ROLE</TableHead>
                      <TableHead className="w-28 text-right bg-[var(--admin-surface-2)]">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-12 py-2.5">1</TableCell>
                      <TableCell className="truncate py-2.5 text-sm font-semibold">
                        {formData.coordinator.name || "Dr. John Doe"}
                      </TableCell>
                      <TableCell className="truncate py-2.5 text-sm text-[var(--admin-muted)]">
                        {formData.coordinator.role || "BCA Coordinator"}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="row-actions justify-end">
                          <button
                            type="button"
                            className="act-btn"
                            onClick={openEditCoordinator}
                            title="Edit coordinator"
                          >
                            <Pencil size={15} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            number={9}
            id="growth"
            title={SECTIONS[8].title}
            desc={SECTIONS[8].desc}
            isExpanded={expandedSections.has("growth")}
            isFilled={filledSections[8]}
            onToggle={() => toggleSection("growth")}
            footer={
              <SectionSaveButton
                id="growth"
                saving={savingSection === "growth"}
                error={sectionErrors.growth}
                onSave={saveSection}
              />
            }
          >
            <div className="space-y-3">
              <Field label="Section Title" className="field--full">
                <input
                  type="text"
                  value={formData.growthSection.title}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      growthSection: { ...f.growthSection, title: e.target.value },
                    }))
                  }
                  placeholder="How BCA students grow at PCM"
                />
              </Field>

              {formData.growthSection.items.length === 0 ? (
                <p className="text-sm text-[var(--admin-muted)]">
                  No growth items yet. Click &quot;Add Growth Item&quot; to create one.
                </p>
              ) : (
                <div className="pp-table-wrap rounded-lg border border-[var(--admin-line)]">
                  <Table className="table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 bg-[var(--admin-surface-2)]">#</TableHead>
                        <TableHead className="w-2/5 truncate bg-[var(--admin-surface-2)]">TITLE</TableHead>
                        <TableHead className="bg-[var(--admin-surface-2)]">DESCRIPTION</TableHead>
                        <TableHead className="w-28 text-right bg-[var(--admin-surface-2)]">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.growthSection.items.map((item, idx) => (
                        <TableRow key={`growth-${idx}`}>
                          <TableCell className="w-12 py-2.5">{idx + 1}</TableCell>
                          <TableCell className="truncate py-2.5 text-sm font-semibold">
                            {item.title}
                          </TableCell>
                          <TableCell className="cell-ellipsis py-2.5 text-sm text-[var(--admin-muted)]">
                            {stripHtml(item.description)}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <div className="row-actions justify-end">
                              <button
                                type="button"
                                className="act-btn"
                                onClick={() => openEditGrowthItem(idx)}
                                title="Edit growth item"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                className="act-btn danger"
                                onClick={() => removeGrowthItem(idx)}
                                title="Remove growth item"
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

              <AddButton onClick={openAddGrowthItem}>Add Growth Item</AddButton>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            number={10}
            id="callout"
            title={SECTIONS[9].title}
            desc={SECTIONS[9].desc}
            isExpanded={expandedSections.has("callout")}
            isFilled={filledSections[9]}
            onToggle={() => toggleSection("callout")}
            footer={
              <SectionSaveButton
                id="callout"
                saving={savingSection === "callout"}
                error={sectionErrors.callout}
                onSave={saveSection}
              />
            }
          >
            <SubSection title="Callout Box" desc="The highlighted note inside the page body.">
              <Field label="Title" className="field--full">
                <input
                  type="text"
                  value={formData.callout.title}
                  onChange={(e) =>
                    update((f) => ({ ...f, callout: { ...f.callout, title: e.target.value } }))
                  }
                  placeholder="Non-credit courses"
                />
              </Field>
              <Field label="Body" className="field--full">
                <textarea
                  rows={3}
                  value={formData.callout.body}
                  onChange={(e) =>
                    update((f) => ({ ...f, callout: { ...f.callout, body: e.target.value } }))
                  }
                  placeholder="Every semester includes..."
                />
              </Field>
            </SubSection>

            <SubSection title="Bottom CTA Section" desc="The closing call-to-action on the page.">
              <Field label="Title" className="field--full">
                <input
                  type="text"
                  value={formData.cta.title}
                  onChange={(e) => update((f) => ({ ...f, cta: { ...f.cta, title: e.target.value } }))}
                  placeholder="Ready to apply for BCA?"
                />
              </Field>
              <Field label="Body" className="field--full">
                <textarea
                  rows={2}
                  value={formData.cta.body}
                  onChange={(e) => update((f) => ({ ...f, cta: { ...f.cta, body: e.target.value } }))}
                  placeholder="Apply online in minutes..."
                />
              </Field>
            </SubSection>
          </CollapsibleSection>
        </div>

        <aside className="pp-editor__aside">
          <OverviewNav
            sections={SECTIONS}
            filledSections={filledSections}
            expandedSections={expandedSections}
            onToggle={toggleSection}
          />
        </aside>
      </div>
      </div>

      <div className="pp-savebar-fixed px-6 py-4">
        <div className="flex items-center justify-end gap-3">
          <span className="pp-savebar__status">
            <span className={`pp-savebar__dot ${dirty ? "pp-savebar__dot--dirty" : "pp-savebar__dot--clean"}`} />
            {dirty ? "Unsaved changes" : saving ? "Saving…" : "All changes saved"}
          </span>
          <Link href="/admin" className="admin-btn">
            Cancel
          </Link>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            <Save size={16} />
            {saving ? "Saving…" : "Save All Content"}
          </button>
        </div>
      </div>

      <Dialog
        open={concentrationModal !== null}
        onOpenChange={(open) => !open && closeConcentrationModal()}
      >
        <DialogContent
          showCloseButton={false}
          className="news-modal w-[min(100%,520px)] sm:max-w-[520px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
        >
          <div className="modal__head">
            <DialogTitle className="m-0 text-[1.05rem] font-normal">
              {concentrationModal?.mode === "edit"
                ? "Edit Concentration"
                : "Add Concentration"}
            </DialogTitle>
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Close"
              onClick={closeConcentrationModal}
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal__body">
            <div className="form-grid">
              <div className="field field--full">
                <label htmlFor="concentration-title">
                  Title <span className="req">*</span>
                </label>
                <input
                  id="concentration-title"
                  type="text"
                  value={concentrationDraft.title}
                  onChange={(e) =>
                    setConcentrationDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  placeholder="Software Development"
                />
              </div>
              <div className="field field--full">
                <label htmlFor="concentration-description">Description</label>
                <RichTextEditor
                  content={concentrationDraft.description}
                  onChange={(html) =>
                    setConcentrationDraft((d) => ({ ...d, description: html }))
                  }
                  placeholder="Learn modern programming languages and frameworks..."
                />
              </div>
            </div>
          </div>

          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={closeConcentrationModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={saveConcentration}
              disabled={!concentrationDraft.title.trim()}
            >
              {concentrationModal?.mode === "edit" ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={admissionModal !== null}
        onOpenChange={(open) => !open && closeAdmissionModal()}
      >
        <DialogContent
          showCloseButton={false}
          className="news-modal w-[min(100%,520px)] sm:max-w-[520px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
        >
          <div className="modal__head">
            <DialogTitle className="m-0 text-[1.05rem] font-normal">
              {admissionModal?.mode === "edit"
                ? "Edit Requirement"
                : "Add Requirement"}
            </DialogTitle>
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Close"
              onClick={closeAdmissionModal}
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal__body">
            <div className="form-grid">
              <div className="field field--full">
                <label htmlFor="admission-title">
                  Title <span className="req">*</span>
                </label>
                <input
                  id="admission-title"
                  type="text"
                  value={admissionDraft.title}
                  onChange={(e) =>
                    setAdmissionDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  placeholder="Minimum 12 years of formal schooling"
                />
              </div>
              <div className="field field--full">
                <label htmlFor="admission-detail">Detail</label>
                <RichTextEditor
                  content={admissionDraft.detail}
                  onChange={(html) =>
                    setAdmissionDraft((d) => ({ ...d, detail: html }))
                  }
                  placeholder="10+2, A-Level, or equivalent..."
                />
              </div>
            </div>
          </div>

          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={closeAdmissionModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={saveAdmission}
              disabled={!admissionDraft.title.trim()}
            >
              {admissionModal?.mode === "edit" ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={semesterModal !== null}
        onOpenChange={(open) => !open && closeSemesterModal()}
      >
        <DialogContent
          showCloseButton={false}
          className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
        >
          <div className="modal__head">
            <DialogTitle className="m-0 text-[1.05rem] font-normal">
              {semesterModal?.mode === "edit"
                ? "Edit Semester"
                : "Add Semester"}
            </DialogTitle>
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Close"
              onClick={closeSemesterModal}
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal__body">
            <div className="form-grid">
              <div className="field field--full">
                <label htmlFor="semester-label">
                  Semester Label <span className="req">*</span>
                </label>
                <input
                  id="semester-label"
                  type="text"
                  value={semesterDraft.label}
                  onChange={(e) =>
                    setSemesterDraft((d) => ({ ...d, label: e.target.value }))
                  }
                  placeholder="Sem I"
                />
              </div>
              <div className="field field--full">
                <label>Courses</label>
                {semesterDraft.courses.length === 0 ? (
                  <p className="text-sm text-[var(--admin-muted)]">
                    No courses yet. Click &quot;Add Course&quot; to add one.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {semesterDraft.courses.map((course, courseIdx) => (
                      <div
                        key={`draft-course-${courseIdx}`}
                        className="pp-course-grid"
                      >
                        <input
                          type="text"
                          value={course.code}
                          onChange={(e) =>
                            updateSemesterCourse(courseIdx, "code", e.target.value)
                          }
                          placeholder="CSC 101"
                        />
                        <input
                          type="text"
                          value={course.description}
                          onChange={(e) =>
                            updateSemesterCourse(courseIdx, "description", e.target.value)
                          }
                          placeholder="Introduction to Computer Science"
                        />
                        <input
                          type="text"
                          value={course.credits}
                          onChange={(e) =>
                            updateSemesterCourse(courseIdx, "credits", e.target.value)
                          }
                          placeholder="3"
                        />
                        <RemoveButton
                          onClick={() => removeSemesterCourse(courseIdx)}
                          label={`Remove course ${courseIdx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <AddButton onClick={addSemesterCourse}>
                  Add Course
                </AddButton>
              </div>
            </div>
          </div>

          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={closeSemesterModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={saveSemester}
              disabled={!semesterDraft.label.trim()}
            >
              {semesterModal?.mode === "edit" ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={coordinatorModal}
        onOpenChange={(open) => !open && closeCoordinatorModal()}
      >
        <DialogContent
          showCloseButton={false}
          className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
        >
          <div className="modal__head">
            <DialogTitle className="m-0 text-[1.05rem] font-normal">
              Edit Coordinator
            </DialogTitle>
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Close"
              onClick={closeCoordinatorModal}
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal__body">
            <div className="form-grid">
              <div className="field field--full">
                <label htmlFor="coordinator-name">Name</label>
                <input
                  id="coordinator-name"
                  type="text"
                  value={coordinatorDraft.name}
                  onChange={(e) =>
                    setCoordinatorDraft((d) => ({ ...d, name: e.target.value }))
                  }
                  placeholder="Dr. John Doe"
                />
              </div>
              <div className="field">
                <label htmlFor="coordinator-initials">Initials</label>
                <input
                  id="coordinator-initials"
                  type="text"
                  value={coordinatorDraft.initials}
                  onChange={(e) =>
                    setCoordinatorDraft((d) => ({ ...d, initials: e.target.value }))
                  }
                  placeholder="JD"
                />
              </div>
              <div className="field">
                <label htmlFor="coordinator-role">Role</label>
                <input
                  id="coordinator-role"
                  type="text"
                  value={coordinatorDraft.role}
                  onChange={(e) =>
                    setCoordinatorDraft((d) => ({ ...d, role: e.target.value }))
                  }
                  placeholder="BCA Coordinator"
                />
              </div>
              <div className="field field--full">
                <label>Coordinator Image</label>
                <div className="space-y-2">
                  <ImageUpload
                    onUpload={(result) =>
                      setCoordinatorDraft((d) => ({
                        ...d,
                        image: result.secure_url,
                      }))
                    }
                  />
                  {coordinatorDraft.image && (
                    <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                      <img
                        src={coordinatorDraft.image}
                        alt="Coordinator preview"
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">
                          {coordinatorDraft.image}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setCoordinatorDraft((d) => ({ ...d, image: "" }))
                        }
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="field field--full">
                <label htmlFor="coordinator-quote">Quote</label>
                <RichTextEditor
                  content={coordinatorDraft.quote}
                  onChange={(html) =>
                    setCoordinatorDraft((d) => ({ ...d, quote: html }))
                  }
                  placeholder="Technology is evolving fast..."
                />
              </div>
            </div>
          </div>

          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={closeCoordinatorModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={saveCoordinator}
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={growthModal !== null}
        onOpenChange={(open) => !open && closeGrowthModal()}
      >
        <DialogContent
          showCloseButton={false}
          className="news-modal w-[min(100%,520px)] sm:max-w-[520px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
        >
          <div className="modal__head">
            <DialogTitle className="m-0 text-[1.05rem] font-normal">
              {growthModal?.mode === "edit" ? "Edit Growth Item" : "Add Growth Item"}
            </DialogTitle>
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Close"
              onClick={closeGrowthModal}
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal__body">
            <div className="form-grid">
              <div className="field field--full">
                <label htmlFor="growth-title">
                  Title <span className="req">*</span>
                </label>
                <input
                  id="growth-title"
                  type="text"
                  value={growthDraft.title}
                  onChange={(e) =>
                    setGrowthDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  placeholder="Industry exposure"
                />
              </div>
              <div className="field field--full">
                <label htmlFor="growth-description">Description</label>
                <RichTextEditor
                  content={growthDraft.description}
                  onChange={(html) =>
                    setGrowthDraft((d) => ({ ...d, description: html }))
                  }
                  placeholder="Guest lectures and workshops..."
                />
              </div>
            </div>
          </div>

          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={closeGrowthModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={saveGrowthItem}
              disabled={!growthDraft.title.trim()}
            >
              {growthModal?.mode === "edit" ? "Update" : "Add"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}