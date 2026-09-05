"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Alumni, ALUMNI_PROGRAMS, ALUMNI_ROLES, ALUMNI_SECTORS } from "@/types/alumni";
import { Save, X } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const alumniSchema = z.object({
  name: z.string().min(2, "Full name is required").max(200),
  batch: z.string().min(1, "Batch is required"),
  program: z.string().min(1, "Program is required").max(100),
  sector: z.string().min(1, "Sector is required").max(100),
  role: z.string().min(1, "Role / company is required"),
  location: z.string().optional(),
  photo: z.string().optional(),
});

type AlumniSchema = z.infer<typeof alumniSchema>;

interface AlumniFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alumni: Alumni | null;
  onSave: (alumni: Alumni) => void;
  saving?: boolean;
  programCodes?: string[];
}

export default function AlumniFormModal({ open, onOpenChange, alumni, onSave, saving = false, programCodes = [] }: AlumniFormModalProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<AlumniSchema>({
    resolver: zodResolver(alumniSchema),
    defaultValues: { name: "", batch: "", program: "BBA", sector: "Banking & Finance", role: "", location: "", photo: "" },
  });
  const photo = watch("photo");

  useEffect(() => {
    if (alumni) { reset({ name: alumni.name, batch: alumni.batch, program: alumni.program, sector: alumni.sector, role: alumni.role, location: alumni.location || "", photo: alumni.photo || "" }); }
    else { reset({ name: "", batch: "", program: "BBA", sector: "Banking & Finance", role: "", location: "", photo: "" }); }
  }, [alumni, reset, open]);

  const handlePhotoUpload = (result: { secure_url: string }) => { setValue("photo", result.secure_url); };

  const onSubmit = async (data: AlumniSchema) => {
    const alumniData: Alumni = {
      id: alumni?.id || `alumni-${Date.now()}`,
      name: data.name, batch: data.batch, program: data.program, sector: data.sector,
      role: data.role, location: data.location || "", photo: data.photo || "",
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
              <div className={fv("name")}><label>Full name <span className="req">*</span></label><input type="text" {...register("name")} />{errors.name && <div className="field__err">{errors.name.message}</div>}</div>
              <div className={fv("batch")}><label>Batch <span className="req">*</span></label><input type="text" {...register("batch")} placeholder="e.g. 2075" />{errors.batch && <div className="field__err">{errors.batch.message}</div>}</div>
              <div className={fv("program")}><label>Program <span className="req">*</span></label><input type="text" list="alumni-program-list" placeholder="e.g. BBA, BCSIT, …" {...register("program")} /><datalist id="alumni-program-list">{[...new Set([...programCodes, ...ALUMNI_PROGRAMS])].map((p) => <option key={p} value={p} />)}</datalist>{errors.program && <div className="field__err">{errors.program.message}</div>}</div>
              <div className={fv("sector")}><label>Sector <span className="req">*</span></label><input type="text" list="alumni-sector-list" placeholder="e.g. Banking & Finance, Technology, …" {...register("sector")} /><datalist id="alumni-sector-list">{[...new Set([...(alumni?.sector ? [alumni.sector] : []), ...ALUMNI_SECTORS])].map((s) => <option key={s} value={s} />)}</datalist>{errors.sector && <div className="field__err">{errors.sector.message}</div>}</div>
              <div className={fv("role")}><label>Role / company <span className="req">*</span></label><input type="text" list="alumni-role-list" placeholder="e.g. Branch Manager, Software Engineer, …" {...register("role")} /><datalist id="alumni-role-list">{[...new Set([...(alumni?.role ? [alumni.role] : []), ...ALUMNI_ROLES])].map((r) => <option key={r} value={r} />)}</datalist>{errors.role && <div className="field__err">{errors.role.message}</div>}</div>
              <div className={fv("location")}><label>Location</label><input type="text" {...register("location")} placeholder="e.g. Pokhara" /></div>
              <div className={`field field--full`}>
                <label>Photo</label>
                <div className="file-field">
                  <ImageUpload onUpload={handlePhotoUpload} />
                  <input type="text" {...register("photo")} placeholder="…or paste a URL" className="mt-2" />
                </div>
                {photo && <div className="img-prev"><img src={photo} alt="" style={{ height: 64, width: "auto", maxWidth: "100%", borderRadius: 8, border: "1px solid #e2e7f0" }} /></div>}
              </div>
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
