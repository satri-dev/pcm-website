"use client";

import { useEffect, useMemo, useState } from "react";
import { PageContent, PageContentSection } from "@/types/page-content";

interface PageContentManagerProps {
  slug: string;
  initialContent: PageContent | null;
}

const FIELD = "field";
const FIELD_FULL = "field field--full";

function inputClass() {
  return "w-full rounded-lg border border-[var(--admin-line)] bg-white px-3 py-2 text-sm";
}

function fieldLabel(children: React.ReactNode) {
  return (
    <label className="mb-1 block text-[0.72rem] font-bold uppercase tracking-wider text-[var(--admin-muted)]">
      {children}
    </label>
  );
}

export default function PageContentManager({ slug, initialContent }: PageContentManagerProps) {
  const [label, setLabel] = useState(initialContent?.label ?? slug);
  const [heroTitle, setHeroTitle] = useState(initialContent?.hero.title ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(initialContent?.hero.subtitle ?? "");
  const [sections, setSections] = useState<PageContentSection[]>(initialContent?.sections ?? []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialContent) return;
    let active = true;
    fetch(`/api/admin/pages/${slug}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("load failed"))))
      .then((data) => {
        const loaded: PageContent | null = data?.content ?? null;
        if (!active || !loaded) return;
        setLabel(loaded.label || slug);
        setHeroTitle(loaded.hero?.title ?? "");
        setHeroSubtitle(loaded.hero?.subtitle ?? "");
        setSections(loaded.sections ?? []);
      })
      .catch(() => {
        if (!active) return;
        setMessage("Could not load the current copy — the editor starts from a blank state.");
      });
    return () => {
      active = false;
    };
  }, [slug, initialContent]);

  const nextKey = useMemo(() => {
    const used = new Set(sections.map((s) => s.key));
    let n = sections.length + 1;
    while (used.has(`section-${n}`)) n += 1;
    return `section-${n}`;
  }, [sections]);

  const updateSection = (index: number, patch: Partial<PageContentSection>) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    setSections((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setMessage("");
  };

  const addSection = () => {
    setSections((prev) => [...prev, { key: nextKey }]);
    setMessage("");
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
    setMessage("");
  };

  const handleSave = async () => {
    const trimmed = sections.map((s) => ({ ...s, key: s.key.trim() }));
    const keys = trimmed.map((s) => s.key);
    if (new Set(keys).size !== keys.length) {
      setMessage("Duplicate section key — every section needs a unique key.");
      return;
    }
    if (keys.some((k) => !k)) {
      setMessage("Every section needs a key.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const payload = {
        label: label || slug,
        hero: { title: heroTitle, subtitle: heroSubtitle },
        sections: trimmed,
      };
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let errMessage = `Failed (HTTP ${res.status})`;
        try {
          const err = await res.json();
          if (err?.error) errMessage = err.error;
        } catch {
          // not JSON — show the raw status
        }
        throw new Error(errMessage);
      }
      setMessage("Saved. The public page will refresh from cache shortly.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h3>Page copy</h3>
        <span className="text-[0.8rem] text-[var(--admin-muted)]">
          Rendered with ISR — changes take effect after revalidation
        </span>
      </div>
      <div className="admin-panel__body p-5">
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          <div className={FIELD}>
            {fieldLabel("Page label")}
            <input className={inputClass()} value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className={FIELD_FULL}>
            {fieldLabel("Title")}
            <input className={inputClass()} value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          </div>
          <div className={FIELD_FULL}>
            {fieldLabel("Description")}
            <textarea
              className={inputClass()}
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center gap-3">
            <h4 className="m-0 text-[0.95rem] font-bold text-[var(--admin-ink)]">Sections</h4>
            <button type="button" className="admin-btn admin-btn--sm" onClick={addSection}>
              + Add section
            </button>
          </div>

          {sections.length === 0 ? (
            <p className="text-[0.9rem] text-[var(--admin-muted)]">
              No sections yet — add one to start editing copy blocks.
            </p>
          ) : (
            <div className="grid gap-4">
              {sections.map((section, i) => (
                <div key={section.key} className="rounded-xl border border-[var(--admin-line)] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <input
                      className="rounded-md border border-[var(--admin-line)] bg-[var(--admin-surface-2)] px-2 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[var(--admin-brand)]"
                      value={section.key}
                      onChange={(e) => updateSection(i, { key: e.target.value })}
                      aria-label="Section key"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="admin-icon-btn"
                        aria-label="Move section up"
                        onClick={() => moveSection(i, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn"
                        aria-label="Move section down"
                        onClick={() => moveSection(i, 1)}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn danger"
                        aria-label="Remove section"
                        onClick={() => removeSection(i)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                    <div className={FIELD}>
                      {fieldLabel("Eyebrow (span)")}
                      <input
                        className={inputClass()}
                        value={section.eyebrow ?? ""}
                        onChange={(e) => updateSection(i, { eyebrow: e.target.value })}
                      />
                    </div>
                    <div className={FIELD}>
                      {fieldLabel("Title (h2)")}
                      <input
                        className={inputClass()}
                        value={section.title ?? ""}
                        onChange={(e) => updateSection(i, { title: e.target.value })}
                      />
                    </div>
                    <div className={FIELD_FULL}>
                      {fieldLabel("Description (p)")}
                      <textarea
                        className={inputClass()}
                        rows={2}
                        value={section.subtitle ?? ""}
                        onChange={(e) => updateSection(i, { subtitle: e.target.value })}
                      />
                    </div>
                    <div className={FIELD_FULL}>
                      {fieldLabel("Paragraphs — one per line")}
                      <textarea
                        className={inputClass()}
                        rows={4}
                        value={(section.paragraphs ?? []).join("\n")}
                        onChange={(e) =>
                          updateSection(i, {
                            paragraphs: e.target.value
                              .split("\n")
                              .map((l) => l.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                    <div className={FIELD_FULL}>
                      {fieldLabel("Checklist — one item per line")}
                      <textarea
                        className={inputClass()}
                        rows={3}
                        value={(section.checklist ?? []).join("\n")}
                        onChange={(e) =>
                          updateSection(i, {
                            checklist: e.target.value
                              .split("\n")
                              .map((l) => l.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="button" className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          {message && (
            <span className={"text-[0.85rem] " + (message.startsWith("Saved") ? "text-[var(--admin-green)]" : "text-[var(--admin-red)]")}>
              {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
