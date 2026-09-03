"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Survey,
  SurveyQuestion,
  QuestionType,
  ConditionOperator,
  SURVEY_CATEGORIES,
  OPTION_TYPES,
  VISIBLE_PARENT_TYPES,
} from "@/types/surveys";
import {
  Save,
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  GitBranch,
  Layers,
} from "lucide-react";
import RichTextEditor from "../../../_components/editor/rich-text-editor";

const surveySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(1, "This field is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(1, "This field is required").max(1000, "Excerpt too long"),
  content: z.string().optional(),
  category: z.string().min(1, "This field is required").max(100),
  icon: z.string().min(1, "Icon is required").max(10),
  endsOn: z.string().min(1, "This field is required"),
  status: z.enum(["published", "draft"]),
  featured: z.boolean(),
  tags: z.string().optional(),
});

type SurveySchema = z.infer<typeof surveySchema>;

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "text", label: "Short Answer" },
  { value: "textarea", label: "Paragraph" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "url", label: "URL / Link" },
  { value: "radio", label: "Multiple Choice" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "select", label: "Dropdown" },
  { value: "rating", label: "Rating (Stars)" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "section", label: "Section Header" },
  { value: "description", label: "Description" },
  { value: "group", label: "Group (Nested Fields)" },
];

const CONDITION_OPERATORS: { value: ConditionOperator; label: string }[] = [
  { value: "equals", label: "is equal to" },
  { value: "notEquals", label: "is not equal to" },
  { value: "contains", label: "contains" },
  { value: "notContains", label: "does not contain" },
  { value: "in", label: "is one of" },
  { value: "notIn", label: "is none of" },
  { value: "empty", label: "is empty" },
  { value: "notEmpty", label: "is not empty" },
];

const EMOJI_OPTIONS = ["🎓", "🏛️", "💼", "📊", "🎯", "📚", "🧪", "🎨", "🌐", "⭐", "📝", "🔍", "💡", "🏆", "📋"];

interface SurveysFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  survey: Survey | null;
  onSave: (survey: Survey) => void;
  saving?: boolean;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function uid(prefix = "q") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyQuestion(type: QuestionType = "text"): SurveyQuestion {
  const q: SurveyQuestion = {
    id: uid(),
    type,
    label: "",
    hint: "",
    required: false,
  };
  if (OPTION_TYPES.includes(type)) q.options = ["Option 1"];
  if (type === "rating") q.maxRating = 5;
  if (type === "group") q.children = [];
  return q;
}

// Recursively count every question (including nested children) that has a label.
function countQuestions(list: SurveyQuestion[] | undefined): number {
  if (!list) return 0;
  return list.reduce((acc, q) => {
    const self = q.label.trim() !== "" ? 1 : 0;
    return acc + self + countQuestions(q.children);
  }, 0);
}

function flattenQuestions(list: SurveyQuestion[] | undefined, out: SurveyQuestion[] = []): SurveyQuestion[] {
  if (!list) return out;
  for (const q of list) {
    out.push(q);
    if (q.children) flattenQuestions(q.children, out);
  }
  return out;
}

// --- Recursive immutable update helpers ---

function updateNode(
  list: SurveyQuestion[],
  id: string,
  fn: (q: SurveyQuestion) => SurveyQuestion
): SurveyQuestion[] {
  return list.map((q) => {
    if (q.id === id) return fn(q);
    if (q.children) return { ...q, children: updateNode(q.children, id, fn) };
    return q;
  });
}

function removeNode(list: SurveyQuestion[], id: string): SurveyQuestion[] {
  const filtered = list.filter((q) => q.id !== id);
  return filtered.map((q) =>
    q.children ? { ...q, children: removeNode(q.children, id) } : q
  );
}

function insertNode(
  list: SurveyQuestion[],
  parentId: string | null,
  afterId: string | null,
  node: SurveyQuestion
): SurveyQuestion[] {
  if (parentId === null) {
    // Insert at the top level
    if (afterId === null) return [...list, node];
    const idx = list.findIndex((q) => q.id === afterId);
    const next = [...list];
    next.splice(idx + 1, 0, node);
    return next;
  }
  return list.map((q) => {
    if (q.id === parentId) {
      const children = q.children ?? [];
      if (afterId === null) return { ...q, children: [...children, node] };
      const idx = children.findIndex((c) => c.id === afterId);
      const next = [...children];
      next.splice(idx + 1, 0, node);
      return { ...q, children: next };
    }
    if (q.children) return { ...q, children: insertNode(q.children, parentId, afterId, node) };
    return q;
  });
}

