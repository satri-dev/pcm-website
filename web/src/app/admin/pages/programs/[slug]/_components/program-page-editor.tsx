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
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { Program } from "@/types/programs";
import ImageUpload from "@/components/cloudinary/ImageUpload";

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
  overview: { title: string; body: string[] };
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
      return f.overview.title.trim().length > 0 || f.overview.body.length > 0;
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

function RepeatableCard({
  badge,
  index,
  onRemove,
  children,
}: {
  badge: string;
  index: number;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="pp-card">
      <div className="pp-card__head">
        <div className="pp-card__title">
          <span className="pp-card__title-badge">{badge}</span>
          {index}
        </div>
        <RemoveButton onClick={onRemove} label={`Remove ${badge.toLowerCase()} ${index}`} />
      </div>
      <div className="space-y-3">{children}</div>
    </div>
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
}: {
  number: number;
  id: string;
  title: string;
  desc: string;
  isExpanded: boolean;
  isFilled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
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
      {isExpanded && <div className="pp-section__body">{children}</div>}
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

function defaults(initialContent: Partial<ProgramPageContent>): ProgramPageContent {
  return {
    hero: { tagline: initialContent?.hero?.tagline ?? "" },
    overview: {
      title: initialContent?.overview?.title ?? "",
      body: initialContent?.overview?.body ?? [],
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

  const filledSections = SECTIONS.map((s) => isSectionFilled(s.id, formData));

  return (
    <form onSubmit={handleSubmit} className="pp-editor">
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
                label="Body Paragraphs (one per line)"
                htmlFor="overview-body"
                className="field--full"
              >
                <textarea
                  id="overview-body"
                  rows={6}
                  value={formData.overview.body.join("\n")}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      overview: {
                        ...f.overview,
                        body: e.target.value.split("\n").filter((p) => p.trim()),
                      },
                    }))
                  }
                  placeholder="Enter each paragraph on a new line..."
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
          >
            <div className="space-y-3">
              {formData.concentrations.map((conc, idx) => (
                <RepeatableCard
                  key={`concentration-${idx}`}
                  badge="Concentration"
                  index={idx + 1}
                  onRemove={() =>
                    update((f) => ({
                      ...f,
                      concentrations: f.concentrations.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  <Field label="Title" className="field--full">
                    <input
                      type="text"
                      value={conc.title}
                      onChange={(e) =>
                        update((f) => ({
                          ...f,
                          concentrations: f.concentrations.map((item, i) =>
                            i === idx ? { ...item, title: e.target.value } : item
                          ),
                        }))
                      }
                      placeholder="Software Development"
                    />
                  </Field>
                  <Field label="Description" className="field--full">
                    <textarea
                      rows={2}
                      value={conc.description}
                      onChange={(e) =>
                        update((f) => ({
                          ...f,
                          concentrations: f.concentrations.map((item, i) =>
                            i === idx ? { ...item, description: e.target.value } : item
                          ),
                        }))
                      }
                      placeholder="Learn modern programming languages and frameworks..."
                    />
                  </Field>
                </RepeatableCard>
              ))}
              <AddButton
                onClick={() =>
                  update((f) => ({
                    ...f,
                    concentrations: [...f.concentrations, { title: "", description: "" }],
                  }))
                }
              >
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
          >
            <div className="space-y-3">
              {formData.admissionRequirements.map((req, idx) => (
                <RepeatableCard
                  key={`admission-${idx}`}
                  badge="Requirement"
                  index={idx + 1}
                  onRemove={() =>
                    update((f) => ({
                      ...f,
                      admissionRequirements: f.admissionRequirements.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  <Field label="Title" className="field--full">
                    <input
                      type="text"
                      value={req.title}
                      onChange={(e) =>
                        update((f) => ({
                          ...f,
                          admissionRequirements: f.admissionRequirements.map((item, i) =>
                            i === idx ? { ...item, title: e.target.value } : item
                          ),
                        }))
                      }
                      placeholder="Minimum 12 years of formal schooling"
                    />
                  </Field>
                  <Field label="Detail" className="field--full">
                    <textarea
                      rows={2}
                      value={req.detail}
                      onChange={(e) =>
                        update((f) => ({
                          ...f,
                          admissionRequirements: f.admissionRequirements.map((item, i) =>
                            i === idx ? { ...item, detail: e.target.value } : item
                          ),
                        }))
                      }
                      placeholder="10+2, A-Level, or equivalent..."
                    />
                  </Field>
                </RepeatableCard>
              ))}
              <AddButton
                onClick={() =>
                  update((f) => ({
                    ...f,
                    admissionRequirements: [
                      ...f.admissionRequirements,
                      { title: "", detail: "" },
                    ],
                  }))
                }
              >
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
                <textarea
                  rows={2}
                  value={formData.curriculumSection.description}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      curriculumSection: {
                        ...f.curriculumSection,
                        description: e.target.value,
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
              {formData.curriculum.map((sem, semIdx) => (
                <div key={`semester-${semIdx}`} className="pp-semester">
                  <div className="pp-semester__head">
                    <input
                      type="text"
                      value={sem.label}
                      onChange={(e) =>
                        update((f) => ({
                          ...f,
                          curriculum: f.curriculum.map((s, i) =>
                            i === semIdx ? { ...s, label: e.target.value } : s
                          ),
                        }))
                      }
                      placeholder={`Sem ${semIdx + 1}`}
                      className="pp-semester__label"
                    />
                    <RemoveButton
                      onClick={() =>
                        update((f) => ({
                          ...f,
                          curriculum: f.curriculum.filter((_, i) => i !== semIdx),
                        }))
                      }
                      label={`Remove ${sem.label || `Sem ${semIdx + 1}`}`}
                    />
                  </div>

                  <div className="pp-course-head" aria-hidden="true">
                    <span>Code</span>
                    <span>Course</span>
                    <span>Credits</span>
                    <span />
                  </div>

                  <div className="space-y-2">
                    {sem.courses.map((course, courseIdx) => (
                      <div key={`course-${semIdx}-${courseIdx}`} className="pp-course-grid">
                        <input
                          type="text"
                          value={course.code}
                          onChange={(e) =>
                            update((f) => ({
                              ...f,
                              curriculum: f.curriculum.map((s, si) =>
                                si === semIdx
                                  ? {
                                      ...s,
                                      courses: s.courses.map((c, ci) =>
                                        ci === courseIdx ? { ...c, code: e.target.value } : c
                                      ),
                                    }
                                  : s
                              ),
                            }))
                          }
                          placeholder="CSC 101"
                        />
                        <input
                          type="text"
                          value={course.description}
                          onChange={(e) =>
                            update((f) => ({
                              ...f,
                              curriculum: f.curriculum.map((s, si) =>
                                si === semIdx
                                  ? {
                                      ...s,
                                      courses: s.courses.map((c, ci) =>
                                        ci === courseIdx
                                          ? { ...c, description: e.target.value }
                                          : c
                                      ),
                                    }
                                  : s
                              ),
                            }))
                          }
                          placeholder="Introduction to Computer Science"
                        />
                        <input
                          type="text"
                          value={course.credits}
                          onChange={(e) =>
                            update((f) => ({
                              ...f,
                              curriculum: f.curriculum.map((s, si) =>
                                si === semIdx
                                  ? {
                                      ...s,
                                      courses: s.courses.map((c, ci) =>
                                        ci === courseIdx ? { ...c, credits: e.target.value } : c
                                      ),
                                    }
                                  : s
                              ),
                            }))
                          }
                          placeholder="3"
                        />
                        <RemoveButton
                          onClick={() =>
                            update((f) => ({
                              ...f,
                              curriculum: f.curriculum.map((s, si) =>
                                si === semIdx
                                  ? {
                                      ...s,
                                      courses: s.courses.filter((_, ci) => ci !== courseIdx),
                                    }
                                  : s
                              ),
                            }))
                          }
                          label={`Remove course ${courseIdx + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  <AddButton
                    onClick={() =>
                      update((f) => ({
                        ...f,
                        curriculum: f.curriculum.map((s, si) =>
                          si === semIdx
                            ? {
                                ...s,
                                courses: [...s.courses, { code: "", description: "", credits: "" }],
                              }
                            : s
                        ),
                      }))
                    }
                  >
                    Add Course
                  </AddButton>
                </div>
              ))}
            </div>

            <AddButton
              onClick={() =>
                update((f) => ({
                  ...f,
                  curriculum: [
                    ...f.curriculum,
                    { label: `Sem ${f.curriculum.length + 1}`, courses: [] },
                  ],
                }))
              }
            >
              Add Semester
            </AddButton>
          </CollapsibleSection>

          <CollapsibleSection
            number={8}
            id="coordinator"
            title={SECTIONS[7].title}
            desc={SECTIONS[7].desc}
            isExpanded={expandedSections.has("coordinator")}
            isFilled={filledSections[7]}
            onToggle={() => toggleSection("coordinator")}
          >
            <div className="form-grid">
              <Field label="Name" className="field--full">
                <input
                  type="text"
                  value={formData.coordinator.name}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      coordinator: { ...f.coordinator, name: e.target.value },
                    }))
                  }
                  placeholder="Dr. John Doe"
                />
              </Field>
              <Field label="Initials">
                <input
                  type="text"
                  value={formData.coordinator.initials}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      coordinator: { ...f.coordinator, initials: e.target.value },
                    }))
                  }
                  placeholder="JD"
                />
              </Field>
              <Field label="Role">
                <input
                  type="text"
                  value={formData.coordinator.role}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      coordinator: { ...f.coordinator, role: e.target.value },
                    }))
                  }
                  placeholder="BCA Coordinator"
                />
              </Field>
              <Field
                label="Coordinator Image"
                hint="Upload coordinator photo via Cloudinary"
                className="field--full"
              >
                <div className="space-y-2">
                  <ImageUpload
                    onUpload={(result) =>
                      update((f) => ({
                        ...f,
                        coordinator: { ...f.coordinator, image: result.secure_url },
                      }))
                    }
                  />
                  {formData.coordinator.image && (
                    <div className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                      <img
                        src={formData.coordinator.image}
                        alt="Coordinator preview"
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">
                          {formData.coordinator.image}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          update((f) => ({
                            ...f,
                            coordinator: { ...f.coordinator, image: "" },
                          }))
                        }
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </Field>
              <Field label="Quote" className="field--full">
                <textarea
                  rows={4}
                  value={formData.coordinator.quote}
                  onChange={(e) =>
                    update((f) => ({
                      ...f,
                      coordinator: { ...f.coordinator, quote: e.target.value },
                    }))
                  }
                  placeholder="Technology is evolving fast..."
                />
              </Field>
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

              {formData.growthSection.items.map((item, idx) => (
                <RepeatableCard
                  key={`growth-${idx}`}
                  badge="Item"
                  index={idx + 1}
                  onRemove={() =>
                    update((f) => ({
                      ...f,
                      growthSection: {
                        ...f.growthSection,
                        items: f.growthSection.items.filter((_, i) => i !== idx),
                      },
                    }))
                  }
                >
                  <Field label="Title" className="field--full">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        update((f) => ({
                          ...f,
                          growthSection: {
                            ...f.growthSection,
                            items: f.growthSection.items.map((itm, i) =>
                              i === idx ? { ...itm, title: e.target.value } : itm
                            ),
                          },
                        }))
                      }
                      placeholder="Industry exposure"
                    />
                  </Field>
                  <Field label="Description" className="field--full">
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) =>
                        update((f) => ({
                          ...f,
                          growthSection: {
                            ...f.growthSection,
                            items: f.growthSection.items.map((itm, i) =>
                              i === idx ? { ...itm, description: e.target.value } : itm
                            ),
                          },
                        }))
                      }
                      placeholder="Guest lectures and workshops..."
                    />
                  </Field>
                </RepeatableCard>
              ))}

              <AddButton
                onClick={() =>
                  update((f) => ({
                    ...f,
                    growthSection: {
                      ...f.growthSection,
                      items: [...f.growthSection.items, { title: "", description: "" }],
                    },
                  }))
                }
              >
                Add Growth Item
              </AddButton>
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

      <div className="pp-savebar">
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
    </form>
  );
}