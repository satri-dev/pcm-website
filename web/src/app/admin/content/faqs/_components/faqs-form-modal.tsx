"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Faq } from "@/types/faqs";
import { Save, X } from "lucide-react";
import RichTextEditor from "../../../_components/editor/rich-text-editor";

const faqSchema = z.object({
  question: z
    .string()
    .min(3, "Question must be at least 3 characters")
    .max(200),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required").max(100),
  answer: z.string().min(1, "Answer is required").max(5000),
});

type FaqSchema = z.infer<typeof faqSchema>;

interface FaqsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: Faq | null;
  onSave: (faq: Faq) => void;
  saving?: boolean;
}

export default function FaqsFormModal({
  open,
  onOpenChange,
  faq,
  onSave,
  saving = false,
}: FaqsFormModalProps) {
  const [answerHtml, setAnswerHtml] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FaqSchema>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      slug: "",
      category: "General",
      answer: "",
    },
  });

  const titleValue = watch("question");
  useEffect(() => {
    if (!faq && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 100)
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, faq, setValue]);

  useEffect(() => {
    if (faq) {
      reset({
        question: faq.question,
        slug: faq.slug,
        category: faq.category,
        answer: faq.answer,
      });
      setAnswerHtml(faq.answer);
    } else {
      reset({
        question: "",
        slug: "",
        category: "General",
        answer: "",
      });
      setAnswerHtml("");
    }
  }, [faq, reset, open]);

  const onSubmit = async (data: FaqSchema) => {
    const faqData: Faq = {
      id: faq?.id || `faq-${Date.now()}`,
      question: data.question,
      slug: data.slug,
      category: data.category,
      answer: data.answer,
      createdAt: faq?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(faqData);
  };

  const fieldValue = (key: keyof FaqSchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {faq ? "Edit FAQ" : "Add FAQ"}
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <div className="form-grid">
              <div className={fieldValue("question")}>
                <label htmlFor="faq-question">
                  Question <span className="req">*</span>
                </label>
                <input
                  id="faq-question"
                  type="text"
                  {...register("question")}
                  placeholder="e.g. What scholarships are available?"
                />
                {errors.question && (
                  <div className="field__err">{errors.question.message}</div>
                )}
              </div>

              <div className={fieldValue("category")}>
                <label htmlFor="faq-category">
                  Category <span className="req">*</span>
                </label>
                <input 
                  id="faq-category"
                  type="text"
                  {...register("category")}
                  placeholder="e.g. Admission, Scholarship, Programs..."
                />
                {errors.category && (
                  <div className="field__err">{errors.category.message}</div>
                )}
              </div>

              <div
                className={`field field--full ${
                  errors.answer ? "is-invalid" : ""
                }`}
              >
                <label>
                  Answer <span className="req">*</span>
                </label>
                <RichTextEditor
                  content={answerHtml}
                  onChange={(html) => {
                    setAnswerHtml(html);
                    setValue("answer", html);
                  }}
                  placeholder="Write the answer..."
                />
                {errors.answer && (
                  <div className="field__err">{errors.answer.message}</div>
                )}
              </div>
            </div>
          </div>

          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
            >
              <Save size={16} />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
