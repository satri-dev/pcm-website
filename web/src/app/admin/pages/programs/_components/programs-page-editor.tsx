"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import type { PageContent, ProgramsPageContent } from "@/types/page-content";
import type { Program } from "@/types/programs";

interface ProgramsPageEditorProps {
  initialContent: PageContent | null;
  availablePrograms: Program[];
  coordinatorsFromPrograms: Array<{
    programSlug: string;
    programName: string;
    programCode: string;
    coordinator: {
      name: string;
      initials: string;
      image: string;
      role: string;
      quote: string;
    } | null;
  }>;
}

const SECTIONS = [
  { id: "hero", title: "Hero Section", desc: "Hero title and subtitle" },
  { id: "intro", title: "Intro Section", desc: "Section heading and body" },
  {
    id: "featured",
    title: "Featured Programs",
    desc: "Select which programs to feature",
  },
  {
    id: "comparison",
    title: "Comparison Table",
    desc: "Heading, column headers and program data",
  },
  {
    id: "coordinators",
    title: "Coordinators Section",
    desc: "Section visibility, eyebrow, heading and description",
  },
  { id: "cta", title: "Call-to-Action", desc: "CTA heading, body and phone" },
];
const ALL_SECTION_IDS = SECTIONS.map((s) => s.id);

