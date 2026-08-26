"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Club, CLUB_CATEGORIES, CLUB_STATUSES } from "@/types/clubs";
import { Save, X } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const clubSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  category: z.enum(["Academic", "Sports", "Cultural", "Technical", "Social"]),
  image: z.string().optional(),
  description: z.string().optional(),
  president: z.string().optional(),
  vicePresident: z.string().optional(),
  facultyCoordinator: z.string().min(1, "Faculty coordinator is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  memberCount: z.number().min(0, "Member count must be 0 or more").optional(),
  status: z.enum(["active", "inactive"]),
});

type ClubSchema = z.infer<typeof clubSchema>;

interface ClubsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  club: Club | null;
  onSave: (club: Club) => void;
  saving?: boolean;
}

export default function ClubsFormModal({ open, onOpenChange, club, onSave, saving = false }: ClubsFormModalProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ClubSchema>({
    resolver: zodResolver(clubSchema),
    defaultValues: { name: "", category: "Academic", image: "", description: "", president: "", vicePresident: "", facultyCoordinator: "", email: "", phone: "", memberCount: 0, status: "active" },
  });

  const image = watch("image");

  useEffect(() => {
    if (club) {
      reset({ name: club.name, category: club.category, image: club.image || "", description: club.description || "", president: club.president || "", vicePresident: club.vicePresident || "", facultyCoordinator: club.facultyCoordinator, email: club.email, phone: club.phone || "", memberCount: club.memberCount || 0, status: club.status });
    } else {
      reset({ name: "", category: "Academic", image: "", description: "", president: "", vicePresident: "", facultyCoordinator: "", email: "", phone: "", memberCount: 0, status: "active" });
    }
  }, [club, reset, open]);

  const handleImageUpload = (result: { secure_url: string }) => { setValue("image", result.secure_url); };

  const onSubmit = async (data: ClubSchema) => {
    const clubData: Club = {
      id: club?.id || `club-${Date.now()}`,
      name: data.name,
      category: data.category,
      image: data.image || "",
      description: data.description || "",
      president: data.president || "",
      vicePresident: data.vicePresident || "",
      facultyCoordinator: data.facultyCoordinator,
      email: data.email,
      phone: data.phone || "",
      memberCount: data.memberCount || 0,
      status: data.status,
      featured: club?.featured || false,
      createdAt: club?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await onSave(clubData);
  };

  const fv = (key: keyof ClubSchema) => errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">{club ? "Edit Club" : "Add Club"}</DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <div className="form-grid">
              <div className="form-section"><b>Club Details</b></div>

              <div className={fv("name")}><label>Name <span className="req">*</span></label><input type="text" {...register("name")} />{errors.name && <div className="field__err">{errors.name.message}</div>}</div>
              <div className={fv("category")}><label>Category <span className="req">*</span></label><select {...register("category")}><option value="">— Select —</option>{CLUB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>{errors.category && <div className="field__err">{errors.category.message}</div>}</div>
              <div className={fv("status")}><label>Status <span className="req">*</span></label><select {...register("status")}><option value="">— Select —</option>{CLUB_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>{errors.status && <div className="field__err">{errors.status.message}</div>}</div>
              <div className={fv("memberCount")}><label>Members</label><input type="number" {...register("memberCount", { valueAsNumber: true })} min={0} /></div>

              <div className={`field field--full`}>
                <label>Logo/Image</label>
                <div className="file-field">
                  <ImageUpload onUpload={handleImageUpload} />
                  <input type="text" {...register("image")} placeholder="…or paste a Cloudinary URL" className="mt-2" />
                </div>
                {image && <div className="img-prev"><img src={image} alt="" /></div>}
              </div>

              <div className="field field--full"><label>Description</label><textarea {...register("description")} rows={3} placeholder="About this club..." /></div>

              <div className="form-section"><b>Leadership</b></div>

              <div className={fv("president")}><label>President</label><input type="text" {...register("president")} /></div>
              <div className={fv("vicePresident")}><label>Vice President</label><input type="text" {...register("vicePresident")} /></div>
              <div className={fv("facultyCoordinator")}><label>Faculty Coordinator <span className="req">*</span></label><input type="text" {...register("facultyCoordinator")} />{errors.facultyCoordinator && <div className="field__err">{errors.facultyCoordinator.message}</div>}</div>

              <div className="form-section"><b>Contact</b></div>

              <div className={fv("email")}><label>Email <span className="req">*</span></label><input type="email" {...register("email")} />{errors.email && <div className="field__err">{errors.email.message}</div>}</div>
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
