"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Alumni, ALUMNI_STATUSES } from "@/types/alumni";
import { Save, X } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const alumniSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  batch: z.string().min(1, "Batch is required"),
  program: z.string().min(1, "Program is required"),
  image: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  currentCompany: z.string().optional(),
  designation: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  linkedin: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

type AlumniSchema = z.infer<typeof alumniSchema>;

interface AlumniFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alumni: Alumni | null;
  onSave: (alumni: Alumni) => void;
  saving?: boolean;
}

export default function AlumniFormModal({ open, onOpenChange, alumni, onSave, saving = false }: AlumniFormModalProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<AlumniSchema>({
    resolver: zodResolver(alumniSchema),
    defaultValues: { name: "", batch: "", program: "", image: "", email: "", phone: "", currentCompany: "", designation: "", location: "", bio: "", linkedin: "", status: "active" },
  });

  const image = watch("image");

  useEffect(() => {
    if (alumni) {
      reset({ name: alumni.name, batch: alumni.batch, program: alumni.program, image: alumni.image || "", email: alumni.email, phone: alumni.phone, currentCompany: alumni.currentCompany || "", designation: alumni.designation || "", location: alumni.location || "", bio: alumni.bio || "", linkedin: alumni.linkedin || "", status: alumni.status });
    } else {
      reset({ name: "", batch: "", program: "", image: "", email: "", phone: "", currentCompany: "", designation: "", location: "", bio: "", linkedin: "", status: "active" });
    }
  }, [alumni, reset, open]);

  const handleImageUpload = (result: { secure_url: string }) => { setValue("image", result.secure_url); };

  const onSubmit = async (data: AlumniSchema) => {
    const alumniData: Alumni = {
      id: alumni?.id || `alumni-${Date.now()}`,
      name: data.name,
      batch: data.batch,
      program: data.program,
      image: data.image || "",
      email: data.email,
      phone: data.phone,
      currentCompany: data.currentCompany || "",
      designation: data.designation || "",
      location: data.location || "",
      bio: data.bio || "",
      linkedin: data.linkedin || "",
      status: data.status,
      featured: alumni?.featured || false,
      createdAt: alumni?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await onSave(alumniData);
  };

  const fv = (key: keyof AlumniSchema) => errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">{alumni ? "Edit Alumni" : "Add Alumni"}</DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <div className="form-grid">
              <div className="form-section"><b>Personal Details</b></div>

              <div className={fv("name")}><label>Name <span className="req">*</span></label><input type="text" {...register("name")} />{errors.name && <div className="field__err">{errors.name.message}</div>}</div>
              <div className={fv("batch")}><label>Batch <span className="req">*</span></label><input type="text" {...register("batch")} placeholder="e.g. 2020-2023" />{errors.batch && <div className="field__err">{errors.batch.message}</div>}</div>
              <div className={fv("program")}><label>Program <span className="req">*</span></label><input type="text" {...register("program")} placeholder="e.g. BBA, BCA" />{errors.program && <div className="field__err">{errors.program.message}</div>}</div>
              <div className={fv("status")}><label>Status <span className="req">*</span></label><select {...register("status")}><option value="">— Select —</option>{ALUMNI_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>{errors.status && <div className="field__err">{errors.status.message}</div>}</div>

              <div className={`field field--full`}>
                <label>Photo</label>
                <div className="file-field">
                  <ImageUpload onUpload={handleImageUpload} />
                  <input type="text" {...register("image")} placeholder="…or paste a Cloudinary URL" className="mt-2" />
                </div>
                {image && <div className="img-prev"><img src={image} alt="" /></div>}
              </div>

              <div className="form-section"><b>Contact &amp; Career</b></div>

              <div className={fv("email")}><label>Email <span className="req">*</span></label><input type="email" {...register("email")} />{errors.email && <div className="field__err">{errors.email.message}</div>}</div>
              <div className={fv("phone")}><label>Phone <span className="req">*</span></label><input type="text" {...register("phone")} />{errors.phone && <div className="field__err">{errors.phone.message}</div>}</div>
              <div className={fv("currentCompany")}><label>Current Company</label><input type="text" {...register("currentCompany")} /></div>
              <div className={fv("designation")}><label>Designation</label><input type="text" {...register("designation")} /></div>
              <div className={fv("location")}><label>Location</label><input type="text" {...register("location")} placeholder="e.g. Kathmandu, Nepal" /></div>
              <div className={fv("linkedin")}><label>LinkedIn URL</label><input type="url" {...register("linkedin")} placeholder="https://linkedin.com/in/..." /></div>

              <div className="field field--full"><label>Bio</label><textarea {...register("bio")} rows={3} placeholder="Short bio..." /></div>
            </div>
          </div>

          <div className="modal__foot">
            <button type="button" className="admin-btn" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}><Save size={16} />{saving ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
