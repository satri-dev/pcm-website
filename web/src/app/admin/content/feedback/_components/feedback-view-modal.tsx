"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Feedback, FeedbackValue } from "@/types/feedback";
import type { FeedbackFieldConfig } from "@/types/feedback-page-settings";
import {
  CalendarDays,
  FileText,
  Star,
  X,
  MessageSquare,
  EyeOff,
  User,
} from "lucide-react";

interface FeedbackViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: Feedback | null;
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RatingStars({ value }: { value: number }) {
  const stars: React.ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={16}
        className={
          i <= value ? "text-amber-400 fill-amber-400" : "text-gray-300"
        }
      />,
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

function ValueChips({ values }: { values: string[] }) {
  if (!values || values.length === 0) return <span className="muted">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v, i) => (
        <span key={i} className="badge badge--blue">
          {v}
        </span>
      ))}
    </div>
  );
}

function isImageUrl(value: string) {
  // Check if it's a URL with a clear image extension
  return (
    (value.startsWith("http://") || value.startsWith("https://")) &&
    value.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) !== null
  );
}

function getFilenameFromUrl(url: string): string {
  try {
    // Extract the pathname and remove query params
    const cleanUrl = url.split("?")[0];
    const parts = cleanUrl.split("/");
    const filename = parts[parts.length - 1];
    return decodeURIComponent(filename);
  } catch {
    return "Download file";
  }
}

function getUrlAndFilename(
  value: FeedbackValue,
): { url: string; filename: string } | null {
  // Handle new format: { url: string, filename: string }
  if (typeof value === "object" && value !== null && "url" in value) {
    return {
      url: String((value as any).url),
      filename: String((value as any).filename || "file"),
    };
  }
  // Handle legacy format: just the URL string
  if (
    typeof value === "string" &&
    (value.startsWith("http://") || value.startsWith("https://"))
  ) {
    return {
      url: value,
      filename: getFilenameFromUrl(value),
    };
  }
  return null;
}

function FieldRow({
  field,
  value,
}: {
  field: FeedbackFieldConfig;
  value: FeedbackValue;
}) {
  let display: React.ReactNode;

  if (value === undefined || value === null || value === "") {
    display = <span className="muted">—</span>;
  } else if (typeof value === "boolean") {
    display = value ? "Yes" : "No";
  } else if (Array.isArray(value)) {
    display = <ValueChips values={value.map(String)} />;
  } else if (
    field.type === "rating" ||
    (field.type === "number" &&
      field.min === 1 &&
      field.max === 5 &&
      Number(value) >= 1 &&
      Number(value) <= 5)
  ) {
    display = <RatingStars value={Number(value)} />;
  } else {
    // Check if it's a file/image upload (new format or legacy string URL)
    const fileData = getUrlAndFilename(value);
    if (fileData) {
      const isImage = isImageUrl(fileData.url);
      if (isImage) {
        // It's an image - show preview
        display = (
          <div className="flex items-center gap-3">
            <img
              src={fileData.url}
              alt={field.label}
              className="h-20 w-20 object-cover rounded border border-gray-200"
            />
            <a
              href={fileData.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[var(--admin-brand)] hover:underline break-all"
            >
              View full size
            </a>
          </div>
        );
      } else {
        // It's a file - show filename
        display = (
          <a
            href={fileData.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--admin-brand)] hover:underline"
          >
            <FileText size={14} className="shrink-0 text-gray-400" />
            <span className="break-all">{fileData.filename}</span>
          </a>
        );
      }
    } else if (typeof value === "string" && value.startsWith("/")) {
      // Relative URL
      display = (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--admin-brand)] break-all hover:underline"
        >
          <FileText size={14} className="shrink-0 text-gray-400" />
          {value.split(/[?#]/)[0].split("/").pop() || value}
        </a>
      );
    } else {
      display = String(value);
    }
  }

  return (
    <div className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-1 py-2 border-b border-[var(--admin-line)] last:border-b-0">
      <dt className="m-0 font-semibold text-[var(--admin-muted)] text-sm">
        {field.label}
      </dt>
      <dd className="m-0 break-words text-sm text-[var(--admin-ink)]">
        {display}
      </dd>
    </div>
  );
}

export default function FeedbackViewModal({
  open,
  onOpenChange,
  feedback,
}: FeedbackViewModalProps) {
  if (!feedback) return null;

  const schema = feedback.fieldSchema ?? [];
  const fields = feedback.fields ?? {};

  // Build a lookup so values can be matched to their config even if the
  // schema changed order. Fall back to the configured schema order below.
  const configById = new Map(schema.map((f) => [f.id, f]));
  const rendered = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([id, value]) => {
      const field =
        configById.get(id) ??
        ({
          id,
          label: id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          type: "text",
          required: false,
        } satisfies FeedbackFieldConfig);
      return { field, value };
    });

  const hasName = typeof fields.name === "string" && fields.name.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="apps-modal w-[min(100%,720px)] sm:max-w-[720px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Head */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <MessageSquare size={18} />
            Feedback Details
          </DialogTitle>
          <button
            type="button"
            className="admin-icon-btn"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {feedback.anonymous ? (
              <span className="badge badge--gray lowercase">Anonymous</span>
            ) : (
              <span className="badge badge--green lowercase">Identified</span>
            )}
            <span className="badge badge--blue uppercase">
              {schema.length > 0
                ? `${schema.length} field${schema.length === 1 ? "" : "s"}`
                : "No schema"}
            </span>
          </div>

          <h3 className="m-0 mb-1 text-xl font-bold text-[var(--admin-ink)] flex items-center gap-2">
            {feedback.anonymous ? (
              <>
                <EyeOff size={20} className="text-[var(--admin-muted)]" />
                Anonymous Feedback
              </>
            ) : (
              <>
                <User size={20} className="text-[var(--admin-muted)]" />
                {hasName ? String(fields.name) : "Feedback Submission"}
              </>
            )}
          </h3>
          <p className="m-0 mb-4 text-sm text-[var(--admin-muted)] flex items-center gap-1.5">
            <CalendarDays size={14} />
            Submitted {formatDate(feedback.createdAt)}
          </p>

          {feedback.anonymous && hasName && (
            <div className="mb-4">
              <span className="badge badge--gold">
                Name supplied but marked anonymous
              </span>
            </div>
          )}

          {rendered.length > 0 ? (
            <dl className="m-0">
              {rendered.map(({ field, value }) => (
                <FieldRow key={field.id} field={field} value={value} />
              ))}
            </dl>
          ) : (
            <p className="m-0 text-sm text-[var(--admin-muted)]">
              No feedback fields submitted.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="modal__foot">
          <button
            type="button"
            className="admin-btn"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
