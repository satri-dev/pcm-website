"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import type { ContactPageContent } from "@/types/page-content";

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

export default function ContactPageEditor({ initialContent }: ContactPageEditorProps) {
  const [content, setContent] = useState<ContactPageContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(ALL_SECTION_IDS));

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

  const updateSubjectOption = (index: number, value: string) => {
    const newOptions = [...content.contactForm.fields.subject.options];
    newOptions[index] = value;
    setContent({
      ...content,
      contactForm: {
        ...content.contactForm,
        fields: {
          ...content.contactForm.fields,
          subject: {
            ...content.contactForm.fields.subject,
            options: newOptions,
          },
        },
      },
    });
  };

  const addSubjectOption = () => {
    setContent({
      ...content,
      contactForm: {
        ...content.contactForm,
        fields: {
          ...content.contactForm.fields,
          subject: {
            ...content.contactForm.fields.subject,
            options: [...content.contactForm.fields.subject.options, "New Option"],
          },
        },
      },
    });
  };

  const removeSubjectOption = (index: number) => {
    const newOptions = content.contactForm.fields.subject.options.filter((_, i) => i !== index);
    setContent({
      ...content,
      contactForm: {
        ...content.contactForm,
        fields: {
          ...content.contactForm.fields,
          subject: {
            ...content.contactForm.fields.subject,
            options: newOptions,
          },
        },
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
            <textarea
              value={content.contactDetails.sectionBody}
              onChange={(e) =>
                setContent({
                  ...content,
                  contactDetails: { ...content.contactDetails, sectionBody: e.target.value },
                })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Address */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Address</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={content.contactDetails.address.label}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactDetails: {
                        ...content.contactDetails,
                        address: { ...content.contactDetails.address, label: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  value={content.contactDetails.address.value}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactDetails: {
                        ...content.contactDetails,
                        address: { ...content.contactDetails.address, value: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Map URL</label>
                <input
                  type="text"
                  value={content.contactDetails.address.mapUrl}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactDetails: {
                        ...content.contactDetails,
                        address: { ...content.contactDetails.address, mapUrl: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Phone</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={content.contactDetails.phone.label}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactDetails: {
                        ...content.contactDetails,
                        phone: { ...content.contactDetails.phone, label: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Value
                </label>
                <input
                  type="text"
                  value={content.contactDetails.phone.value}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactDetails: {
                        ...content.contactDetails,
                        phone: { ...content.contactDetails.phone, value: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="(061) 544761, 570124"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tel Link (numbers only)
                </label>
                <input
                  type="text"
                  value={content.contactDetails.phone.tel}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactDetails: {
                        ...content.contactDetails,
                        phone: { ...content.contactDetails.phone, tel: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="061544761"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Email</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={content.contactDetails.email.label}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactDetails: {
                        ...content.contactDetails,
                        email: { ...content.contactDetails.email, label: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="email"
                  value={content.contactDetails.email.value}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactDetails: {
                        ...content.contactDetails,
                        email: { ...content.contactDetails.email, value: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Opening Hours</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={content.contactDetails.hours.label}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactDetails: {
                        ...content.contactDetails,
                        hours: { ...content.contactDetails.hours, label: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  value={content.contactDetails.hours.value}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactDetails: {
                        ...content.contactDetails,
                        hours: { ...content.contactDetails.hours, value: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
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

            {/* Name Field */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h4 className="text-sm font-medium mb-2">Name Field</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={content.contactForm.fields.name.label}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactForm: {
                        ...content.contactForm,
                        fields: {
                          ...content.contactForm.fields,
                          name: { ...content.contactForm.fields.name, label: e.target.value },
                        },
                      },
                    })
                  }
                  placeholder="Label"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  value={content.contactForm.fields.name.placeholder}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactForm: {
                        ...content.contactForm,
                        fields: {
                          ...content.contactForm.fields,
                          name: {
                            ...content.contactForm.fields.name,
                            placeholder: e.target.value,
                          },
                        },
                      },
                    })
                  }
                  placeholder="Placeholder"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h4 className="text-sm font-medium mb-2">Phone Field</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={content.contactForm.fields.phone.label}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactForm: {
                        ...content.contactForm,
                        fields: {
                          ...content.contactForm.fields,
                          phone: { ...content.contactForm.fields.phone, label: e.target.value },
                        },
                      },
                    })
                  }
                  placeholder="Label"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  value={content.contactForm.fields.phone.placeholder}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactForm: {
                        ...content.contactForm,
                        fields: {
                          ...content.contactForm.fields,
                          phone: {
                            ...content.contactForm.fields.phone,
                            placeholder: e.target.value,
                          },
                        },
                      },
                    })
                  }
                  placeholder="Placeholder"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h4 className="text-sm font-medium mb-2">Email Field</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={content.contactForm.fields.email.label}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactForm: {
                        ...content.contactForm,
                        fields: {
                          ...content.contactForm.fields,
                          email: { ...content.contactForm.fields.email, label: e.target.value },
                        },
                      },
                    })
                  }
                  placeholder="Label"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  value={content.contactForm.fields.email.placeholder}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactForm: {
                        ...content.contactForm,
                        fields: {
                          ...content.contactForm.fields,
                          email: {
                            ...content.contactForm.fields.email,
                            placeholder: e.target.value,
                          },
                        },
                      },
                    })
                  }
                  placeholder="Placeholder"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            {/* Subject Field */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h4 className="text-sm font-medium mb-2">Subject Field</h4>
              <input
                type="text"
                value={content.contactForm.fields.subject.label}
                onChange={(e) =>
                  setContent({
                    ...content,
                    contactForm: {
                      ...content.contactForm,
                      fields: {
                        ...content.contactForm.fields,
                        subject: { ...content.contactForm.fields.subject, label: e.target.value },
                      },
                    },
                  })
                }
                placeholder="Label"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
              />
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600">Options</label>
                {content.contactForm.fields.subject.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateSubjectOption(index, e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubjectOption(index)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSubjectOption}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                >
                  + Add Option
                </button>
              </div>
            </div>

            {/* Message Field */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h4 className="text-sm font-medium mb-2">Message Field</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={content.contactForm.fields.message.label}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactForm: {
                        ...content.contactForm,
                        fields: {
                          ...content.contactForm.fields,
                          message: { ...content.contactForm.fields.message, label: e.target.value },
                        },
                      },
                    })
                  }
                  placeholder="Label"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  value={content.contactForm.fields.message.placeholder}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactForm: {
                        ...content.contactForm,
                        fields: {
                          ...content.contactForm.fields,
                          message: {
                            ...content.contactForm.fields.message,
                            placeholder: e.target.value,
                          },
                        },
                      },
                    })
                  }
                  placeholder="Placeholder"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
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
    </div>
  );
}
