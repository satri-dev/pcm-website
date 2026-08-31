"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ExternalLink, AlertCircle, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { PageContent } from "@/types/page-content";
import type { Program } from "@/types/programs";

interface ProgramsPageEditorProps {
  initialContent: PageContent | null;
  availablePrograms: Program[];
}

export default function ProgramsPageEditor({
  initialContent,
  availablePrograms,
}: ProgramsPageEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());

  // Initialize form state with defaults
  const content = initialContent?.content || {};
  const [formData, setFormData] = useState({
    hero: {
      title: (content.hero as any)?.title || "Academic Programs",
      subtitle: (content.hero as any)?.subtitle || "Choose from our quality Bachelor programs",
    },
    intro: {
      heading: (content.intro as any)?.heading || "Choose your path",
      body: (content.intro as any)?.body || "Every PCM program blends conceptual depth with real-world practice.",
    },
    comparisonTable: {
      heading: (content.comparisonTable as any)?.heading || "Compare the programs",
      columns: (content.comparisonTable as any)?.columns || ["Program", "Focus", "Duration", "Credits", "Ideal for"],
    },
    cta: {
      heading: (content.cta as any)?.heading || "Ready to choose your program?",
      body: (content.cta as any)?.body || "Apply online in minutes, or reach out and we'll guide you through every step.",
      phone: (content.cta as any)?.phone || "(061) 544761",
    },
    featuredProgramRefs: (content.featuredProgramRefs as string[]) || ["bcsit", "bba", "bba-finance"],
    programPages: (content.programPages as any) || {},
  });

  const toggleProgram = (slug: string) => {
    setExpandedPrograms((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const updateProgramPageField = (slug: string, path: string[], value: any) => {
    setFormData((prev) => {
      const programPages = { ...prev.programPages };
      if (!programPages[slug]) {
        programPages[slug] = {};
      }
      
      let current: any = programPages[slug];
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      
      return { ...prev, programPages };
    });
  };

  const addGrowthItem = (slug: string) => {
    const current = formData.programPages[slug]?.growthSection?.items || [];
    updateProgramPageField(slug, ["growthSection", "items"], [
      ...current,
      { title: "", description: "" },
    ]);
  };

  const removeGrowthItem = (slug: string, index: number) => {
    const current = formData.programPages[slug]?.growthSection?.items || [];
    updateProgramPageField(
      slug,
      ["growthSection", "items"],
      current.filter((_: any, i: number) => i !== index)
    );
  };

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
      alert("Programs page content updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
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

  const toggleFeaturedProgram = (slug: string) => {
    const isIncluded = formData.featuredProgramRefs.includes(slug);
    const newRefs = isIncluded
      ? formData.featuredProgramRefs.filter((s) => s !== slug)
      : [...formData.featuredProgramRefs, slug];
    
    setFormData({ ...formData, featuredProgramRefs: newRefs });
  };

  const featuredPrograms = availablePrograms.filter((p) =>
    formData.featuredProgramRefs.includes(p.slug)
  );

  return (
    <main className="p-6">
      <form onSubmit={handleSubmit}>
        {/* Info Banner */}
        <div className="admin-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="admin-panel__body">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold mb-1">About Program Data</h3>
                <p className="text-sm text-[var(--admin-muted)] mb-2">
                  Program-specific fields (name, seats, duration, status, etc.) are <strong>read-only here</strong>.
                  To edit program details, use the dedicated Programs management page.
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
          <div className="admin-panel admin-panel--danger" style={{ marginBottom: "1.5rem" }}>
            <div className="admin-panel__body">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Programs Listing Page</h2>

        {/* Hero Section - EDITABLE */}
        <div className="admin-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="admin-panel__head">
            <h2 className="admin-panel__title">Hero Section</h2>
            <span className="badge badge--green">Editable</span>
          </div>
          <div className="admin-panel__body">
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
        </div>

        {/* Intro Section - EDITABLE */}
        <div className="admin-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="admin-panel__head">
            <h2 className="admin-panel__title">Intro Section</h2>
            <span className="badge badge--green">Editable</span>
          </div>
          <div className="admin-panel__body">
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
        </div>

        {/* Featured Programs - EDITABLE (selection only) */}
        <div className="admin-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="admin-panel__head">
            <h2 className="admin-panel__title">Featured Programs</h2>
            <span className="badge badge--green">Editable</span>
          </div>
          <div className="admin-panel__body">
            <p className="text-sm text-[var(--admin-muted)] mb-4">
              Select which programs to feature on the page. Program details are managed in the Programs section.
            </p>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {availablePrograms.map((program) => {
                const isSelected = formData.featuredProgramRefs.includes(program.slug);
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
                      <h3 className="font-semibold text-base">{program.name}</h3>
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
                      href={`/admin/content/programs/${program.slug}`}
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
              <h4 className="text-sm font-semibold mb-2">Currently Featured ({featuredPrograms.length}):</h4>
              <div className="text-sm text-gray-700">
                {featuredPrograms.length > 0
                  ? featuredPrograms.map((p) => p.name).join(" • ")
                  : "No programs selected"}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table - EDITABLE (labels only) */}
        <div className="admin-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="admin-panel__head">
            <h2 className="admin-panel__title">Comparison Table</h2>
            <span className="badge badge--green">Editable</span>
          </div>
          <div className="admin-panel__body">
            <p className="text-sm text-[var(--admin-muted)] mb-4">
              Edit table heading and column labels. The table data comes from program records.
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
                  {formData.comparisonTable.columns.map((col: any, idx: number) => (
                    <input
                      key={idx}
                      type="text"
                      value={col}
                      onChange={(e) => handleColumnChange(idx, e.target.value)}
                      placeholder={`Column ${idx + 1}`}
                      className="w-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - EDITABLE */}
        <div className="admin-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="admin-panel__head">
            <h2 className="admin-panel__title">Call-to-Action Section</h2>
            <span className="badge badge--green">Editable</span>
          </div>
          <div className="admin-panel__body">
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
        </div>

        <h2 className="text-xl font-bold mb-4 mt-8">Individual Program Pages</h2>

        {/* Per-Program Collapsible Sections */}
        {availablePrograms.map((program) => {
          const isExpanded = expandedPrograms.has(program.slug);
          const programPage = formData.programPages[program.slug] || {};
          
          return (
            <div key={program.slug} className="admin-panel" style={{ marginBottom: "1rem" }}>
              <div 
                className="admin-panel__head cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleProgram(program.slug)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  <h3 className="admin-panel__title">{program.name} ({program.code})</h3>
                </div>
                <span className="badge badge--blue">/programs/{program.slug}</span>
              </div>
              
              {isExpanded && (
                <div className="admin-panel__body">
                  {/* Hero Tagline */}
                  <div className="field field--full mb-4">
                    <label>Hero Tagline</label>
                    <input
                      type="text"
                      value={programPage.hero?.tagline || ""}
                      onChange={(e) => updateProgramPageField(program.slug, ["hero", "tagline"], e.target.value)}
                      placeholder="e.g., Design your career in business leadership"
                    />
                  </div>

                  {/* Overview Section */}
                  <h4 className="font-semibold mb-2">Overview Section</h4>
                  <div className="field field--full mb-2">
                    <label>Overview Title</label>
                    <input
                      type="text"
                      value={programPage.overview?.title || ""}
                      onChange={(e) => updateProgramPageField(program.slug, ["overview", "title"], e.target.value)}
                      placeholder="Program Overview"
                    />
                  </div>
                  <div className="field field--full mb-4">
                    <label>Overview Body (one paragraph per line)</label>
                    <textarea
                      rows={4}
                      value={(programPage.overview?.body || []).join("\n")}
                      onChange={(e) => updateProgramPageField(program.slug, ["overview", "body"], e.target.value.split("\n"))}
                      placeholder="Enter each paragraph on a new line..."
                    />
                  </div>

                  {/* Growth Section */}
                  <h4 className="font-semibold mb-2">Growth Section (e.g., "How BBA students grow at PCM")</h4>
                  <div className="field field--full mb-2">
                    <label>Growth Section Title</label>
                    <input
                      type="text"
                      value={programPage.growthSection?.title || ""}
                      onChange={(e) => updateProgramPageField(program.slug, ["growthSection", "title"], e.target.value)}
                      placeholder="How BBA students grow at PCM"
                    />
                  </div>

                  {(programPage.growthSection?.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="border rounded p-3 mb-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-semibold">Growth Item {idx + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeGrowthItem(program.slug, idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="field field--full mb-2">
                        <label>Title</label>
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) => {
                            const items = [...(programPage.growthSection?.items || [])];
                            items[idx] = { ...items[idx], title: e.target.value };
                            updateProgramPageField(program.slug, ["growthSection", "items"], items);
                          }}
                          placeholder="Industry exposure"
                        />
                      </div>
                      <div className="field field--full">
                        <label>Description</label>
                        <textarea
                          rows={2}
                          value={item.description || ""}
                          onChange={(e) => {
                            const items = [...(programPage.growthSection?.items || [])];
                            items[idx] = { ...items[idx], description: e.target.value };
                            updateProgramPageField(program.slug, ["growthSection", "items"], items);
                          }}
                          placeholder="Guest lectures and workshops..."
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addGrowthItem(program.slug)}
                    className="admin-btn admin-btn--sm mb-4"
                  >
                    <Plus size={16} />
                    Add Growth Item
                  </button>

                  {/* Callout */}
                  <h4 className="font-semibold mb-2">Callout Box</h4>
                  <div className="field field--full mb-2">
                    <label>Callout Title</label>
                    <input
                      type="text"
                      value={programPage.callout?.title || ""}
                      onChange={(e) => updateProgramPageField(program.slug, ["callout", "title"], e.target.value)}
                      placeholder="Non-credit courses"
                    />
                  </div>
                  <div className="field field--full mb-4">
                    <label>Callout Body</label>
                    <textarea
                      rows={3}
                      value={programPage.callout?.body || ""}
                      onChange={(e) => updateProgramPageField(program.slug, ["callout", "body"], e.target.value)}
                      placeholder="Every semester includes non-credit courses..."
                    />
                  </div>

                  {/* CTA */}
                  <h4 className="font-semibold mb-2">Page CTA</h4>
                  <div className="field field--full mb-2">
                    <label>CTA Title</label>
                    <input
                      type="text"
                      value={programPage.cta?.title || ""}
                      onChange={(e) => updateProgramPageField(program.slug, ["cta", "title"], e.target.value)}
                      placeholder="Ready to apply for BBA?"
                    />
                  </div>
                  <div className="field field--full">
                    <label>CTA Body</label>
                    <textarea
                      rows={2}
                      value={programPage.cta?.body || ""}
                      onChange={(e) => updateProgramPageField(program.slug, ["cta", "body"], e.target.value)}
                      placeholder="Apply online in minutes..."
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 mt-6">
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
      </form>
    </main>
  );
}
