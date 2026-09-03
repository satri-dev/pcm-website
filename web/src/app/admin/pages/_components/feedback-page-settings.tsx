"use client";

import { useState, type ReactNode } from "react";
import { Save, Link2, Plus, Trash2, GripVertical, Check } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import DocumentUpload from "@/components/cloudinary/DocumentUpload";
import {
  FEEDBACK_PAGE_SETTINGS_DEFAULTS,
  FEEDBACK_FIELD_TYPES,
  type FeedbackFieldConfig,
  type FeedbackFieldType,
  type FeedbackPageSettings,
} from "@/types/feedback-page-settings";
import Image from "next/image";

const API_BASE = "/api/admin/pages/feedback-settings";

const INPUT =
  "w-full px-3 py-2 border border-(--admin-line) rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--admin-brand) focus:border-transparent bg-(--admin-surface) text-(--admin-ink)";

function fieldLabel(c: ReactNode) {
  return (
    <span className="mb-1 block text-[0.85rem] font-medium text-(--admin-ink)">
      {c}
    </span>
  );
}

function makeId(label: string): string {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || `field-${Date.now()}`;
}

const TYPE_LABEL: Record<FeedbackFieldType, string> = {
  text: "Short text",
  textarea: "Long text",
  number: "Number",
  email: "Email",
  checkbox: "Checkbox",
  "checkbox-group": "Checkbox Group",
  select: "Dropdown",
  radio: "Radio buttons",
  rating: "Star Rating",
  image: "Image upload",
  document: "File upload",
};