export default function ProgramsPageEditor({
  initialContent,
  availablePrograms,
  coordinatorsFromPrograms,
}: ProgramsPageEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  ); // Start with all collapsed

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

  // Initialize form state with defaults
  const content = (initialContent?.content ||
    {}) as Partial<ProgramsPageContent>;
  const [formData, setFormData] = useState<ProgramsPageContent>({
    hero: {
      title: content.hero?.title || "Academic Programs",
      subtitle:
        content.hero?.subtitle || "Choose from our quality Bachelor programs",
    },
    intro: {
      heading: content.intro?.heading || "Choose your path",
      body:
        content.intro?.body ||
        "Every PCM program blends conceptual depth with real-world practice.",
    },
    comparisonTable: {
      heading: content.comparisonTable?.heading || "Compare the programs",
      columns: content.comparisonTable?.columns || [
        "Program",
        "Focus",
        "Duration",
        "Credits",
        "Ideal for",
      ],
      rows: content.comparisonTable?.rows || {},
    },
    coordinators: {
      visible: content.coordinators?.visible !== false, // Default to true
      eyebrow: content.coordinators?.eyebrow || "Your guides at PCM",
      heading:
        content.coordinators?.heading || "Meet your program coordinators",
      description:
        content.coordinators?.description ||
        "Each program has a dedicated coordinator who will guide you from your first semester to your final project.",
      visiblePrograms:
        content.coordinators?.visiblePrograms ||
        availablePrograms.map((p) => p.slug), // All programs visible by default
    },
    cta: {
      heading: content.cta?.heading || "Ready to choose your program?",
      body:
        content.cta?.body ||
        "Apply online in minutes, or reach out and we'll guide you through every step.",
      phone: content.cta?.phone || "(061) 544761",
    },
    featuredProgramRefs: content.featuredProgramRefs || [
      "bcsit",
      "bba",
      "bba-finance",
    ],
    programPages: content.programPages || {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/pages/programs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Save failed (HTTP ${res.status})`);
      }

      router.refresh();
      toast.success("Programs page updated successfully!");

      // Log for debugging
      console.log("Saved coordinators config:", formData.coordinators);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save changes";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleColumnChange = (index: number, value: string) => {
    const newColumns = [...formData.comparisonTable.columns];
    newColumns[index] = value;
    setFormData({
      ...formData,
      comparisonTable: {
        ...formData.comparisonTable,
        columns: newColumns,
      },
    });
  };

  const handleCompareRowChange = (
    slug: string,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => {
      const rows = { ...(prev.comparisonTable.rows || {}) };
      rows[slug] = { ...(rows[slug] || {}), [field]: value };
      return {
        ...prev,
        comparisonTable: { ...prev.comparisonTable, rows },
      };
    });
  };

  const focusMap: Record<string, { focus: string; idealFor: string }> = {
    bba: {
      focus: "General management & leadership",
      idealFor: "Future managers & entrepreneurs",
    },
    "bba-finance": {
      focus: "Finance, investment & banking",
      idealFor: "Analysts & finance professionals",
    },
    bcsit: {
      focus: "IT + business management",
      idealFor: "Developers, data & IT specialists",
    },
  };

  const stripHtml = (html?: string) =>
    (html || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  // Resolve the effective value shown for a compare cell (override first, then derived)
  const compareCell = (
    p: Program,
    field: "focus" | "duration" | "credits" | "idealFor",
  ) => {
    const override = formData.comparisonTable.rows?.[p.slug]?.[field];
    if (override && override.trim() !== "") return override;
    const mapped = focusMap[p.slug] || { focus: p.intro || "", idealFor: "" };
    switch (field) {
      case "focus":
        return stripHtml(mapped.focus);
      case "duration":
        return p.duration;
      case "credits":
        return String(p.creditHours);
      case "idealFor":
        return mapped.idealFor;
      default:
        return "";
    }
  };

  const toggleFeaturedProgram = (slug: string) => {
    const isIncluded = formData.featuredProgramRefs.includes(slug);
    const newRefs = isIncluded
      ? formData.featuredProgramRefs.filter((s) => s !== slug)
      : [...formData.featuredProgramRefs, slug];

    setFormData({ ...formData, featuredProgramRefs: newRefs });
  };

  const featuredPrograms = availablePrograms.filter((p) =>
    formData.featuredProgramRefs.includes(p.slug),
  );

  return (
    <main className="p-6">
      <form onSubmit={handleSubmit} style={{ paddingBottom: "80px" }}>
        {/* Info Banner */}
        <div className="admin-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="admin-panel__body">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-blue-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <h3 className="text-base font-semibold mb-1">
                  About Program Data
                </h3>
                <p className="text-sm text-[var(--admin-muted)] mb-2">
                  Program-specific fields (name, seats, duration, status, etc.)
                  are <strong>read-only here</strong>. To edit program details,
                  use the dedicated Programs management page.
                </p>
                <Link
                  href="/admin/content/programs"
                  className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  <ExternalLink size={14} />
                  Edit Programs
                </Link>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div
            className="admin-panel admin-panel--danger"
            style={{ marginBottom: "1.5rem" }}
          >
            <div className="admin-panel__body">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Programs Listing Page</h2>

        <div className="pp-toolbar" style={{ marginBottom: "1rem" }}>
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

        {/* Hero Section - EDITABLE */}
        <section
          className={`pp-section ${expandedSections.has("hero") ? "is-expanded" : ""}`}
        >
          <button
            type="button"
            className="pp-section__toggle"
            aria-expanded={expandedSections.has("hero")}
            onClick={() => toggleSection("hero")}
          >
            <span className="pp-section__num">1</span>
            <span className="pp-section__text">
              <span className="pp-section__title">Hero Section</span>
              <span className="pp-section__desc">Hero title and subtitle</span>
            </span>
            <span className="badge badge--green">Editable</span>
            <span className="pp-section__chevron">
              <ChevronDown size={18} />
            </span>
          </button>
          {expandedSections.has("hero") && (
            <div className="pp-section__body">
              <div className="form-grid">
                <div className="field field--full">
                  <label htmlFor="hero-title">Hero Title</label>
                  <input
                    id="hero-title"
                    type="text"
                    value={formData.hero.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, title: e.target.value },
                      })
                    }
                    placeholder="Academic Programs"
                  />
                </div>
                <div className="field field--full">
                  <label htmlFor="hero-subtitle">Hero Subtitle</label>
                  <textarea
                    id="hero-subtitle"
                    rows={2}
                    value={formData.hero.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, subtitle: e.target.value },
                      })
                    }
                    placeholder="Three Pokhara University bachelor's degrees..."
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Intro Section - EDITABLE */}
        <section
          className={`pp-section ${expandedSections.has("intro") ? "is-expanded" : ""}`}
        >
          <button
            type="button"
            className="pp-section__toggle"
            aria-expanded={expandedSections.has("intro")}
            onClick={() => toggleSection("intro")}
          >
            <span className="pp-section__num">2</span>
            <span className="pp-section__text">
              <span className="pp-section__title">Intro Section</span>
              <span className="pp-section__desc">Section heading and body</span>
            </span>
            <span className="badge badge--green">Editable</span>
            <span className="pp-section__chevron">
              <ChevronDown size={18} />
            </span>
          </button>
          {expandedSections.has("intro") && (
            <div className="pp-section__body">
              <div className="form-grid">
                <div className="field field--full">
                  <label htmlFor="intro-heading">Section Heading</label>
                  <input
                    id="intro-heading"
                    type="text"
                    value={formData.intro.heading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        intro: { ...formData.intro, heading: e.target.value },
                      })
                    }
                    placeholder="Choose your path"
                  />
                </div>
                <div className="field field--full">
                  <label htmlFor="intro-body">Section Body</label>
                  <textarea
                    id="intro-body"
                    rows={3}
                    value={formData.intro.body}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        intro: { ...formData.intro, body: e.target.value },
                      })
                    }
                    placeholder="Every PCM program blends conceptual depth..."
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Featured Programs - EDITABLE (selection only) */}
        <section
          className={`pp-section ${expandedSections.has("featured") ? "is-expanded" : ""}`}
        >
          <button
            type="button"
            className="pp-section__toggle"
            aria-expanded={expandedSections.has("featured")}
            onClick={() => toggleSection("featured")}
          >
            <span className="pp-section__num">3</span>
            <span className="pp-section__text">
              <span className="pp-section__title">Featured Programs</span>
              <span className="pp-section__desc">
                Select which programs to feature
              </span>
            </span>
            <span className="badge badge--green">Editable</span>
            <span className="pp-section__chevron">
              <ChevronDown size={18} />
            </span>
          </button>
          {expandedSections.has("featured") && (
            <div className="pp-section__body">
              <p className="text-sm text-[var(--admin-muted)] mb-4">
                Select which programs to feature on the page. Program details
                are managed in the Programs section.
              </p>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1rem",
                }}
              >
                {availablePrograms.map((program) => {
                  const isSelected = formData.featuredProgramRefs.includes(
                    program.slug,
                  );
                  return (
                    <div
                      key={program.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleFeaturedProgram(program.slug)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-base">
                          {program.name}
                        </h3>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFeaturedProgram(program.slug)}
                          className="mt-1"
                        />
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Code: {program.code}</div>
                        <div>Duration: {program.duration}</div>
                        <div>Seats: {program.seats}</div>
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs ${
                              program.status === "open"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {program.status}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/admin/content/programs`}
                        className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                        Edit Program
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="text-sm font-semibold mb-2">
                  Currently Featured ({featuredPrograms.length}):
                </h4>
                <div className="text-sm text-gray-700">
                  {featuredPrograms.length > 0
                    ? featuredPrograms.map((p) => p.name).join(" • ")
                    : "No programs selected"}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Comparison Table - EDITABLE */}
        <section
          className={`pp-section ${expandedSections.has("comparison") ? "is-expanded" : ""}`}
        >
          <button
            type="button"
            className="pp-section__toggle"
            aria-expanded={expandedSections.has("comparison")}
            onClick={() => toggleSection("comparison")}
          >
            <span className="pp-section__num">4</span>
            <span className="pp-section__text">
              <span className="pp-section__title">Comparison Table</span>
              <span className="pp-section__desc">
                Heading, column headers and program data
              </span>
            </span>
            <span className="badge badge--green">Editable</span>
            <span className="pp-section__chevron">
              <ChevronDown size={18} />
            </span>
          </button>
          {expandedSections.has("comparison") && (
            <div className="pp-section__body">
              <p className="text-sm text-[var(--admin-muted)] mb-4">
                Edit table heading, column labels, and the comparison data for
                each program. A blank data field falls back to the value from
                the program record.
              </p>
              <div className="form-grid">
                <div className="field field--full">
                  <label htmlFor="table-heading">Table Heading</label>
                  <input
                    id="table-heading"
                    type="text"
                    value={formData.comparisonTable.heading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        comparisonTable: {
                          ...formData.comparisonTable,
                          heading: e.target.value,
                        },
                      })
                    }
                    placeholder="Compare the programs"
                  />
                </div>
                <div className="field field--full">
                  <label>Table Column Headers</label>
                  <div className="space-y-2">
                    {formData.comparisonTable.columns.map(
                      (col: string, idx: number) => (
                        <input
                          key={idx}
                          type="text"
                          value={col}
                          onChange={(e) =>
                            handleColumnChange(idx, e.target.value)
                          }
                          placeholder={`Column ${idx + 1}`}
                          className="w-full"
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-border">
                <h4 className="text-sm font-semibold mb-1">Program Data</h4>
                <p className="text-sm text-[var(--admin-muted)] mb-4">
                  Program is read-only (from the system). Focus, Duration,
                  Credits and Ideal for are editable — leave a cell blank to
                  keep the value from the program record.
                </p>
                {availablePrograms.length === 0 ? (
                  <p className="text-sm text-[var(--admin-muted)]">
                    No programs in the system yet.
                  </p>
                ) : (
                  <div className="table-wrap" style={{ overflowX: "auto" }}>
                    <table
                      className="admin-table"
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          {[
                            "Program",
                            "Focus",
                            "Duration",
                            "Credits",
                            "Ideal for",
                          ].map((label, idx) => (
                            <th key={label}>
                              {formData.comparisonTable.columns?.[idx] || label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {availablePrograms.map((p) => (
                          <tr key={p.slug}>
                            <td className="whitespace-nowrap font-medium">
                              {p.code}
                            </td>
                            {(
                              [
                                "focus",
                                "duration",
                                "credits",
                                "idealFor",
                              ] as const
                            ).map((field) => {
                              const isNumeric =
                                field === "duration" || field === "credits";
                              return (
                                <td
                                  key={field}
                                  style={{
                                    textAlign: isNumeric ? "center" : "left",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={
                                      formData.comparisonTable.rows?.[p.slug]?.[
                                        field
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleCompareRowChange(
                                        p.slug,
                                        field,
                                        e.target.value,
                                      )
                                    }
                                    placeholder={compareCell(p, field)}
                                    aria-label={`${p.name} ${field === "idealFor" ? "Ideal for" : field}`}
                                    style={{
                                      width: "100%",
                                      minWidth: isNumeric ? 70 : 130,
                                      textAlign: isNumeric ? "center" : "left",
                                      border:
                                        "1px solid var(--admin-border, #d4d4d8)",
                                      background: "var(--admin-surface, #fff)",
                                      borderRadius: 6,
                                      padding: "6px 8px",
                                    }}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* CTA Section - EDITABLE */}
        <section
          className={`pp-section ${expandedSections.has("coordinators") ? "is-expanded" : ""}`}
        >
          <button
            type="button"
            className="pp-section__toggle"
            aria-expanded={expandedSections.has("coordinators")}
            onClick={() => toggleSection("coordinators")}
          >
            <span className="pp-section__num">5</span>
            <span className="pp-section__text">
              <span className="pp-section__title">Coordinators Section</span>
              <span className="pp-section__desc">
                Section visibility, eyebrow, heading and description
              </span>
            </span>
            <span className="badge badge--green">Editable</span>
            <span className="pp-section__chevron">
              <ChevronDown size={18} />
            </span>
          </button>
          {expandedSections.has("coordinators") && (
            <div className="pp-section__body">
              <div className="form-grid">
                <div className="field field--full">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.coordinators?.visible ?? true}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinators: {
                            visible: e.target.checked,
                            eyebrow: formData.coordinators?.eyebrow ?? "",
                            heading: formData.coordinators?.heading ?? "",
                            description:
                              formData.coordinators?.description ?? "",
                            visiblePrograms:
                              formData.coordinators?.visiblePrograms ?? [],
                          },
                        })
                      }
                    />
                    <span className="font-semibold">
                      Show Coordinators Section on Programs Page
                    </span>
                  </label>
                  <span className="hint">
                    When unchecked, the coordinators section will be hidden from
                    the programs page
                  </span>
                </div>
                <div className="field field--full">
                  <label htmlFor="coord-eyebrow">Eyebrow Text</label>
                  <input
                    id="coord-eyebrow"
                    type="text"
                    value={formData.coordinators?.eyebrow ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coordinators: {
                          visible: formData.coordinators?.visible ?? true,
                          eyebrow: e.target.value,
                          heading: formData.coordinators?.heading ?? "",
                          description: formData.coordinators?.description ?? "",
                          visiblePrograms:
                            formData.coordinators?.visiblePrograms ?? [],
                        },
                      })
                    }
                    placeholder="Your guides at PCM"
                  />
                </div>
                <div className="field field--full">
                  <label htmlFor="coord-heading">Section Heading</label>
                  <input
                    id="coord-heading"
                    type="text"
                    value={formData.coordinators?.heading ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coordinators: {
                          visible: formData.coordinators?.visible ?? true,
                          eyebrow: formData.coordinators?.eyebrow ?? "",
                          heading: e.target.value,
                          description: formData.coordinators?.description ?? "",
                          visiblePrograms:
                            formData.coordinators?.visiblePrograms ?? [],
                        },
                      })
                    }
                    placeholder="Meet your program coordinators"
                  />
                </div>
                <div className="field field--full">
                  <label htmlFor="coord-description">Section Description</label>
                  <textarea
                    id="coord-description"
                    rows={3}
                    value={formData.coordinators?.description ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coordinators: {
                          visible: formData.coordinators?.visible ?? true,
                          eyebrow: formData.coordinators?.eyebrow ?? "",
                          heading: formData.coordinators?.heading ?? "",
                          description: e.target.value,
                          visiblePrograms:
                            formData.coordinators?.visiblePrograms ?? [],
                        },
                      })
                    }
                    placeholder="Each program has a dedicated coordinator..."
                  />
                  <span className="hint">
                    This text appears below the heading
                  </span>
                </div>
                <div
                  className="mt-4 space-y-3"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <h4 className="text-sm font-semibold">
                    Coordinator Visibility
                  </h4>
                  <p className="text-sm text-[var(--admin-muted)] mb-3">
                    Select which program coordinators to show on the programs
                    page. Coordinator details (photo, name, role, quote) are
                    managed in each program&apos;s page editor.
                  </p>
                  <div className="space-y-2">
                    {coordinatorsFromPrograms.map((item) => {
                      const isVisible =
                        formData.coordinators?.visiblePrograms?.includes(
                          item.programSlug,
                        ) ?? false;
                      const hasCoordinator =
                        item.coordinator &&
                        item.coordinator.name &&
                        item.coordinator.quote;

                      return (
                        <div
                          key={item.programSlug}
                          className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={(e) => {
                              const newVisible = e.target.checked
                                ? [
                                    ...(formData.coordinators
                                      ?.visiblePrograms ?? []),
                                    item.programSlug,
                                  ]
                                : (
                                    formData.coordinators?.visiblePrograms ?? []
                                  ).filter((s) => s !== item.programSlug);
                              setFormData({
                                ...formData,
                                coordinators: {
                                  visible:
                                    formData.coordinators?.visible ?? true,
                                  eyebrow: formData.coordinators?.eyebrow ?? "",
                                  heading: formData.coordinators?.heading ?? "",
                                  description:
                                    formData.coordinators?.description ?? "",
                                  visiblePrograms: newVisible,
                                },
                              });
                            }}
                            className="mt-1"
                            disabled={!hasCoordinator}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                {item.programName}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                                {item.programCode}
                              </span>
                            </div>
                            {hasCoordinator ? (
                              <div className="text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                  {item.coordinator!.image && (
                                    <img
                                      src={item.coordinator!.image}
                                      alt={item.coordinator!.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  )}
                                  <div>
                                    <div className="font-medium">
                                      {item.coordinator!.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {item.coordinator!.role}
                                    </div>
                                  </div>
                                </div>
                                {item.coordinator!.quote && (
                                  <p className="mt-2 text-xs text-gray-600 italic line-clamp-2">
                                    &quot;
                                    {item.coordinator!.quote.substring(0, 120)}
                                    {item.coordinator!.quote.length > 120
                                      ? "..."
                                      : ""}
                                    &quot;
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 italic">
                                No coordinator information yet.
                                <Link
                                  href={`/admin/pages/programs/${item.programSlug}`}
                                  className="text-blue-600 hover:text-blue-800 ml-1"
                                  target="_blank"
                                >
                                  Add coordinator →
                                </Link>
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/admin/pages/programs/${item.programSlug}`}
                            className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 whitespace-nowrap"
                            target="_blank"
                          >
                            <ExternalLink size={12} />
                            Edit
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CTA Section - EDITABLE */}
        <section
          className={`pp-section ${expandedSections.has("cta") ? "is-expanded" : ""}`}
        >
          <button
            type="button"
            className="pp-section__toggle"
            aria-expanded={expandedSections.has("cta")}
            onClick={() => toggleSection("cta")}
          >
            <span className="pp-section__num">6</span>
            <span className="pp-section__text">
              <span className="pp-section__title">Call-to-Action</span>
              <span className="pp-section__desc">
                CTA heading, body and phone
              </span>
            </span>
            <span className="badge badge--green">Editable</span>
            <span className="pp-section__chevron">
              <ChevronDown size={18} />
            </span>
          </button>
          {expandedSections.has("cta") && (
            <div className="pp-section__body">
              <div className="form-grid">
                <div className="field field--full">
                  <label htmlFor="cta-heading">CTA Heading</label>
                  <input
                    id="cta-heading"
                    type="text"
                    value={formData.cta.heading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, heading: e.target.value },
                      })
                    }
                    placeholder="Ready to choose your program?"
                  />
                </div>
                <div className="field field--full">
                  <label htmlFor="cta-body">CTA Body Text</label>
                  <textarea
                    id="cta-body"
                    rows={2}
                    value={formData.cta.body}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, body: e.target.value },
                      })
                    }
                    placeholder="Apply online in minutes..."
                  />
                </div>
                <div className="field">
                  <label htmlFor="cta-phone">Contact Phone</label>
                  <input
                    id="cta-phone"
                    type="text"
                    value={formData.cta.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cta: { ...formData.cta, phone: e.target.value },
                      })
                    }
                    placeholder="(061) 544761"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Save Button */}
        <div className="pp-savebar-fixed px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <Link href="/admin" className="admin-btn">
              Cancel
            </Link>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save All Content"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
