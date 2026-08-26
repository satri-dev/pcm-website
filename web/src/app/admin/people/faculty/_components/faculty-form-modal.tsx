"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Faculty, FACULTY_DEPARTMENTS, FACULTY_STATUSES } from "@/types/faculty";
import { Save, X } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const facultySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  department: z.enum(["Management", "Computer Science", "Hospitality", "Business", "Administration"]),
  designation: z.string().min(2, "Designation is required").max(200),
  image: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  qualification: z.string().min(1, "Qualification is required"),
  experience: z.string().min(1, "Experience is required"),
  bio: z.string().optional(),
  status: z.enum(["active", "inactive", "on_leave"]),
});

type FacultySchema = z.infer<typeof facultySchema>;

interface FacultyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faculty: Faculty | null;
  onSave: (faculty: Faculty) => void;
  saving?: boolean;
}

export default function FacultyFormModal({ open, onOpenChange, faculty, onSave, saving = false }: FacultyFormModalProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FacultySchema>({
    resolver: zodResolver(facultySchema),
    defaultValues: { name: "", department: "Management", designation: "", image: "", email: "", phone: "", qualification: "", experience: "", bio: "", status: "active" },
  });

  const image = watch("image");

  useEffect(() => {
    if (faculty) {
      reset({ name: faculty.name, department: faculty.department, designation: faculty.designation, image: faculty.image || "", email: faculty.email, phone: faculty.phone, qualification: faculty.qualification, experience: faculty.experience, bio: faculty.bio || "", status: faculty.status });
    } else {
      reset({ name: "", department: "Management", designation: "", image: "", email: "", phone: "", qualification: "", experience: "", bio: "", status: "active" });
    }
  }, [faculty, reset, open]);

  const handleImageUpload = (result: { secure_url: string }) => { setValue("image", result.secure_url); };

  const onSubmit = async (data: FacultySchema) => {
    const facultyData: Faculty = {
      id: faculty?.id || `faculty-${Date.now()}`,
      name: data.name,
      department: data.department,
      designation: data.designation,
      image: data.image || "",
      email: data.email,
      phone: data.phone,
      qualification: data.qualification,
      experience: data.experience,
      bio: data.bio || "",
      status: data.status,
      featured: faculty?.featured || false,
      createdAt: faculty?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await onSave(facultyData);
  };

  const fv = (key: keyof FacultySchema) => errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">{faculty ? "Edit Faculty" : "Add Faculty"}</DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <div className="form-grid">
              <div className="form-section"><b>Personal Details</b></div>

              <div className={fv("name")}><label>Name <span className="req">*</span></label><input type="text" {...register("name")} />{errors.name && <div className="field__err">{errors.name.message}</div>}</div>
              <div className={fv("department")}><label>Department <span className="req">*</span></label><select {...register("department")}><option value="">— Select —</option>{FACULTY_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}</select>{errors.department && <div className="field__err">{errors.department.message}</div>}</div>
              <div className={fv("designation")}><label>Designation <span className="req">*</span></label><input type="text" {...register("designation")} />{errors.designation && <div className="field__err">{errors.designation.message}</div>}</div>
              <div className={fv("status")}><label>Status <span className="req">*</span></label><select {...register("status")}><option value="">— Select —</option>{FACULTY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>{errors.status && <div className="field__err">{errors.status.message}</div>}</div>

              <div className={`field field--full ${!image ? "" : ""}`}>
                <label>Photo</label>
                <div className="file-field">
                  <ImageUpload onUpload={handleImageUpload} />
                  <input type="text" {...register("image")} placeholder="…or paste a Cloudinary URL" className="mt-2" />
                </div>
                {image && <div className="img-prev"><img src={image} alt="" /></div>}
              </div>

              <div className="form-section"><b>Contact &amp; Professional</b></div>

              <div className={fv("email")}><label>Email <span className="req">*</span></label><input type="email" {...register("email")} />{errors.email && <div className="field__err">{errors.email.message}</div>}</div>
              <div className={fv("phone")}><label>Phone <span className="req">*</span></label><input type="text" {...register("phone")} />{errors.phone && <div className="field__err">{errors.phone.message}</div>}</div>
              <div className={fv("qualification")}><label>Qualification <span className="req">*</span></label><input type="text" {...register("qualification")} placeholder="e.g. M.Com, PhD" />{errors.qualification && <div className="field__err">{errors.qualification.message}</div>}</div>
              <div className={fv("experience")}><label>Experience <span className="req">*</span></label><input type="text" {...register("experience")} placeholder="e.g. 10 years" />{errors.experience && <div className="field__err">{errors.experience.message}</div>}</div>

              <div className="field field--full"><label>Bio</label><textarea {...register("bio")} rows={3} placeholder="Short biography..." /></div>
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
