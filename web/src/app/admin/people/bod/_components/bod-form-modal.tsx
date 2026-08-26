"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Bod, BOD_STATUSES } from "@/types/bod";
import { Save, X } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const bodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  designation: z.string().min(2, "Designation is required").max(200),
  image: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  bio: z.string().optional(),
  sortOrder: z.number().min(0, "Sort order must be 0 or more").optional(),
  status: z.enum(["active", "inactive"]),
});

type BodSchema = z.infer<typeof bodSchema>;

interface BodFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bod: Bod | null;
  onSave: (bod: Bod) => void;
  saving?: boolean;
}

export default function BodFormModal({ open, onOpenChange, bod, onSave, saving = false }: BodFormModalProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BodSchema>({
    resolver: zodResolver(bodSchema),
    defaultValues: { name: "", designation: "", image: "", email: "", phone: "", bio: "", sortOrder: 0, status: "active" },
  });

  const image = watch("image");

  useEffect(() => {
    if (bod) {
      reset({ name: bod.name, designation: bod.designation, image: bod.image || "", email: bod.email, phone: bod.phone, bio: bod.bio || "", sortOrder: bod.sortOrder || 0, status: bod.status });
    } else {
      reset({ name: "", designation: "", image: "", email: "", phone: "", bio: "", sortOrder: 0, status: "active" });
    }
  }, [bod, reset, open]);

  const handleImageUpload = (result: { secure_url: string }) => { setValue("image", result.secure_url); };

  const onSubmit = async (data: BodSchema) => {
    const bodData: Bod = {
      id: bod?.id || `bod-${Date.now()}`,
      name: data.name,
      designation: data.designation,
      image: data.image || "",
      email: data.email,
      phone: data.phone,
      bio: data.bio || "",
      sortOrder: data.sortOrder || 0,
      status: data.status,
      createdAt: bod?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await onSave(bodData);
  };

  const fv = (key: keyof BodSchema) => errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">{bod ? "Edit Board Member" : "Add Board Member"}</DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <div className="form-grid">
              <div className="form-section"><b>Details</b></div>

              <div className={fv("name")}><label>Name <span className="req">*</span></label><input type="text" {...register("name")} />{errors.name && <div className="field__err">{errors.name.message}</div>}</div>
              <div className={fv("designation")}><label>Designation <span className="req">*</span></label><input type="text" {...register("designation")} placeholder="e.g. Chairman, Director" />{errors.designation && <div className="field__err">{errors.designation.message}</div>}</div>
              <div className={fv("status")}><label>Status <span className="req">*</span></label><select {...register("status")}><option value="">— Select —</option>{BOD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>{errors.status && <div className="field__err">{errors.status.message}</div>}</div>
              <div className={fv("sortOrder")}><label>Sort Order</label><input type="number" {...register("sortOrder", { valueAsNumber: true })} min={0} /></div>

              <div className={`field field--full`}>
                <label>Photo</label>
                <div className="file-field">
                  <ImageUpload onUpload={handleImageUpload} />
                  <input type="text" {...register("image")} placeholder="…or paste a Cloudinary URL" className="mt-2" />
                </div>
                {image && <div className="img-prev"><img src={image} alt="" /></div>}
              </div>

              <div className="form-section"><b>Contact</b></div>

              <div className={fv("email")}><label>Email <span className="req">*</span></label><input type="email" {...register("email")} />{errors.email && <div className="field__err">{errors.email.message}</div>}</div>
              <div className={fv("phone")}><label>Phone <span className="req">*</span></label><input type="text" {...register("phone")} />{errors.phone && <div className="field__err">{errors.phone.message}</div>}</div>

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
