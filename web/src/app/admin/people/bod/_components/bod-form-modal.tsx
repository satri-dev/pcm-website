"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Bod, BOD_ROLES } from "@/types/bod";
import { Save, X } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const bodSchema = z.object({
  name: z.string().min(2, "Full name is required").max(200),
  role: z.string().min(1, "Role is required").max(200),
  order: z.number().min(0).optional(),
  photo: z.string().optional(),
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
    defaultValues: { name: "", role: "", order: 0, photo: "" },
  });
  const photo = watch("photo");

  useEffect(() => {
    if (bod) { reset({ name: bod.name, role: bod.role, order: bod.order || 0, photo: bod.photo || "" }); }
    else { reset({ name: "", role: "", order: 0, photo: "" }); }
  }, [bod, reset, open]);

  const handlePhotoUpload = (result: { secure_url: string }) => { setValue("photo", result.secure_url); };

  const onSubmit = async (data: BodSchema) => {
    const bodData: Bod = {
      id: bod?.id || `board-${Date.now()}`,
      name: data.name,
      role: data.role,
      order: data.order || 0,
      photo: data.photo || "",
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
              <div className={fv("name")}><label>Full name <span className="req">*</span></label><input type="text" {...register("name")} />{errors.name && <div className="field__err">{errors.name.message}</div>}</div>
              <div className={fv("role")}><label>Role <span className="req">*</span></label><select {...register("role")}><option value="">— Select —</option>{[...new Set([...(bod?.role ? [bod.role] : []), ...BOD_ROLES])].map((r) => <option key={r} value={r}>{r}</option>)}</select>{errors.role && <div className="field__err">{errors.role.message}</div>}</div>
              <div className={fv("order")}><label>Order</label><input type="number" {...register("order", { valueAsNumber: true })} min={0} /></div>
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
