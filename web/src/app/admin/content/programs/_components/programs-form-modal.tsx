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
import {
  Program,
  ProgramLevel,
  ProgramStatus,
  PROGRAM_LEVELS,
  PROGRAM_STATUSES,
} from "@/types/programs";
import { Save, X } from "lucide-react";
import RichTextEditor from "../../../_components/editor/rich-text-editor";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const programSchema = z.object({
  name: z
    .string()
    .min(3, "Program name must be at least 3 characters")
    .max(200),
  slug: z.string().min(1, "Slug is required"),
  code: z.string().min(1, "Code is required"),
  level: z.enum(["Bachelor", "Bachelor (Finance)", "Bachelor (IT)"]),
  duration: z.string().min(1, "Duration is required"),
  seats: z.number().int().min(1, "At least 1 seat required"),
  status: z.enum(["open", "closed"]),
  image: z.string().optional(),
  intro: z.string().min(1, "Intro is required"),
  eligibility: z.string().min(1, "Eligibility is required"),
});

type ProgramSchema = z.infer<typeof programSchema>;

interface ProgramsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program | null;
  onSave: (program: Program) => void;
  saving?: boolean;
}

export default function ProgramsFormModal({
  open,
  onOpenChange,
  program,
  onSave,
  saving = false,
}: ProgramsFormModalProps) {
  const [image, setImage] = useState("");
  const [introHtml, setIntroHtml] = useState("");
  const [eligibilityHtml, setEligibilityHtml] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProgramSchema>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      slug: "",
      code: "",
      level: "Bachelor",
      duration: "",
      seats: 48,
      status: "open",
      image: "",
      intro: "",
      eligibility: "",
    },
  });

  const titleValue = watch("name");
  useEffect(() => {
    if (!program && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 100)
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, program, setValue]);

  useEffect(() => {
    if (program) {
      reset({
        name: program.name,
        slug: program.slug,
        code: program.code,
        level: program.level,
        duration: program.duration,
        seats: program.seats,
        status: program.status,
        image: program.image || "",
        intro: program.intro,
        eligibility: program.eligibility,
      });
      setImage(program.image || "");
      setIntroHtml(program.intro);
      setEligibilityHtml(program.eligibility);
    } else {
      reset({
        name: "",
        slug: "",
        code: "",
        level: "Bachelor",
        duration: "",
        seats: 48,
        status: "open",
        image: "",
        intro: "",
        eligibility: "",
      });
      setImage("");
      setIntroHtml("");
      setEligibilityHtml("");
    }
  }, [program, reset, open]);

  const removeImage = () => {
    setValue("image", "");
    setImage("");
  };

  const onSubmit = async (data: ProgramSchema) => {
    const programData: Program = {
      id: program?.id || `program-${Date.now()}`,
      name: data.name,
      slug: data.slug,
      code: data.code,
      level: data.level as ProgramLevel,
      duration: data.duration,
      seats: data.seats,
      status: data.status as ProgramStatus,
      image: data.image || undefined,
      intro: data.intro,
      eligibility: data.eligibility,
      views: program?.views || 0,
      createdAt: program?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSave(programData);
  };

  const fieldValue = (key: keyof ProgramSchema) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">
            {program ? "Edit Program" : "Add Program"}
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
              <div className="form-section">
                <b>Overview</b>
              </div>

              <div className={fieldValue("name")}>
                <label htmlFor="program-name">
                  Program Name <span className="req">*</span>
                </label>
                <input
                  id="program-name"
                  type="text"
                  {...register("name")}
                  placeholder="e.g. Bachelor in Business Administration"
                />
                {errors.name && (
                  <div className="field__err">{errors.name.message}</div>
                )}
              </div>

              <div className={fieldValue("code")}>
                <label htmlFor="program-code">
                  Code <span className="req">*</span>
                </label>
                <input
                  id="program-code"
                  type="text"
                  {...register("code")}
                  placeholder="e.g. BBA"
                />
                {errors.code && (
                  <div className="field__err">{errors.code.message}</div>
                )}
              </div>

              <div className={fieldValue("level")}>
                <label htmlFor="program-level">
                  Level <span className="req">*</span>
                </label>
                <select id="program-level" {...register("level")}>
                  {PROGRAM_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                {errors.level && (
                  <div className="field__err">{errors.level.message}</div>
                )}
              </div>

              <div className={fieldValue("duration")}>
                <label htmlFor="program-duration">
                  Duration <span className="req">*</span>
                </label>
                <input
                  id="program-duration"
                  type="text"
                  {...register("duration")}
                  placeholder="e.g. 4 Years"
                />
                {errors.duration && (
                  <div className="field__err">{errors.duration.message}</div>
                )}
              </div>

              <div className={fieldValue("seats")}>
                <label htmlFor="program-seats">
                  Seats <span className="req">*</span>
                </label>
                <input
                  id="program-seats"
                  type="number"
                  {...register("seats", { valueAsNumber: true })}
                  min={1}
                />
                {errors.seats && (
                  <div className="field__err">{errors.seats.message}</div>
                )}
              </div>

              <div className={fieldValue("status")}>
                <label htmlFor="program-status">
                  Status <span className="req">*</span>
                </label>
                <select id="program-status" {...register("status")}>
                  {PROGRAM_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <div className="field__err">{errors.status.message}</div>
                )}
              </div>

              <div className="field field--full">
                <label>Program Image</label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <ImageUpload
                      onUpload={(result) => {
                        setValue("image", result.secure_url);
                        setImage(result.secure_url);
                      }}
                    />
                    <span className="text-[0.85rem] text-[var(--admin-muted)]">
                      or paste URL below
                    </span>
                  </div>

                  <input
                    type="text"
                    {...register("image")}
                    placeholder="Or paste image URL here..."
                    className="w-full"
                  />
                </div>

                {image && (
                  <div className="img-prev mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="" />
                  </div>
                )}

                {image && (
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm admin-btn--ghost text-[var(--admin-red)] border-[rgba(214,69,69,0.3)] hover:border-[rgba(214,69,69,0.3)] mt-2"
                    onClick={removeImage}
                  >
                    <X size={13} />
                    Remove
                  </button>
                )}

                <span className="hint mt-2">
                  Upload via Cloudinary (max 5MB) or paste a URL
                </span>
              </div>

              <div className="form-section">
                <b>Description</b>
              </div>

              <div
                className={`field field--full ${
                  errors.intro ? "is-invalid" : ""
                }`}
              >
                <label htmlFor="program-intro">
                  Intro <span className="req">*</span>
                </label>
                <RichTextEditor
                  content={introHtml}
                  onChange={(html) => {
                    setIntroHtml(html);
                    setValue("intro", html);
                  }}
                  placeholder="Describe the program..."
                />
                {errors.intro && (
                  <div className="field__err">{errors.intro.message}</div>
                )}
              </div>

              <div
                className={`field field--full ${
                  errors.eligibility ? "is-invalid" : ""
                }`}
              >
                <label htmlFor="program-eligibility">
                  Eligibility <span className="req">*</span>
                </label>
                <RichTextEditor
                  content={eligibilityHtml}
                  onChange={(html) => {
                    setEligibilityHtml(html);
                    setValue("eligibility", html);
                  }}
                  placeholder="Describe eligibility requirements..."
                />
                {errors.eligibility && (
                  <div className="field__err">
                    {errors.eligibility.message}
                  </div>
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
