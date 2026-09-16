"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import type { ContactPageContent } from "@/types/page-content";
import { SectionSaveButton } from "../../_components/section-save-button";
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

interface ContactPageEditorProps {
  initialContent: ContactPageContent;
}

const SECTIONS = [
  { id: "hero", title: "Hero Section", desc: "Hero title and subtitle" },
  { id: "details", title: "Contact Details", desc: "Address, phone, email and hours" },
  { id: "form", title: "Contact Form", desc: "Form heading, fields and messages" },
  { id: "map", title: "Map Embed", desc: "Google Maps embed URL" },
  { id: "cta", title: "CTA Section", desc: "Call-to-action heading and buttons" },
  { id: "seo", title: "SEO & Metadata", desc: "Title, description and keywords" },
];
const ALL_SECTION_IDS = SECTIONS.map((s) => s.id);

// Maps a UI section id to the key it lives under in ContactPageContent
const SECTION_TO_KEY: Record<string, keyof ContactPageContent> = {
  hero: "hero",
  details: "contactDetails",
  form: "contactForm",
  map: "mapEmbed",
  cta: "cta",
  seo: "seo",
};

export default function ContactPageEditor({ initialContent }: ContactPageEditorProps) {
  const [content, setContent] = useState<ContactPageContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});
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
      const response = await fetch("/api/admin/pages/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }

      toast.success("Contact page updated successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const saveSection = async (sectionId: string) => {
    const dataKey = SECTION_TO_KEY[sectionId];
    setSavingSection(sectionId);
    setSectionErrors((prev) => ({ ...prev, [sectionId]: "" }));

    try {
      const response = await fetch("/api/admin/pages/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: dataKey,
          content: content[dataKey],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }

      const sectionTitle = SECTIONS.find((s) => s.id === sectionId)?.title;
      toast.success(`${sectionTitle ?? "Section"} saved successfully!`);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to save changes";
      setSectionErrors((prev) => ({ ...prev, [sectionId]: errorMsg }));
      toast.error(errorMsg);
    } finally {
      setSavingSection(null);
    }
  };

  const [contactInfoModal, setContactInfoModal] = useState<
    "address" | "phone" | "email" | "hours" | null
  >(null);
  const [contactInfoDraft, setContactInfoDraft] = useState({
    label: "",
    value: "",
    mapUrl: "",
    tel: "",
  });

  const openEditContactInfo = (key: "address" | "phone" | "email" | "hours") => {
    const data = content.contactDetails[key];
    setContactInfoDraft({
      label: data.label,
      value: data.value,
      mapUrl: "mapUrl" in data ? (data.mapUrl ?? "") : "",
      tel: "tel" in data ? (data.tel ?? "") : "",
    });
    setContactInfoModal(key);
  };

  const closeContactInfoModal = () => setContactInfoModal(null);

  const saveContactInfo = () => {
    if (!contactInfoModal) return;
    const key = contactInfoModal;
    const base = { label: contactInfoDraft.label, value: contactInfoDraft.value };
    setContent({
      ...content,
      contactDetails: {
        ...content.contactDetails,
        [key]:
          key === "address"
            ? { ...base, mapUrl: contactInfoDraft.mapUrl }
            : key === "phone"
              ? { ...base, tel: contactInfoDraft.tel }
              : base,
      },
    });
    closeContactInfoModal();
  };

  const [formFieldModal, setFormFieldModal] = useState<
    "name" | "phone" | "email" | "subject" | "message" | null
  >(null);
  const [formFieldDraft, setFormFieldDraft] = useState<{
    label: string;
    placeholder: string;
    options: string[];
  }>({ label: "", placeholder: "", options: [] });

  const openEditFormField = (key: "name" | "phone" | "email" | "subject" | "message") => {
    const field = content.contactForm.fields[key];
    setFormFieldDraft({
      label: field.label,
      placeholder: "placeholder" in field ? field.placeholder : "",
      options: "options" in field ? [...field.options] : [],
    });
    setFormFieldModal(key);
  };

  const closeFormFieldModal = () => setFormFieldModal(null);

  const updateDraftOption = (index: number, value: string) => {
    setFormFieldDraft((d) => ({
      ...d,
      options: d.options.map((o, i) => (i === index ? value : o)),
    }));
  };

  const addDraftOption = () => {
    setFormFieldDraft((d) => ({ ...d, options: [...d.options, "New Option"] }));
  };

  const removeDraftOption = (index: number) => {
    setFormFieldDraft((d) => ({
      ...d,
      options: d.options.filter((_, i) => i !== index),
    }));
  };

  const saveFormField = () => {
    if (!formFieldModal) return;
    const key = formFieldModal;
    setContent({
      ...content,
      contactForm: {
        ...content.contactForm,
        fields: {
          ...content.contactForm.fields,
          [key]:
            key === "subject"
              ? { label: formFieldDraft.label, options: formFieldDraft.options }
              : { label: formFieldDraft.label, placeholder: formFieldDraft.placeholder },
        },
      },
    });
    closeFormFieldModal();
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
            <span className="pp-section__desc">Hero title and subtitle</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("hero") && (
        <div className="pp-section__body">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, title: e.target.value } })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              value={content.hero.subtitle}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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

      {/* Contact Details Section */}
      <section className={`pp-section ${expandedSections.has("details") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("details")} onClick={() => toggleSection("details")}>
          <span className="pp-section__num">2</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Contact Details</span>
            <span className="pp-section__desc">Address, phone, email and hours</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("details") && (
        <div className="pp-section__body">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Heading
            </label>
            <input
              type="text"
              value={content.contactDetails.sectionHeading}
              onChange={(e) =>
                setContent({
                  ...content,
                  contactDetails: {
                    ...content.contactDetails,
                    sectionHeading: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Body</label>
            <RichTextEditor
              content={content.contactDetails.sectionBody}
              onChange={(html) =>
                setContent({
                  ...content,
                  contactDetails: { ...content.contactDetails, sectionBody: html },
                })
              }
            />
          </div>

          {/* Contact Info Items */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Contact Details Items</h3>
            <div className="pp-table-wrap rounded-lg border border-[var(--admin-line)]">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 bg-[var(--admin-surface-2)]">#</TableHead>
                    <TableHead className="w-1/3 truncate bg-[var(--admin-surface-2)]">ITEM</TableHead>
                    <TableHead className="bg-[var(--admin-surface-2)]">VALUE</TableHead>
                    <TableHead className="w-28 text-right bg-[var(--admin-surface-2)]">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { key: "address" as const, title: "Address" },
                    { key: "phone" as const, title: "Phone" },
                    { key: "email" as const, title: "Email" },
                    { key: "hours" as const, title: "Opening Hours" },
                  ].map((item, idx) => (
                    <TableRow key={item.key}>
                      <TableCell className="w-12 py-2.5">{idx + 1}</TableCell>
                      <TableCell className="truncate py-2.5 text-sm font-semibold">
                        {item.title}
                      </TableCell>
                      <TableCell className="cell-ellipsis py-2.5 text-sm text-[var(--admin-muted)]">
                        {content.contactDetails[item.key].value}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="row-actions justify-end">
                          <button
                            type="button"
                            className="act-btn"
                            onClick={() => openEditContactInfo(item.key)}
                            title={`Edit ${item.title}`}
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
          id="details"
          saving={savingSection === "details"}
          error={sectionErrors.details}
          onSave={saveSection}
        />
        </div>
        )}
      </section>

      {/* Contact Form Section */}
      <section className={`pp-section ${expandedSections.has("form") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("form")} onClick={() => toggleSection("form")}>
          <span className="pp-section__num">3</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Contact Form</span>
            <span className="pp-section__desc">Form heading, fields and messages</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("form") && (
        <div className="pp-section__body">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Form Heading</label>
            <input
              type="text"
              value={content.contactForm.heading}
              onChange={(e) =>
                setContent({
                  ...content,
                  contactForm: { ...content.contactForm, heading: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Form Fields */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Form Fields</h3>
            <div className="pp-table-wrap rounded-lg border border-[var(--admin-line)]">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 bg-[var(--admin-surface-2)]">#</TableHead>
                    <TableHead className="w-1/3 truncate bg-[var(--admin-surface-2)]">FIELD</TableHead>
                    <TableHead className="bg-[var(--admin-surface-2)]">LABEL</TableHead>
                    <TableHead className="bg-[var(--admin-surface-2)]">PLACEHOLDER / OPTIONS</TableHead>
                    <TableHead className="w-28 text-right bg-[var(--admin-surface-2)]">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { key: "name" as const, title: "Name Field" },
                    { key: "phone" as const, title: "Phone Field" },
                    { key: "email" as const, title: "Email Field" },
                    { key: "subject" as const, title: "Subject Field" },
                    { key: "message" as const, title: "Message Field" },
                  ].map((item, idx) => {
                    const field = content.contactForm.fields[item.key];
                    const isSubject = item.key === "subject";
                    const optionsCount =
                      field && "options" in field ? field.options.length : 0;
                    const placeholder =
                      field && "placeholder" in field ? field.placeholder : "";
                    return (
                      <TableRow key={item.key}>
                        <TableCell className="w-12 py-2.5">{idx + 1}</TableCell>
                        <TableCell className="truncate py-2.5 text-sm font-semibold">
                          {item.title}
                        </TableCell>
                        <TableCell className="cell-ellipsis py-2.5 text-sm text-[var(--admin-ink)]">
                          {field.label}
                        </TableCell>
                        <TableCell className="cell-ellipsis py-2.5 text-sm text-[var(--admin-muted)]">
                          {isSubject
                            ? `${optionsCount} option${optionsCount === 1 ? "" : "s"}`
                            : placeholder}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="row-actions justify-end">
                            <button
                              type="button"
                              className="act-btn"
                              onClick={() => openEditFormField(item.key)}
                              title={`Edit ${item.title}`}
                            >
                              <Pencil size={15} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submit Button Text
            </label>
            <input
              type="text"
              value={content.contactForm.submitButtonText}
              onChange={(e) =>
                setContent({
                  ...content,
                  contactForm: { ...content.contactForm, submitButtonText: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Success Message</label>
            <textarea
              value={content.contactForm.successMessage}
              onChange={(e) =>
                setContent({
                  ...content,
                  contactForm: { ...content.contactForm, successMessage: e.target.value },
                })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note Message</label>
            <textarea
              value={content.contactForm.noteMessage}
              onChange={(e) =>
                setContent({
                  ...content,
                  contactForm: { ...content.contactForm, noteMessage: e.target.value },
                })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <SectionSaveButton
          id="form"
          saving={savingSection === "form"}
          error={sectionErrors.form}
          onSave={saveSection}
        />
        </div>
        )}
      </section>

      {/* Map Embed Section */}
      <section className={`pp-section ${expandedSections.has("map") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("map")} onClick={() => toggleSection("map")}>
          <span className="pp-section__num">4</span>
          <span className="pp-section__text">
            <span className="pp-section__title">Map Embed</span>
            <span className="pp-section__desc">Google Maps embed URL</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("map") && (
        <div className="pp-section__body">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Map Title</label>
            <input
              type="text"
              value={content.mapEmbed.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  mapEmbed: { ...content.mapEmbed, title: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="PCM location map"
            />
            <p className="text-xs text-gray-500 mt-1">Used for accessibility (iframe title)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Embed URL</label>
            <textarea
              value={content.mapEmbed.embedUrl}
              onChange={(e) =>
                setContent({
                  ...content,
                  mapEmbed: { ...content.mapEmbed, embedUrl: e.target.value },
                })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
              placeholder="https://maps.google.com/maps?q=..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Get this from Google Maps → Share → Embed a map → Copy the src URL
            </p>
          </div>
        </div>
        <SectionSaveButton
          id="map"
          saving={savingSection === "map"}
          error={sectionErrors.map}
          onSave={saveSection}
        />
        </div>
        )}
      </section>

      {/* CTA Section */}
      <section className={`pp-section ${expandedSections.has("cta") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("cta")} onClick={() => toggleSection("cta")}>
          <span className="pp-section__num">5</span>
          <span className="pp-section__text">
            <span className="pp-section__title">CTA Section</span>
            <span className="pp-section__desc">Call-to-action heading and buttons</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("cta") && (
        <div className="pp-section__body">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
            <input
              type="text"
              value={content.cta.eyebrow}
              onChange={(e) =>
                setContent({ ...content, cta: { ...content.cta, eyebrow: e.target.value } })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={content.cta.heading}
              onChange={(e) =>
                setContent({ ...content, cta: { ...content.cta, heading: e.target.value } })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea
              value={content.cta.body}
              onChange={(e) =>
                setContent({ ...content, cta: { ...content.cta, body: e.target.value } })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Buttons</h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="text-sm font-medium mb-2">Primary Button</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={content.cta.buttons.primary.text}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        cta: {
                          ...content.cta,
                          buttons: {
                            ...content.cta.buttons,
                            primary: { ...content.cta.buttons.primary, text: e.target.value },
                          },
                        },
                      })
                    }
                    placeholder="Button text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    value={content.cta.buttons.primary.url}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        cta: {
                          ...content.cta,
                          buttons: {
                            ...content.cta.buttons,
                            primary: { ...content.cta.buttons.primary, url: e.target.value },
                          },
                        },
                      })
                    }
                    placeholder="URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <h4 className="text-sm font-medium mb-2">Secondary Button</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={content.cta.buttons.secondary.text}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        cta: {
                          ...content.cta,
                          buttons: {
                            ...content.cta.buttons,
                            secondary: { ...content.cta.buttons.secondary, text: e.target.value },
                          },
                        },
                      })
                    }
                    placeholder="Button text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="text"
                    value={content.cta.buttons.secondary.url}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        cta: {
                          ...content.cta,
                          buttons: {
                            ...content.cta.buttons,
                            secondary: { ...content.cta.buttons.secondary, url: e.target.value },
                          },
                        },
                      })
                    }
                    placeholder="URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
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

      {/* SEO & Metadata Section */}
      <section className={`pp-section ${expandedSections.has("seo") ? "is-expanded" : ""}`}>
        <button type="button" className="pp-section__toggle" aria-expanded={expandedSections.has("seo")} onClick={() => toggleSection("seo")}>
          <span className="pp-section__num">6</span>
          <span className="pp-section__text">
            <span className="pp-section__title">SEO & Metadata</span>
            <span className="pp-section__desc">Title, description and keywords</span>
          </span>
          <span className="pp-section__chevron"><ChevronDown size={18} /></span>
        </button>
        {expandedSections.has("seo") && (
        <div className="pp-section__body">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Title
            </label>
            <input
              type="text"
              value={content.seo.title}
              onChange={(e) =>
                setContent({ ...content, seo: { ...content.seo, title: e.target.value } })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Contact Us | Pokhara College of Management"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.seo.title.length}/60 characters (recommended: 50-60)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              value={content.seo.description}
              onChange={(e) =>
                setContent({ ...content, seo: { ...content.seo, description: e.target.value } })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Contact Pokhara College of Management – address, phone, email and enquiry form."
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.seo.description.length}/160 characters (recommended: 150-160)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={content.seo.keywords.join(", ")}
              onChange={(e) =>
                setContent({
                  ...content,
                  seo: {
                    ...content.seo,
                    keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean),
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="pcm contact, pokhara college management contact, pcm address"
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.seo.keywords.length} keywords (recommended: 5-10)
            </p>
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
      <div className="flex justify-end gap-3 sticky bottom-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-lg"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <Dialog
        open={contactInfoModal !== null}
        onOpenChange={(open) => !open && closeContactInfoModal()}
      >
        <DialogContent
          showCloseButton={false}
          className="news-modal w-[min(100%,520px)] sm:max-w-[520px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
        >
          <div className="modal__head">
            <DialogTitle className="m-0 text-[1.05rem] font-normal">
              Edit{" "}
              {contactInfoModal === "address"
                ? "Address"
                : contactInfoModal === "phone"
                  ? "Phone"
                  : contactInfoModal === "email"
                    ? "Email"
                    : "Opening Hours"}
            </DialogTitle>
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Close"
              onClick={closeContactInfoModal}
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal__body">
            <div className="form-grid">
              <div className="field field--full">
                <label htmlFor="contact-info-label">Label</label>
                <input
                  id="contact-info-label"
                  type="text"
                  value={contactInfoDraft.label}
                  onChange={(e) =>
                    setContactInfoDraft((d) => ({ ...d, label: e.target.value }))
                  }
                />
              </div>
              <div className="field field--full">
                <label htmlFor="contact-info-value">
                  {contactInfoModal === "phone" ? "Display Value" : "Value"}
                </label>
                <input
                  id="contact-info-value"
                  type={contactInfoModal === "email" ? "email" : "text"}
                  value={contactInfoDraft.value}
                  onChange={(e) =>
                    setContactInfoDraft((d) => ({ ...d, value: e.target.value }))
                  }
                />
              </div>
              {contactInfoModal === "address" && (
                <div className="field field--full">
                  <label htmlFor="contact-info-mapurl">Map URL</label>
                  <input
                    id="contact-info-mapurl"
                    type="text"
                    value={contactInfoDraft.mapUrl}
                    onChange={(e) =>
                      setContactInfoDraft((d) => ({ ...d, mapUrl: e.target.value }))
                    }
                    placeholder="https://maps.google.com/?q=..."
                  />
                  <p className="text-xs text-[var(--admin-muted)]">
                    Used for the &quot;Get Directions&quot; link on the contact page.
                  </p>
                </div>
              )}
              {contactInfoModal === "phone" && (
                <div className="field field--full">
                  <label htmlFor="contact-info-tel">Tel Link (numbers only)</label>
                  <input
                    id="contact-info-tel"
                    type="text"
                    value={contactInfoDraft.tel}
                    onChange={(e) =>
                      setContactInfoDraft((d) => ({ ...d, tel: e.target.value }))
                    }
                    placeholder="061544761"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={closeContactInfoModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={saveContactInfo}
              disabled={!contactInfoDraft.label.trim() || !contactInfoDraft.value.trim()}
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={formFieldModal !== null}
        onOpenChange={(open) => !open && closeFormFieldModal()}
      >
        <DialogContent
          showCloseButton={false}
          className="news-modal w-[min(100%,520px)] sm:max-w-[520px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
        >
          <div className="modal__head">
            <DialogTitle className="m-0 text-[1.05rem] font-normal">
              Edit{" "}
              {formFieldModal === "name"
                ? "Name Field"
                : formFieldModal === "phone"
                  ? "Phone Field"
                  : formFieldModal === "email"
                    ? "Email Field"
                    : formFieldModal === "subject"
                      ? "Subject Field"
                      : "Message Field"}
            </DialogTitle>
            <button
              type="button"
              className="admin-icon-btn"
              aria-label="Close"
              onClick={closeFormFieldModal}
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal__body">
            <div className="form-grid">
              <div className="field field--full">
                <label htmlFor="form-field-label">Label</label>
                <input
                  id="form-field-label"
                  type="text"
                  value={formFieldDraft.label}
                  onChange={(e) =>
                    setFormFieldDraft((d) => ({ ...d, label: e.target.value }))
                  }
                />
              </div>
              {formFieldModal === "subject" ? (
                <div className="field field--full">
                  <label>Options</label>
                  <div className="space-y-2">
                    {formFieldDraft.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateDraftOption(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeDraftOption(index)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addDraftOption}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              ) : (
                <div className="field field--full">
                  <label htmlFor="form-field-placeholder">Placeholder</label>
                  <input
                    id="form-field-placeholder"
                    type="text"
                    value={formFieldDraft.placeholder}
                    onChange={(e) =>
                      setFormFieldDraft((d) => ({ ...d, placeholder: e.target.value }))
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={closeFormFieldModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={saveFormField}
              disabled={!formFieldDraft.label.trim()}
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