// TextField component moved outside render
const TextField = ({
  label,
  value,
  onChange,
  textarea,
  rows,
  placeholder,
  inputType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  inputType?: string;
}) => (
  <label className="block">
    {fieldLabel(label)}
    {textarea ? (
      <textarea
        rows={rows ?? 2}
        className={INPUT}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={inputType ?? "text"}
        className={INPUT}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
  </label>
);

// ImageField component moved outside render
const ImageField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    {fieldLabel(label)}
    <div className="flex flex-wrap items-center gap-3">
      {value ? (
        <Image
          src={value}
          alt=""
          className="h-14 w-20 rounded-lg border border-(--admin-line) object-cover"
        />
      ) : null}
      <ImageUpload onUpload={(r) => onChange(r.secure_url)} />
      {value && (
        <button
          type="button"
          className="admin-btn admin-btn--ghost admin-btn--sm"
          onClick={() => onChange("")}
        >
          <Trash2 size={14} /> Remove
        </button>
      )}
    </div>
  </div>
);

export default function FeedbackPageSettings({
  initial,
}: {
  initial: FeedbackPageSettings;
}) {
  const [form, setForm] = useState<FeedbackPageSettings>({
    ...FEEDBACK_PAGE_SETTINGS_DEFAULTS,
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof FeedbackPageSettings>(
    key: K,
    value: FeedbackPageSettings[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const setField = (idx: number, patch: Partial<FeedbackFieldConfig>) =>
    set(
      "fields",
      form.fields.map((f, i) => (i === idx ? { ...f, ...patch } : f)),
    );

  const addField = () => {
    const n = form.fields.length + 1;
    const id = `field${n}`;
    set("fields", [
      ...form.fields,
      { id, label: `Field ${n}`, type: "text", required: false, options: [] },
    ]);
  };

  const removeField = (idx: number) =>
    set(
      "fields",
      form.fields.filter((_, i) => i !== idx),
    );

  const moveField = (idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= form.fields.length) return;
    const next = [...form.fields];
    [next[idx], next[t]] = [next[t], next[idx]];
    set("fields", next);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      // Clean up seoKeywords before saving (remove empty lines)
      // Also clean up field options (remove empty options)
      const cleanedForm = {
        ...form,
        seoKeywords: form.seoKeywords.filter(Boolean),
        fields: form.fields.map((field) => ({
          ...field,
          options: field.options?.filter(Boolean),
        })),
      };

      const res = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedForm),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Save failed (HTTP ${res.status})`);
      }

      // Update form state with cleaned keywords
      setForm(cleanedForm);

      setMessage(
        "Saved. The public /feedback page and its form now reflect these changes.",
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="m-0 text-2xl font-bold text-(--admin-ink)">
            Feedback Page Content
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-(--admin-muted)">
            Configure the public /feedback page and the dynamic form. Add,
            remove, reorder and re-type the fields that face students.
          </p>
        </div>
        <a
          className="admin-btn"
          href="/feedback"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Link2 size={15} />
          View live page
        </a>
      </div>

      {/* ── SEO ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>SEO & Metadata</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <TextField
            label="Page Title"
            value={form.seoTitle}
            onChange={(v) => set("seoTitle", v)}
          />
          <TextField
            label="Meta Description"
            textarea
            rows={2}
            value={form.seoDescription}
            onChange={(v) => set("seoDescription", v)}
          />
          <TextField
            label="Keywords — one per line"
            textarea
            rows={3}
            value={form.seoKeywords.join("\n")}
            onChange={(v) =>
              set(
                "seoKeywords",
                v.split("\n").map((l) => l.trim()),
              )
            }
          />
          <ImageField
            label="OG Image"
            value={form.ogImage}
            onChange={(v) => set("ogImage", v)}
          />
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Page Hero</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <TextField
            label="Breadcrumb Label"
            value={form.breadcrumbLabel}
            onChange={(v) => set("breadcrumbLabel", v)}
          />
          <TextField
            label="Hero Title"
            value={form.heroTitle}
            onChange={(v) => set("heroTitle", v)}
          />
          <TextField
            label="Hero Subtitle"
            textarea
            rows={2}
            value={form.heroSubtitle}
            onChange={(v) => set("heroSubtitle", v)}
          />
          <ImageField
            label="Hero Image"
            value={form.heroImage}
            onChange={(v) => set("heroImage", v)}
          />
        </div>
      </div>

      {/* ── Form section heading ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Form Section Heading</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              label="Eyebrow"
              value={form.formEyebrow}
              onChange={(v) => set("formEyebrow", v)}
            />
            <TextField
              label="Title"
              value={form.formTitle}
              onChange={(v) => set("formTitle", v)}
            />
            <TextField
              label="Submit Button Label"
              value={form.submitLabel}
              onChange={(v) => set("submitLabel", v)}
            />
          </div>
          <TextField
            label="Subtitle"
            textarea
            rows={2}
            value={form.formSubtitle}
            onChange={(v) => set("formSubtitle", v)}
          />
        </div>
      </div>

      {/* ── Success copy ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Success Message</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Success Title"
              value={form.successTitle}
              onChange={(v) => set("successTitle", v)}
            />
            <TextField
              label="Success Message"
              value={form.successMessage}
              onChange={(v) => set("successMessage", v)}
            />
          </div>
        </div>
      </div>

      {/* ── Form options ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Form Options</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <div className="flex flex-col gap-4">
            <label className="flex items-center justify-between gap-4 rounded-lg border border-(--admin-line) bg-(--admin-surface) p-3">
              <div>
                <span className="block text-[0.9rem] font-medium text-(--admin-ink)">
                  Allow anonymous submissions
                </span>
                <span className="text-[0.8rem] text-(--admin-muted)">
                  Shows an anonymous toggle on the public form.
                </span>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 accent-pcm-green"
                checked={form.allowAnonymous}
                onChange={(e) => set("allowAnonymous", e.target.checked)}
              />
            </label>
            <TextField
              label="Anonymous Toggle Label"
              value={form.anonymousLabel}
              onChange={(v) => set("anonymousLabel", v)}
            />
            <TextField
              label="Anonymous Toggle Hint"
              value={form.anonymousHint}
              onChange={(v) => set("anonymousHint", v)}
            />
            <label className="flex items-center justify-between gap-4 rounded-lg border border-(--admin-line) bg-(--admin-surface) p-3">
              <div>
                <span className="block text-[0.9rem] font-medium text-(--admin-ink)">
                  Enable overall rating
                </span>
                <span className="text-[0.8rem] text-(--admin-muted)">
                  Adds a star-rating field to the public form.
                </span>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 accent-pcm-green"
                checked={form.ratingEnabled}
                onChange={(e) => set("ratingEnabled", e.target.checked)}
              />
            </label>
            <TextField
              label="Rating Label"
              value={form.ratingLabel}
              onChange={(v) => set("ratingLabel", v)}
            />
          </div>
        </div>
      </div>

      {/* ── Dynamic fields ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>Form Fields ({form.fields.length})</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-4">
          <p className="m-0 text-[0.9rem] text-(--admin-muted)">
            These are the fields end users see. Add, remove, reorder, or change
            the type of each field. Select, radio &amp; checkbox-group fields
            expose an options editor; number &amp; rating fields expose min/max.
          </p>
          <div className="flex flex-col gap-3">
            {form.fields.map((field, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-(--admin-line) bg-(--admin-surface) p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-(--admin-muted)" />
                  <b className="text-sm text-(--admin-ink)">
                    {idx + 1}. {field.label || field.id}
                  </b>
                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-(--admin-muted)">
                    {TYPE_LABEL[field.type] ?? field.type}
                  </span>
                  <div className="ml-auto flex gap-1">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      onClick={() => moveField(idx, -1)}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn"
                      onClick={() => moveField(idx, 1)}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn text-[var(--admin-red)] hover:bg-red-50"
                      onClick={() => removeField(idx)}
                      title="Remove field"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="block">
                    {fieldLabel("Field ID")}
                    <input
                      className={INPUT}
                      value={field.id}
                      onChange={(e) =>
                        setField(idx, {
                          id: makeId(e.target.value) || e.target.value,
                        })
                      }
                      placeholder="unique-id"
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Label")}
                    <input
                      className={INPUT}
                      value={field.label}
                      onChange={(e) => setField(idx, { label: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    {fieldLabel("Type")}
                    <select
                      className={INPUT}
                      value={field.type}
                      onChange={(e) =>
                        setField(idx, {
                          type: e.target.value as FeedbackFieldType,
                        })
                      }
                    >
                      {FEEDBACK_FIELD_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {TYPE_LABEL[t]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {field.type === "select" ||
                field.type === "radio" ||
                field.type === "checkbox-group" ? (
                  <div>
                    {fieldLabel("Options — one per line")}
                    <textarea
                      rows={3}
                      className={INPUT}
                      placeholder={"General\nAcademics\nFacilities"}
                      value={(field.options ?? []).join("\n")}
                      onChange={(e) =>
                        setField(idx, {
                          options: e.target.value
                            .split("\n")
                            .map((l) => l.trim()),
                        })
                      }
                    />
                  </div>
                ) : null}

                {field.type === "number" || field.type === "rating" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      {fieldLabel("Min")}
                      <input
                        type="number"
                        className={INPUT}
                        value={field.min ?? ""}
                        onChange={(e) =>
                          setField(idx, {
                            min:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="block">
                      {fieldLabel(
                        field.type === "rating" ? "Max (stars)" : "Max",
                      )}
                      <input
                        type="number"
                        className={INPUT}
                        value={field.max ?? (field.type === "rating" ? 5 : "")}
                        onChange={(e) =>
                          setField(idx, {
                            max:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {field.type !== "checkbox" && (
                    <label className="block">
                      {fieldLabel("Placeholder (optional)")}
                      <input
                        className={INPUT}
                        value={field.placeholder ?? ""}
                        onChange={(e) =>
                          setField(idx, { placeholder: e.target.value })
                        }
                      />
                    </label>
                  )}
                  <label className="block">
                    {fieldLabel("Hint (optional)")}
                    <input
                      className={INPUT}
                      value={field.hint ?? ""}
                      onChange={(e) => setField(idx, { hint: e.target.value })}
                    />
                  </label>
                  <label className="flex items-center gap-2 rounded-lg border border-(--admin-line) bg-black/[0.02] p-3">
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-[#51B747]"
                      checked={field.required}
                      onChange={(e) =>
                        setField(idx, { required: e.target.checked })
                      }
                    />
                    <span className="text-[0.9rem] font-medium text-[var(--admin-ink)]">
                      Required
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="admin-btn admin-btn--sm"
            onClick={addField}
          >
            <Plus size={14} /> Add field
          </button>
        </div>
      </div>

      {/* ── Document upload demo (policy) ── */}
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h3>File Upload Field</h3>
        </div>
        <div className="admin-panel__body p-6 space-y-2">
          <p className="m-0 text-[0.9rem] text-[var(--admin-muted)]">
            To let end users attach a file or image, add a field above with type
            &quot;File upload&quot; or &quot;Image upload&quot;. These render
            the Cloudinary upload widgets on the public form.
          </p>
          {fieldLabel("Try the document upload widget")}
          <DocumentUpload onUpload={() => {}} />
        </div>
      </div>

      {/* ── Save ── */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn--primary"
        >
          <Save size={16} />
          {saving ? "Saving…" : "Save changes"}
        </button>
        {message && (
          <span
            className={
              "text-[0.9rem] flex items-center gap-1.5 " +
              (message.startsWith("Saved")
                ? "text-[var(--admin-green)]"
                : "text-[var(--admin-red)]")
            }
          >
            {message.startsWith("Saved") && <Check size={15} />}
            {message}
          </span>
        )}
      </div>
    </main>
  );
}