function moveNode(list: SurveyQuestion[], id: string, direction: "up" | "down"): SurveyQuestion[] {
  const swap = (arr: SurveyQuestion[]): SurveyQuestion[] | null => {
    const idx = arr.findIndex((q) => q.id === id);
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || newIdx < 0 || newIdx >= arr.length) return null;
    const next = [...arr];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    return next;
  };

  const tryList = (list: SurveyQuestion[]): SurveyQuestion[] => {
    const swapped = swap(list);
    if (swapped) return swapped;
    return list.map((q) =>
      q.children ? { ...q, children: tryList(q.children) } : q
    );
  };
  return tryList(list);
}

export default function SurveysFormModal({
  open,
  onOpenChange,
  survey,
  onSave,
  saving = false,
}: SurveysFormModalProps) {
  const [excerptHtml, setExcerptHtml] = useState("");
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SurveySchema>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Academic",
      icon: "🎓",
      endsOn: todayISO(),
      status: "draft",
      featured: false,
      tags: "",
    },
  });

  const icon = watch("icon");
  const titleValue = watch("title");
  const endsOn = watch("endsOn");

  // Auto-generate slug from title
  useEffect(() => {
    if (!survey && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 100)
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, survey, setValue]);

  // Load survey data when editing
  useEffect(() => {
    if (survey) {
      reset({
        title: survey.title,
        slug: survey.slug,
        excerpt: survey.excerpt,
        content: survey.content,
        category: survey.category,
        icon: survey.icon,
        endsOn: survey.endsOn || todayISO(),
        status: survey.status,
        featured: survey.featured,
        tags: survey.tags?.join(", ") || "",
      });
      setExcerptHtml(survey.excerpt);
      setQuestions(survey.questions || []);
    } else {
      reset({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Academic",
        icon: "🎓",
        endsOn: todayISO(),
        status: "draft",
        featured: false,
        tags: "",
      });
      setExcerptHtml("");
      setQuestions([]);
    }
    setExpandedQuestion(null);
  }, [survey, reset, open]);

  // --- Question management ---
  const addSubQuestion = useCallback((parentId: string) => {
    const node = createEmptyQuestion("text");
    setQuestions((prev) => insertNode(prev, parentId, null, node));
    setExpandedQuestion(node.id);
  }, []);

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => removeNode(prev, id));
  }, []);

  const updateQuestion = useCallback((id: string, patch: Partial<SurveyQuestion>) => {
    setQuestions((prev) =>
      updateNode(prev, id, (q) => ({ ...q, ...patch }))
    );
  }, []);

  const moveQuestion = useCallback((id: string, direction: "up" | "down") => {
    setQuestions((prev) => moveNode(prev, id, direction));
  }, []);

  const addOption = useCallback((questionId: string) => {
    setQuestions((prev) =>
      updateNode(prev, questionId, (q) => ({
        ...q,
        options: [...(q.options || []), ""],
      }))
    );
  }, []);

  const updateOption = useCallback((questionId: string, optionIndex: number, value: string) => {
    setQuestions((prev) =>
      updateNode(prev, questionId, (q) => ({
        ...q,
        options: (q.options || []).map((opt, i) => (i === optionIndex ? value : opt)),
      }))
    );
  }, []);

  const removeOption = useCallback((questionId: string, optionIndex: number) => {
    setQuestions((prev) =>
      updateNode(prev, questionId, (q) => ({
        ...q,
        options: (q.options || []).filter((_, i) => i !== optionIndex),
      }))
    );
  }, []);

  const onSubmit = async (data: SurveySchema) => {
    const surveyData: Survey = {
      id: survey?.id || `survey-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content || "",
      category: data.category,
      icon: data.icon,
      status: data.status,
      featured: data.featured,
      timeToRead: Math.max(1, Math.ceil((countQuestions(questions) * 30) / 60)),
      endsOn: data.endsOn || undefined,
      questions,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      seo: survey?.seo,
      createdAt: survey?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(surveyData);
  };

  const fieldValue = (key: keyof SurveySchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="surveys-modal w-[min(100%,780px)] sm:max-w-[780px] max-h-[92vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Head */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {survey ? "Edit Survey" : "Add Survey"}
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
          {/* Body */}
          <div className="modal__body">
            {/* Details Section */}
            <div className="form-section">
              <b>Details</b>
            </div>

            <div className="form-grid">
              <div className={fieldValue("title")}>
                <label htmlFor="survey-title">
                  Title <span className="req">*</span>
                </label>
                <input id="survey-title" type="text" {...register("title")} />
                {errors.title && (
                  <div className="field__err">{errors.title.message}</div>
                )}
              </div>

              <div className={fieldValue("slug")}>
                <label htmlFor="survey-slug">
                  Slug <span className="req">*</span>
                </label>
                <input id="survey-slug" type="text" {...register("slug")} />
                {errors.slug && (
                  <div className="field__err">{errors.slug.message}</div>
                )}
              </div>

              <div className={fieldValue("category")}>
                <label htmlFor="survey-category">
                  Category <span className="req">*</span>
                </label>
                <input
                  id="survey-category"
                  type="text"
                  placeholder="e.g., Academic, Facilities..."
                  {...register("category")}
                  list="survey-categories"
                />
                <datalist id="survey-categories">
                  {SURVEY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                {errors.category && (
                  <div className="field__err">{errors.category.message}</div>
                )}
              </div>

              <div className={fieldValue("icon")}>
                <label>
                  Icon <span className="req">*</span>
                </label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`text-xl p-1.5 rounded border ${
                        icon === emoji
                          ? "border-[var(--admin-brand)] bg-[var(--admin-brand)]/10"
                          : "border-[var(--admin-line)] hover:border-[var(--admin-brand)]"
                      }`}
                      onClick={() => setValue("icon", emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register("icon")} />
                {errors.icon && (
                  <div className="field__err">{errors.icon.message}</div>
                )}
              </div>

              <div className={fieldValue("endsOn")}>
                <label htmlFor="survey-endsOn">
                  Ends On <span className="req">*</span>
                </label>
                <input
                  id="survey-endsOn"
                  type="date"
                  {...register("endsOn")}
                  min={todayISO()}
                />
                {errors.endsOn && (
                  <div className="field__err">{errors.endsOn.message}</div>
                )}
              </div>

              <div className="field">
                <label>Questions</label>
                <input
                  type="text"
                  value={`${countQuestions(questions)} questions (~${Math.max(1, Math.ceil((countQuestions(questions) * 30) / 60))} min)`}
                  disabled
                  className="bg-[var(--admin-surface-2)]"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="form-section mt-4">
              <b>Content</b>
            </div>

            <div
              className={`field field--full ${
                errors.excerpt ? "is-invalid" : ""
              }`}
            >
              <label htmlFor="survey-excerpt">Excerpt</label>
              <RichTextEditor
                content={excerptHtml}
                onChange={(html) => {
                  setExcerptHtml(html);
                  setValue("excerpt", html);
                }}
                placeholder="Brief summary of the survey..."
              />
              {errors.excerpt && (
                <div className="field__err">{errors.excerpt.message}</div>
              )}
            </div>

            {/* Publishing Section */}
            <div className="form-section mt-4">
              <b>Publishing</b>
            </div>

            <div className="form-grid">
              <div className="field">
                <label>Featured</label>
                <label className="switch">
                  <input type="checkbox" {...register("featured")} />
                  <span className="track"></span>
                </label>
              </div>

              <div className={fieldValue("status")}>
                <label htmlFor="survey-status">Status</label>
                <select id="survey-status" {...register("status")}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                {errors.status && (
                  <div className="field__err">{errors.status.message}</div>
                )}
              </div>

              <div className="field">
                <label htmlFor="survey-tags">Tags</label>
                <input
                  id="survey-tags"
                  type="text"
                  placeholder="Comma-separated tags..."
                  {...register("tags")}
                />
              </div>
            </div>

            {/* Questionnaire Builder Section */}
            <div className="form-section mt-6">
              <b>Questionnaire Builder</b>
              <p className="text-xs text-[var(--admin-muted)] font-normal mt-1">
                Build your survey. Use <b>Group</b> to nest fields inside a
                field, and set visibility rules to show questions based on
                previous answers.
              </p>
            </div>

            <div className="space-y-3">
              {questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  index={index}
                  depth={0}
                  allQuestions={flattenQuestions(questions)}
                  isExpanded={expandedQuestion === question.id}
                  onToggle={() =>
                    setExpandedQuestion(
                      expandedQuestion === question.id ? null : question.id
                    )
                  }
                  onUpdate={(patch) => updateQuestion(question.id, patch)}
                  onRemove={() => removeQuestion(question.id)}
                  onMoveUp={() => moveQuestion(question.id, "up")}
                  onMoveDown={() => moveQuestion(question.id, "down")}
                  onAddOption={() => addOption(question.id)}
                  onUpdateOption={(optIdx, value) =>
                    updateOption(question.id, optIdx, value)
                  }
                  onRemoveOption={(optIdx) => removeOption(question.id, optIdx)}
                  addSubQuestion={addSubQuestion}
                />
              ))}

              {/* Add-question button (pick type later in the Field Type dropdown) */}
              <button
                type="button"
                className="admin-btn admin-btn--primary w-full"
                onClick={() => {
                  const node = createEmptyQuestion("text");
                  setQuestions((prev) => insertNode(prev, null, null, node));
                  setExpandedQuestion(node.id);
                }}
              >
                <Plus size={16} />
                Add Question
              </button>
            </div>
          </div>

          {/* Footer */}
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

// --- Recursive Question Editor ---

interface QuestionEditorProps {
  question: SurveyQuestion;
  index: number;
  depth: number;
  allQuestions: SurveyQuestion[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<SurveyQuestion>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddOption: () => void;
  onUpdateOption: (index: number, value: string) => void;
  onRemoveOption: (index: number) => void;
  addSubQuestion: (parentId: string) => void;
}

function QuestionEditor({
  question,
  index,
  depth,
  allQuestions,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  addSubQuestion,
}: QuestionEditorProps) {
  const [expandedChildren, setExpandedChildren] = useState<Set<string>>(
    () => new Set()
  );

  const toggleChildExpanded = useCallback((childId: string) => {
    setExpandedChildren((prev) => {
      const next = new Set(prev);
      if (next.has(childId)) next.delete(childId);
      else next.add(childId);
      return next;
    });
  }, []);

  const typeLabel =
    QUESTION_TYPES.find((t) => t.value === question.type)?.label || question.type;
  const hasOptions = OPTION_TYPES.includes(question.type);
  const isGroup = question.type === "group";
  const children = question.children ?? [];

  // Candidate parent questions = all questions earlier in the flattened list
  // that can produce a discrete value (a parent must appear before this one).
  const idxInAll = allQuestions.findIndex((q) => q.id === question.id);
  const parentCandidates = allQuestions
    .filter((q) => q.id !== question.id)
    .filter((q) => VISIBLE_PARENT_TYPES.includes(q.type))
    .filter((q, qi) => allQuestions.indexOf(q) < idxInAll);

  // Child CRUD handlers operate on this node's `children`, applied through
  // `onUpdate({ children })` so the whole nested structure stays immutable.
  const childHandleUpdate = useCallback(
    (childId: string, patch: Partial<SurveyQuestion>) => {
      onUpdate({ children: updateChild(children, childId, (c) => ({ ...c, ...patch })) });
    },
    [children, onUpdate]
  );
  const childHandleMove = useCallback(
    (childId: string, dir: "up" | "down") => {
      onUpdate({ children: childMove(children, childId, dir) });
    },
    [children, onUpdate]
  );
  const childHandleRemove = useCallback(
    (childId: string) => {
      onUpdate({ children: childRemove(children, childId) });
    },
    [children, onUpdate]
  );
  const childHandleAddOption = useCallback(
    (childId: string) => {
      onUpdate({
        children: updateChild(children, childId, (c) => ({
          ...c,
          options: [...(c.options || []), ""],
        })),
      });
    },
    [children, onUpdate]
  );
  const childHandleUpdateOption = useCallback(
    (childId: string, optIdx: number, value: string) => {
      onUpdate({
        children: updateChild(children, childId, (c) => ({
          ...c,
          options: (c.options || []).map((o, i) => (i === optIdx ? value : o)),
        })),
      });
    },
    [children, onUpdate]
  );
  const childHandleRemoveOption = useCallback(
    (childId: string, optIdx: number) => {
      onUpdate({
        children: updateChild(children, childId, (c) => ({
          ...c,
          options: (c.options || []).filter((_, i) => i !== optIdx),
        })),
      });
    },
    [children, onUpdate]
  );

  return (
    <div
      className={`border border-[var(--admin-line)] rounded-lg overflow-hidden bg-white ${
        isGroup ? "border-[var(--admin-brand)]/40" : ""
      }`}
      style={{ marginLeft: depth * 16 }}
    >
      {/* Collapsed Header */}
      <div
        className="flex items-center gap-3 p-3 bg-[var(--admin-surface-2)] cursor-pointer hover:bg-[var(--admin-surface)] transition-colors"
        onClick={onToggle}
      >
        <GripVertical size={16} className="text-[var(--admin-muted)] cursor-grab" />
        <span className="text-xs font-bold text-[var(--admin-muted)]">
          {depth === 0 ? `Q${index + 1}` : `Sub`}
        </span>
        {isGroup && (
          <span className="text-[var(--admin-brand)]">
            <Layers size={14} />
          </span>
        )}
        <span className="text-sm font-medium flex-1 truncate">
          {question.label || `Untitled ${typeLabel}`}
        </span>
        <span className="text-xs text-[var(--admin-muted)] bg-[var(--admin-surface)] px-2 py-0.5 rounded flex items-center gap-1">
          {typeLabel}
          {question.visibility && (
            <GitBranch size={11} className="text-[var(--admin-brand)]" />
          )}
        </span>
        {question.required && (
          <span className="text-xs text-[var(--admin-red)]">Required</span>
        )}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="admin-icon-btn"
            onClick={onMoveUp}
            disabled={index === 0}
            title="Move up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            className="admin-icon-btn"
            onClick={onMoveDown}
            title="Move down"
          >
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className="admin-icon-btn text-[var(--admin-red)]"
            onClick={onRemove}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Expanded Editor */}
      {isExpanded && (
        <div className="p-4 space-y-3 border-t border-[var(--admin-line)]">
          <div className="form-grid">
            <div className="field field--full">
              <label>
                {isGroup ? "Group Label" : "Question Label"} <span className="req">*</span>
              </label>
              <input
                type="text"
                value={question.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder={
                  isGroup ? "e.g., Contact Information" : "Enter your question..."
                }
              />
            </div>

            <div className="field">
              <label>Field Type</label>
              <select
                value={question.type}
                onChange={(e) => {
                  const newType = e.target.value as QuestionType;
                  const patch: Partial<SurveyQuestion> = { type: newType };
                  if (OPTION_TYPES.includes(newType)) {
                    patch.options = question.options?.length
                      ? question.options
                      : ["Option 1"];
                  }
                  if (newType === "group") {
                    patch.children = question.children ?? [];
                  }
                  onUpdate(patch);
                }}
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Hint / Description</label>
              <input
                type="text"
                value={question.hint || ""}
                onChange={(e) => onUpdate({ hint: e.target.value })}
                placeholder="Optional helper text..."
              />
            </div>

            {/* Placeholder for input-like types */}
            {["text", "textarea", "email", "phone", "url"].includes(question.type) && (
              <div className="field">
                <label>Placeholder</label>
                <input
                  type="text"
                  value={question.placeholder || ""}
                  onChange={(e) => onUpdate({ placeholder: e.target.value })}
                  placeholder="e.g., Enter your name..."
                />
              </div>
            )}

            {/* Min/Max for number */}
            {question.type === "number" && (
              <>
                <div className="field">
                  <label>Min Value</label>
                  <input
                    type="number"
                    value={question.min ?? ""}
                    onChange={(e) =>
                      onUpdate({
                        min: e.target.value === "" ? undefined : Number(e.target.value),
                      })
                    }
                    placeholder="Optional"
                  />
                </div>
                <div className="field">
                  <label>Max Value</label>
                  <input
                    type="number"
                    value={question.max ?? ""}
                    onChange={(e) =>
                      onUpdate({
                        max: e.target.value === "" ? undefined : Number(e.target.value),
                      })
                    }
                    placeholder="Optional"
                  />
                </div>
              </>
            )}

            {question.type === "rating" && (
              <div className="field">
                <label>Max Rating</label>
                <select
                  value={question.maxRating || 5}
                  onChange={(e) =>
                    onUpdate({ maxRating: parseInt(e.target.value) || 5 })
                  }
                >
                  {[3, 4, 5, 7, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} Stars
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="field">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={question.required || false}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="w-4 h-4"
                />
                Required
              </label>
            </div>
          </div>

          {/* Options Editor for radio/checkbox/select */}
          {hasOptions && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Options</label>
              {(question.options || []).map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <span className="text-xs text-[var(--admin-muted)] w-6">
                    {optIdx + 1}.
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => onUpdateOption(optIdx, e.target.value)}
                    placeholder={`Option ${optIdx + 1}`}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    className="admin-icon-btn text-[var(--admin-red)]"
                    onClick={() => onRemoveOption(optIdx)}
                    disabled={(question.options || []).length <= 1}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="admin-btn admin-btn--sm"
                onClick={onAddOption}
              >
                <Plus size={14} />
                Add Option
              </button>
            </div>
          )}

          {/* Conditional visibility editor */}
          <VisibilityEditor
            question={question}
            parentCandidates={parentCandidates}
            onUpdate={onUpdate}
          />

          {/* Nested children editor (Group) */}
          {isGroup && (
            <div className="mt-2 pt-3 border-t border-[var(--admin-line)]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Layers size={14} className="text-[var(--admin-brand)]" />
                  Nested Fields ({children.length})
                </label>
                <button
                  type="button"
                  className="admin-btn admin-btn--sm"
                  onClick={() => addSubQuestion(question.id)}
                >
                  <Plus size={13} />
                  Add Sub-Field
                </button>
              </div>
              <div className="space-y-3">
                {children.map((child, ci) => (
                  <QuestionEditor
                    key={child.id}
                    question={child}
                    index={ci}
                    depth={depth + 1}
                    allQuestions={allQuestions}
                    isExpanded={expandedChildren.has(child.id)}
                    onToggle={() => toggleChildExpanded(child.id)}
                    onUpdate={(patch) => childHandleUpdate(child.id, patch)}
                    onRemove={() => childHandleRemove(child.id)}
                    onMoveUp={() => childHandleMove(child.id, "up")}
                    onMoveDown={() => childHandleMove(child.id, "down")}
                    onAddOption={() => childHandleAddOption(child.id)}
                    onUpdateOption={(optIdx, value) =>
                      childHandleUpdateOption(child.id, optIdx, value)
                    }
                    onRemoveOption={(optIdx) =>
                      childHandleRemoveOption(child.id, optIdx)
                    }
                    addSubQuestion={addSubQuestion}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Preview hint for section/description */}
          {(question.type === "section" || question.type === "description") && (
            <div className="p-3 bg-[var(--admin-surface-2)] rounded text-sm text-[var(--admin-muted)]">
              {question.type === "section"
                ? "Section headers organize questions into groups."
                : "Description text adds context or instructions."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Conditional Visibility Editor ---

function VisibilityEditor({
  question,
  parentCandidates,
  onUpdate,
}: {
  question: SurveyQuestion;
  parentCandidates: SurveyQuestion[];
  onUpdate: (patch: Partial<SurveyQuestion>) => void;
}) {
  const vis = question.visibility;

  // Find currently selected parent
  const selectedParent = vis
    ? parentCandidates.find((q) => q.id === vis.parentId)
    : undefined;
  const parentOptions = selectedParent
    ? selectedParent.options?.filter((o) => o.trim() !== "") || []
    : [];
  const parentIsRating = selectedParent?.type === "rating";
  const parentIsNumber = selectedParent?.type === "number";

  return (
    <div className="mt-2 pt-3 border-t border-[var(--admin-line)]">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium flex items-center gap-1.5">
          <GitBranch size={14} className="text-[var(--admin-brand)]" />
          Conditional Visibility
        </label>
        {vis && (
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--ghost text-[var(--admin-red)]"
            onClick={() => onUpdate({ visibility: undefined })}
          >
            <X size={13} />
            Remove Rule
          </button>
        )}
      </div>

      {!vis ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--admin-muted)]">
            Show this question only if:
          </span>
          <select
            className="flex-1"
            value=""
            onChange={(e) => {
              const parentId = e.target.value;
              if (!parentId) return;
              onUpdate({
                visibility: { parentId, operator: "equals" },
              });
            }}
          >
            <option value="" disabled>
              Select a previous question...
            </option>
            {parentCandidates.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label || p.type}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[var(--admin-muted)]">When</span>
            <select
              className="flex-1 min-w-[160px]"
              value={vis.parentId}
              onChange={(e) =>
                onUpdate({
                  visibility: {
                    ...vis,
                    parentId: e.target.value,
                    operator: "equals",
                    value: undefined,
                  },
                })
              }
            >
              {parentCandidates.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label || p.type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              className="w-[140px]"
              value={vis.operator}
              onChange={(e) =>
                onUpdate({
                  visibility: {
                    ...vis,
                    operator: e.target.value as ConditionOperator,
                  },
                })
              }
            >
              {CONDITION_OPERATORS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>

            {/* Value selector based on parent type */}
            {!["empty", "notEmpty"].includes(vis.operator) && (
              <ValueInput
                parentQuestion={selectedParent}
                value={vis.value}
                onChange={(val) =>
                  onUpdate({ visibility: { ...vis, value: val } })
                }
              />
            )}
          </div>

          {parentOptions.length === 0 && !parentIsRating && !parentIsNumber && (
            <p className="text-xs text-[var(--admin-muted)]">
              This parent has no options configured. Add options above to match
              on specific values.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ValueInput({
  parentQuestion,
  value,
  onChange,
}: {
  parentQuestion?: SurveyQuestion;
  value?: string | string[] | number;
  onChange: (val: string | string[] | number) => void;
}) {
  // Parent with options → dropdown of those options
  if (parentQuestion && OPTION_TYPES.includes(parentQuestion.type)) {
    const opts = parentQuestion.options?.filter((o) => o.trim() !== "") || [];
    return (
      <select
        className="flex-1 min-w-[140px]"
        value={Array.isArray(value) ? value[0] : value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Select value...
        </option>
        {opts.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  // Rating → number input 1..maxRating
  if (parentQuestion?.type === "rating") {
    return (
      <input
        type="number"
        min={1}
        max={parentQuestion.maxRating || 5}
        className="flex-1 min-w-[100px]"
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="rating"
      />
    );
  }

  // Number → number input
  if (parentQuestion?.type === "number") {
    return (
      <input
        type="number"
        className="flex-1 min-w-[100px]"
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="value"
      />
    );
  }

  // Default text input
  return (
    <input
      type="text"
      className="flex-1 min-w-[140px]"
      value={value ? String(value) : ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="value to match"
    />
  );
}

// Recursive child CRUD helpers. These operate on a parent node's `children`
// array and return a new children list (immutable). The parent editor applies
// the result via `onUpdate({ children: nextChildren })`.

function updateChild(
  children: SurveyQuestion[],
  childId: string,
  fn: (q: SurveyQuestion) => SurveyQuestion
): SurveyQuestion[] {
  return children.map((c) => {
    if (c.id === childId) return fn(c);
    if (c.children)
      return { ...c, children: updateChild(c.children, childId, fn) };
    return c;
  });
}

function childMove(
  children: SurveyQuestion[],
  childId: string,
  direction: "up" | "down"
): SurveyQuestion[] {
  const idx = children.findIndex((c) => c.id === childId);
  const newIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || newIdx < 0 || newIdx >= children.length) return children;
  const next = [...children];
  [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
  return next;
}

function childRemove(children: SurveyQuestion[], childId: string): SurveyQuestion[] {
  const filtered = children.filter((c) => c.id !== childId);
  return filtered.map((c) =>
    c.children ? { ...c, children: childRemove(c.children, childId) } : c
  );
}
