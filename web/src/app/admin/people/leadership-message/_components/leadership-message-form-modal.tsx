"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LeadershipMessage, LEADERSHIP_TYPES, LEADERSHIP_STATUSES } from "@/types/leadership-message";
import { Save, X } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const leadershipSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  type: z.enum(["Chairman", "Principal", "Director"]),
  image: z.string().optional(),
  designation: z.string().min(2, "Designation is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  status: z.enum(["active", "inactive"]),
});

type LeadershipSchema = z.infer<typeof leadershipSchema>;

interface LeadershipMessageFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: LeadershipMessage | null;
  onSave: (message: LeadershipMessage) => void;
  saving?: boolean;
}

export default function LeadershipMessageFormModal({ open, onOpenChange, message, onSave, saving = false }: LeadershipMessageFormModalProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<LeadershipSchema>({
    resolver: zodResolver(leadershipSchema),
    defaultValues: { name: "", type: "Chairman", image: "", designation: "", message: "", email: "", phone: "", status: "active" },
  });

  const image = watch("image");

  useEffect(() => {
    if (message) {
      reset({ name: message.name, type: message.type, image: message.image || "", designation: message.designation, message: message.message, email: message.email, phone: message.phone, status: message.status });
    } else {
      reset({ name: "", type: "Chairman", image: "", designation: "", message: "", email: "", phone: "", status: "active" });
    }
  }, [message, reset, open]);

  const handleImageUpload = (result: { secure_url: string }) => { setValue("image", result.secure_url); };

  const onSubmit = async (data: LeadershipSchema) => {
    const msgData: LeadershipMessage = {
      id: message?.id || `leadership-${Date.now()}`,
      name: data.name,
      type: data.type,
      image: data.image || "",
      designation: data.designation,
      message: data.message,
      email: data.email,
      phone: data.phone,
      status: data.status,
      createdAt: message?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await onSave(msgData);
  };

  const fv = (key: keyof LeadershipSchema) => errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">{message ? "Edit Leadership Message" : "Add Leadership Message"}</DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <div className="form-grid">
              <div className="form-section"><b>Details</b></div>

              <div className={fv("name")}><label>Name <span className="req">*</span></label><input type="text" {...register("name")} />{errors.name && <div className="field__err">{errors.name.message}</div>}</div>
              <div className={fv("type")}><label>Type <span className="req">*</span></label><select {...register("type")}><option value="">— Select —</option>{LEADERSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select>{errors.type && <div className="field__err">{errors.type.message}</div>}</div>
              <div className={fv("designation")}><label>Designation <span className="req">*</span></label><input type="text" {...register("designation")} />{errors.designation && <div className="field__err">{errors.designation.message}</div>}</div>
              <div className={fv("status")}><label>Status <span className="req">*</span></label><select {...register("status")}><option value="">— Select —</option>{LEADERSHIP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>{errors.status && <div className="field__err">{errors.status.message}</div>}</div>

              <div className={`field field--full`}>
                <label>Photo</label>
                <div className="file-field">
                  <ImageUpload onUpload={handleImageUpload} />
                  <input type="text" {...register("image")} placeholder="…or paste a Cloudinary URL" className="mt-2" />
                </div>
                {image && <div className="img-prev"><img src={image} alt="" /></div>}
              </div>

              <div className="field field--full"><label>Message <span className="req">*</span></label><textarea {...register("message")} rows={5} placeholder="Leadership message..." />{errors.message && <div className="field__err">{errors.message.message}</div>}</div>

              <div className="form-section"><b>Contact</b></div>

              <div className={fv("email")}><label>Email <span className="req">*</span></label><input type="email" {...register("email")} />{errors.email && <div className="field__err">{errors.email.message}</div>}</div>
              <div className={fv("phone")}><label>Phone <span className="req">*</span></label><input type="text" {...register("phone")} />{errors.phone && <div className="field__err">{errors.phone.message}</div>}</div>
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
