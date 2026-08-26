"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ChatbotEntry,
  ChatbotChannel,
  CHATBOT_CHANNELS,
} from "../types/chatbot";
import { Save, X, Plus } from "lucide-react";
import RichTextEditor from "../../../_components/editor/rich-text-editor";

const chatbotSchema = z.object({
  channel: z.enum(CHATBOT_CHANNELS as unknown as [string, ...string[]]),
  question: z.string().min(3, "Question must be at least 3 characters").max(300),
  keywords: z
    .array(z.string())
    .min(1, "At least one keyword is required"),
  answer: z.string().min(1, "Answer is required").max(10000),
  active: z.boolean(),
});

type ChatbotSchema = z.infer<typeof chatbotSchema>;

interface ChatbotFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: ChatbotEntry | null;
  onSave: (entry: ChatbotEntry) => void;
  saving?: boolean;
}

export default function ChatbotFormModal({
  open,
  onOpenChange,
  entry,
  onSave,
  saving = false,
}: ChatbotFormModalProps) {
  const [answerHtml, setAnswerHtml] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<ChatbotSchema>({
    resolver: zodResolver(chatbotSchema),
    defaultValues: {
      channel: "General",
      question: "",
      keywords: [],
      answer: "",
      active: true,
    },
  });

  const keywordsValue = watch("keywords");

  useEffect(() => {
    if (entry) {
      reset({
        channel: entry.channel,
        question: entry.question,
        keywords: entry.keywords,
        answer: entry.answer,
        active: entry.active,
      });
      setAnswerHtml(entry.answer);
      setKeywordInput(entry.keywords.join(", "));
    } else {
      reset({
        channel: "General",
        question: "",
        keywords: [],
        answer: "",
        active: true,
      });
      setAnswerHtml("");
      setKeywordInput("");
    }
  }, [entry, reset, open]);

  const handleAddKeywords = () => {
    const newKeywords = keywordInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0 && !keywordsValue.includes(k));
    if (newKeywords.length > 0) {
      setValue("keywords", [...keywordsValue, ...newKeywords], {
        shouldValidate: true,
      });
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setValue(
      "keywords",
      keywordsValue.filter((k) => k !== keyword),
      { shouldValidate: true }
    );
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeywords();
    }
  };

  const onSubmit = async (data: ChatbotSchema) => {
    const entryData: ChatbotEntry = {
      id: entry?.id || `chatbot-${Date.now()}`,
      channel: data.channel as ChatbotChannel,
      question: data.question,
      keywords: data.keywords,
      answer: data.answer,
      active: data.active,
      createdAt: entry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await onSave(entryData);
  };

  const fieldValue = (key: keyof ChatbotSchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {entry ? "Edit Chatbot Entry" : "Add Chatbot Entry"}
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
              {/* Channel */}
              <div className={fieldValue("channel")}>
                <label htmlFor="chatbot-channel">
                  Channel <span className="req">*</span>
                </label>
                <select id="chatbot-channel" {...register("channel")}>
                  {CHATBOT_CHANNELS.map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </select>
                {errors.channel && (
                  <div className="field__err">{errors.channel.message}</div>
                )}
              </div>

              {/* Active toggle */}
              <div className={fieldValue("active")}>
                <label>Status</label>
                <label className="switch">
                  <input type="checkbox" {...register("active")} />
                  <span className="track" />
                </label>
                <span className="text-sm text-[var(--admin-muted)] ml-2">
                  {watch("active") ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Question */}
              <div className={`field field--full ${fieldValue("question")}`}>
                <label htmlFor="chatbot-question">
                  Question <span className="req">*</span>
                </label>
                <input
                  id="chatbot-question"
                  type="text"
                  {...register("question")}
                  placeholder="e.g. What are the admission requirements?"
                />
                {errors.question && (
                  <div className="field__err">{errors.question.message}</div>
                )}
              </div>

              {/* Keywords */}
              <div className={`field field--full ${fieldValue("keywords")}`}>
                <label>
                  Keywords <span className="req">*</span>
                  <span className="text-[0.75rem] text-[var(--admin-muted)] font-normal ml-2">
                    (Comma-separated words the chatbot matches against)
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder="e.g. admission, requirements, apply"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm"
                    onClick={handleAddKeywords}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                {keywordsValue.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {keywordsValue.map((kw) => (
                      <span
                        key={kw}
                        className="badge badge--gray flex items-center gap-1"
                      >
                        {kw}
                        <button
                          type="button"
                          className="ml-0.5 hover:text-[var(--admin-red)] cursor-pointer"
                          onClick={() => handleRemoveKeyword(kw)}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.keywords && (
                  <div className="field__err">{errors.keywords.message}</div>
                )}
              </div>

              {/* Answer */}
              <div className={`field field--full ${errors.answer ? "is-invalid" : ""}`}>
                <label>
                  Answer <span className="req">*</span>
                </label>
                <RichTextEditor
                  content={answerHtml}
                  onChange={(html) => {
                    setAnswerHtml(html);
                    setValue("answer", html);
                  }}
                  placeholder="Write the chatbot answer..."
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
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
