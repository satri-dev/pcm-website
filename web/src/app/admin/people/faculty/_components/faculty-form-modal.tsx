"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Faculty, FACULTY_GROUPS } from "@/types/faculty";
import { Save, X } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const facultySchema = z.object({
  name: z.string().min(2, "Full name is required").max(200),
  role: z.string().min(1, "Role is required").max(200),
  group: z.enum(["Leadership", "Faculty", "Administration"]),
  photo: z.string().optional(),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  phone: z.string().optional(),
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
    defaultValues: { name: "", role: "", group: "Faculty", photo: "", email: "", phone: "" },
  });

  const photo = watch("photo");

  useEffect(() => {
    if (faculty) {
      reset({ name: faculty.name, role: faculty.role, group: faculty.group, photo: faculty.photo || "", email: faculty.email || "", phone: faculty.phone || "" });
    } else {
      reset({ name: "", role: "", group: "Faculty", photo: "", email: "", phone: "" });
    }
  }, [faculty, reset, open]);

  const handlePhotoUpload = (result: { secure_url: string }) => { setValue("photo", result.secure_url); };

  const onSubmit = async (data: FacultySchema) => {
    const facultyData: Faculty = {
      id: faculty?.id || `faculty-${Date.now()}`,
      name: data.name,
      role: data.role,
      group: data.group,
      photo: data.photo || "",
      email: data.email || "",
      phone: data.phone || "",
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
              <div className={fv("name")}><label>Full name <span className="req">*</span></label><input type="text" {...register("name")} />{errors.name && <div className="field__err">{errors.name.message}</div>}</div>
              <div className={fv("role")}><label>Role <span className="req">*</span></label><input type="text" {...register("role")} placeholder="e.g. Principal, Faculty Member" />{errors.role && <div className="field__err">{errors.role.message}</div>}</div>
              <div className={fv("group")}><label>Group <span className="req">*</span></label><select {...register("group")}><option value="">— Select —</option>{FACULTY_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}</select>{errors.group && <div className="field__err">{errors.group.message}</div>}</div>

              <div className={`field field--full`}>
                <label>Photo</label>
                <div className="file-field">
                  <ImageUpload onUpload={handlePhotoUpload} />
                  <input type="text" {...register("photo")} placeholder="…or paste a URL" className="mt-2" />
                </div>
                {photo && <div className="img-prev"><img src={photo} alt="" style={{ height: 64, width: "auto", maxWidth: "100%", borderRadius: 8, border: "1px solid #e2e7f0" }} /></div>}
              </div>

              <div className={fv("email")}><label>Email</label><input type="email" {...register("email")} /></div>
              <div className={fv("phone")}><label>Phone</label><input type="text" {...register("phone")} /></div>
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
