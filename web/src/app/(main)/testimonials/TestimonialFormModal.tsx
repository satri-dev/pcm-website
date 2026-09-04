"use client";

import { useState } from "react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import RichTextEditor from "@/app/admin/_components/editor/rich-text-editor";
import { X, Upload, CheckCircle2, Loader2 } from "lucide-react";
import type { TestimonialFormCopy } from "@/types/testimonial-page-settings";

interface TestimonialFormModalProps {
  open: boolean;
  onClose: () => void;
  copy: TestimonialFormCopy;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function TestimonialFormModal({
  open,
  onClose,
  copy,
}: TestimonialFormModalProps) {
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [position, setPosition] = useState("");
  const [program, setProgram] = useState("");
  const [photo, setPhoto] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  if (!open) return null;

  const reset = () => {
    setName("");
    setBatch("");
    setPosition("");
    setProgram("");
    setPhoto("");
    setContent("");
    setStatus("idle");
    setServerError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setServerError(copy.requiredName);
      setStatus("error");
      return;
    }
    if (!content.trim()) {
      setServerError(copy.requiredContent);
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          batch,
          position,
          program,
          photo,
          content,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setServerError(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setServerError(copy.submitError);
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add testimonial"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#111827] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="m-0 text-xl font-bold text-[#16285B] dark:text-white">
              {copy.modalTitle}
            </h3>
            <p className="m-0 mt-1 text-sm text-slate-500 dark:text-slate-400">
              {copy.modalDescription}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              onClose();
              reset();
            }}
            className="shrink-0 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CheckCircle2 size={48} className="mb-4 text-green-500" />
            <h4 className="m-0 text-lg font-bold text-[#16285B] dark:text-white">
              {copy.successTitle}
            </h4>
            <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              {copy.successText}
            </p>
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="mt-6 rounded-xl bg-[#16285B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e3a7a]"
            >
              {copy.successDone}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            {status === "error" && serverError && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {serverError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {copy.nameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prabhat Adhikari"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4167C9] focus:ring-2 focus:ring-[#4167C9]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {copy.programLabel}
                </label>
                <input
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  placeholder="e.g. BBA / BCSIT"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4167C9] focus:ring-2 focus:ring-[#4167C9]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {copy.batchLabel}
                </label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g. 2080"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4167C9] focus:ring-2 focus:ring-[#4167C9]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {copy.positionLabel}
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#4167C9] focus:ring-2 focus:ring-[#4167C9]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {copy.photoLabel}
              </label>
              <div className="flex items-center gap-3">
                {photo ? (
                  <>
                    <img
                      src={photo}
                      alt="Profile preview"
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-[#4167C9]/40"
                    />
                    <button
                      type="button"
                      onClick={() => setPhoto("")}
                      className="text-sm text-red-500 hover:underline"
                    >
                      {copy.removePhotoLabel}
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">{copy.noPhotoText}</span>
                )}
                <ImageUpload
                  className="inline-flex items-center gap-2 rounded-lg bg-[#16285B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1e3a7a]"
                  onUpload={(r) => setPhoto(r.secure_url)}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {copy.contentLabel} <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Tell us about your experience at PCM..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  reset();
                }}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {copy.cancelLabel}
              </button>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center gap-2 rounded-xl bg-[#16285B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e3a7a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {copy.submittingLabel}
                  </>
                ) : (
                  <>
                    <Upload size={15} />
                    {copy.submitLabel}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
