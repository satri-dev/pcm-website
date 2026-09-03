"use client";

import { useState } from "react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import DocumentUpload from "@/components/cloudinary/DocumentUpload";
import type {
  FeedbackFieldConfig,
  FeedbackPageSettings,
} from "@/types/feedback-page-settings";

type Status = "idle" | "submitting" | "success" | "error";
type Value = string | number | boolean | string[];

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    width="36"
    height="36"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const SendIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />
  </svg>
);

export default function FeedbackForm({
  settings,
}: {
  settings: FeedbackPageSettings;
}) {
  const [values, setValues] = useState<Record<string, Value>>({});
  const [rating, setRating] = useState(0);
  const [anonymous, setAnonymous] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const setValue = (id: string, value: Value) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  /* Success state */
  if (status === "success") {
    return (
      <div className="fb-success" role="status" aria-live="polite">
        <div className="fb-success__icon">
          <CheckIcon />
        </div>
        <h3>{settings.successTitle}</h3>
        <p>{settings.successMessage}</p>
        <button
          type="button"
          className="fb-btn fb-btn-outline"
          onClick={() => {
            setStatus("idle");
            setServerError(null);
            setValues({});
            setRating(0);
            setAnonymous(false);
            setErrors({});
          }}
        >
          Submit another response
        </button>
      </div>
    );
  }

  const visibleFields = settings.fields.filter(
    (f) => !(anonymous && (f.id === "name" || f.id === "email")),
  );

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (settings.ratingEnabled && rating === 0) {
      next.rating = "Please select a rating.";
    }
    for (const f of settings.fields) {
      if (f.required) {
        const v = values[f.id];
        if (
          v === undefined ||
          v === "" ||
          (Array.isArray(v) && v.length === 0) ||
          v === false
        ) {
          next[f.id] = `${f.label} is required.`;
        }
      }
      if (
        f.type === "email" &&
        values[f.id] &&
        typeof values[f.id] === "string" &&
        values[f.id] !== ""
      ) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values[f.id]))) {
          next[f.id] = "Please enter a valid email address.";
        }
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    setServerError(null);
    try {
      const payload = {
        fields: settings.ratingEnabled ? { ...values, rating } : values,
        anonymous,
      };
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setServerError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setServerError("Could not send your feedback. Please try again.");
      setStatus("error");
    }
  };

  const renderField = (field: FeedbackFieldConfig) => {
    const value = values[field.id];
    const error = errors[field.id];
    const req = (
      <span className="fb-req" aria-hidden="true">
        *
      </span>
    );
    const label = (
      <label className="fb-label">
        {field.label}
        {field.required && req}
        {!field.required && field.hint ? (
          <span className="fb-optional"> ({field.hint})</span>
        ) : null}
      </label>
    );
    const hint = field.hint && !field.required ? null : field.hint;

    switch (field.type) {
      case "textarea":
        return (
          <div
            key={field.id}
            className={`fb-field${error ? " fb-field--error" : ""}`}
          >
            {label}
            <textarea
              className="fb-input fb-textarea"
              placeholder={field.placeholder}
              rows={5}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => setValue(field.id, e.target.value)}
            />
            {hint && <span className="fb-toggle-hint">{hint}</span>}
            {error && (
              <span className="fb-error" role="alert">
                {error}
              </span>
            )}
          </div>
        );

      case "email":
      case "text":
      case "number":
        return (
          <div
            key={field.id}
            className={`fb-field${error ? " fb-field--error" : ""}`}
          >
            {label}
            <input
              type={field.type === "number" ? "number" : field.type}
              className="fb-input"
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              value={
                typeof value === "string" || typeof value === "number"
                  ? String(value ?? "")
                  : ""
              }
              onChange={(e) => {
                if (field.type === "number") {
                  setValue(
                    field.id,
                    e.target.value === "" ? "" : Number(e.target.value),
                  );
                } else {
                  setValue(field.id, e.target.value);
                }
              }}
            />
            {hint && <span className="fb-toggle-hint">{hint}</span>}
            {error && (
              <span className="fb-error" role="alert">
                {error}
              </span>
            )}
          </div>
        );

      case "select":
        return (
          <div
            key={field.id}
            className={`fb-field${error ? " fb-field--error" : ""}`}
          >
            {label}
            <select
              className="fb-input"
              value={typeof value === "string" ? value : ""}
              onChange={(e) => setValue(field.id, e.target.value)}
            >
              <option value="">Select {field.label}</option>
              {(field.options ?? []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {hint && <span className="fb-toggle-hint">{hint}</span>}
            {error && (
              <span className="fb-error" role="alert">
                {error}
              </span>
            )}
          </div>
        );

      case "radio":
        return (
          <div
            key={field.id}
            className={`fb-field${error ? " fb-field--error" : ""}`}
          >
            {label}
            <div className="fb-pills" role="group" aria-label={field.label}>
              {(field.options ?? []).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`fb-pill${value === opt ? " fb-pill--active" : ""}`}
                  onClick={() => setValue(field.id, opt)}
                  aria-pressed={value === opt}
                >
                  {opt}
                </button>
              ))}
            </div>
            {error && (
              <span className="fb-error" role="alert">
                {error}
              </span>
            )}
          </div>
        );

      case "checkbox": {
        // Single checkbox without options
        if (!field.options || field.options.length === 0) {
          return (
            <div key={field.id} className="fb-field fb-field--inline">
              <label className="fb-toggle">
                <input
                  type="checkbox"
                  checked={value === true}
                  onChange={(e) => setValue(field.id, e.target.checked)}
                />
                <span className="fb-toggle__track" aria-hidden="true" />
                {field.label}
              </label>
              {hint && <span className="fb-toggle-hint">{hint}</span>}
            </div>
          );
        }
        // Legacy: checkbox with options (now use checkbox-group instead)
        const selected: string[] = Array.isArray(value) ? value : [];
        return (
          <div
            key={field.id}
            className={`fb-field${error ? " fb-field--error" : ""}`}
          >
            {label}
            <div className="fb-pills" role="group" aria-label={field.label}>
              {(field.options ?? []).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`fb-pill${selected.includes(opt) ? " fb-pill--active" : ""}`}
                  aria-pressed={selected.includes(opt)}
                  onClick={() => {
                    const next = selected.includes(opt)
                      ? selected.filter((o) => o !== opt)
                      : [...selected, opt];
                    setValue(field.id, next);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {error && (
              <span className="fb-error" role="alert">
                {error}
              </span>
            )}
          </div>
        );
      }

      case "checkbox-group": {
        const selectedItems: string[] = Array.isArray(value) ? value : [];
        return (
          <div
            key={field.id}
            className={`fb-field${error ? " fb-field--error" : ""}`}
          >
            {label}
            <div className="space-y-2">
              {(field.options ?? []).map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-pcm-green"
                    checked={selectedItems.includes(opt)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...selectedItems, opt]
                        : selectedItems.filter((o) => o !== opt);
                      setValue(field.id, next);
                    }}
                  />
                  <span className="text-sm text-(--ink)">{opt}</span>
                </label>
              ))}
            </div>
            {hint && <span className="fb-toggle-hint">{hint}</span>}
            {error && (
              <span className="fb-error" role="alert">
                {error}
              </span>
            )}
          </div>
        );
      }

      case "rating": {
        const ratingValue = typeof value === "number" ? value : 0;
        return (
          <div
            key={field.id}
            className={`fb-field${error ? " fb-field--error" : ""}`}
          >
            {label}
            <div className="fb-stars" role="group" aria-label={field.label}>
              {Array.from({ length: field.max ?? 5 }, (_, i) => i + 1).map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    className={`fb-star${ratingValue >= star ? " fb-star--filled" : ""}`}
                    onClick={() => setValue(field.id, star)}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    aria-pressed={ratingValue >= star}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ),
              )}
            </div>
            {hint && <span className="fb-toggle-hint">{hint}</span>}
            {error && (
              <span className="fb-error" role="alert">
                {error}
              </span>
            )}
          </div>
        );
      }

      case "image":
      case "document": {
        const current = typeof value === "string" ? value : "";
        return (
          <div
            key={field.id}
            className={`fb-field${error ? " fb-field--error" : ""}`}
          >
            {label}
            <div className="space-y-2">
              {field.type === "image" ? (
                <ImageUpload
                  onUpload={(r) => setValue(field.id, r.secure_url)}
                />
              ) : (
                <DocumentUpload
                  onUpload={(r) => setValue(field.id, r.secure_url)}
                />
              )}
              {current ? (
                <div className="flex items-center gap-3 rounded-lg border border-(--line) bg-(--surface-soft) px-3 py-2">
                  {field.type === "image" ? (
                    <img
                      src={current}
                      alt={field.label}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <span className="text-lg">📄</span>
                  )}
                  <a
                    href={current}
                    target="_blank"
                    rel="noreferrer"
                    className="fb-toggle-hint truncate flex-1 min-w-0 hover:underline"
                  >
                    {current}
                  </a>
                  <button
                    type="button"
                    onClick={() => setValue(field.id, "")}
                    className="text-red-500 text-lg leading-none px-1"
                    aria-label={`Remove ${field.label}`}
                  >
                    &times;
                  </button>
                </div>
              ) : null}
            </div>
            {error && (
              <span className="fb-error" role="alert">
                {error}
              </span>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <form className="fb-form" onSubmit={submit} noValidate>
      {serverError && (
        <div className="fb-server-error" role="alert">
          {serverError}
        </div>
      )}

      {settings.ratingEnabled && (
        <div className={`fb-field${errors.rating ? " fb-field--error" : ""}`}>
          <label className="fb-label">
            {settings.ratingLabel}{" "}
            <span className="fb-req" aria-hidden="true">
              *
            </span>
          </label>
          <div className="fb-stars" role="group" aria-label="Star rating">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                className={`fb-star${rating >= star ? " fb-star--filled" : ""}`}
                onClick={() => setRating(star)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                aria-pressed={rating >= star}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
          {errors.rating && (
            <span className="fb-error" role="alert">
              {errors.rating}
            </span>
          )}
        </div>
      )}

      {visibleFields.map(renderField)}

      {settings.allowAnonymous && (
        <div className="fb-field fb-field--inline">
          <label className="fb-toggle" htmlFor="fb-anon">
            <input
              id="fb-anon"
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <span className="fb-toggle__track" aria-hidden="true" />
            {settings.anonymousLabel || "Submit anonymously"}
          </label>
          <span className="fb-toggle-hint">{settings.anonymousHint}</span>
        </div>
      )}

      <button
        type="submit"
        className="fb-btn fb-btn-primary fb-btn-lg"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
      >
        {status === "submitting" ? (
          "Sending…"
        ) : (
          <>
            {settings.submitLabel} <SendIcon />
          </>
        )}
      </button>
    </form>
  );
}
