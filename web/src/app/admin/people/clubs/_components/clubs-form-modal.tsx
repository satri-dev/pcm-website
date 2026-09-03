"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Club } from "@/types/clubs";
import { Save, X, Plus, Trash2, UserRound, Loader2 } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const clubSchema = z.object({
  name: z.string().min(2, "Club name is required").max(200),
  icon: z.string().min(1, "Icon is required"),
  tagline: z.string().min(1, "Tagline is required"),
  desc: z.string().optional(),
  members: z.array(z.object({
    photo: z.string(),
    name: z.string().min(1, "Name is required"),
    position: z.string().min(1, "Position is required"),
    program: z.string(),
  })).optional(),
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
  const { register, handleSubmit, setValue, reset, control, formState: { errors } } = useForm<ClubSchema>({
    resolver: zodResolver(clubSchema),
    defaultValues: { name: "", icon: "🎭", tagline: "", desc: "", members: [] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "members" });

  useEffect(() => {
    if (club) { reset({ name: club.name, icon: club.icon, tagline: club.tagline, desc: club.desc || "", members: club.members || [] }); }
    else { reset({ name: "", icon: "🎭", tagline: "", desc: "", members: [] }); }
  }, [club, reset, open]);

  const onSubmit = async (data: ClubSchema) => {
    const clubData: Club = {
      id: club?.id || `club-${Date.now()}`,
      name: data.name, icon: data.icon, tagline: data.tagline,
      image: club?.image || "", desc: data.desc || "",
      members: data.members || [],
    };
    await onSave(clubData);
  };

  const fv = (key: keyof ClubSchema) => errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,720px)] sm:max-w-[720px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">{club ? "Edit Club" : "Add Club"}</DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <div className="form-grid">
              <div className={fv("name")}><label>Club name <span className="req">*</span></label><input type="text" {...register("name")} />{errors.name && <div className="field__err">{errors.name.message}</div>}</div>
              <div className={fv("icon")}><label>Icon (emoji) <span className="req">*</span></label><input type="text" {...register("icon")} placeholder="e.g. 🎭" />{errors.icon && <div className="field__err">{errors.icon.message}</div>}</div>
              <div className={fv("tagline")}><label>Tagline <span className="req">*</span></label><input type="text" {...register("tagline")} />{errors.tagline && <div className="field__err">{errors.tagline.message}</div>}</div>
              <div className={fv("desc")}><label>Description</label><textarea {...register("desc")} rows={3} /></div>

              <div className="field field--full">
                <label className="flex items-center gap-2">Members <span className="text-xs text-[var(--admin-muted)] font-normal">({fields.length})</span></label>
                <div className="flex flex-col gap-3 mt-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-3 p-3 rounded-lg border border-[var(--admin-line)] bg-[var(--admin-surface)]">
                      <div className="flex flex-col items-center gap-2">
                        {field.photo ? (
                          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[var(--admin-line)]" style={{ width: 56, height: 56 }}>
                            <img src={field.photo} alt="Member" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--admin-surface-2)] text-[var(--admin-muted)] border border-dashed border-[var(--admin-line)]" style={{ width: 56, height: 56 }}><UserRound size={20} /></div>
                        )}
                        <ImageUpload
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#16285B] text-white text-[0.75rem] font-medium hover:bg-[#1e3a7a] transition-colors cursor-pointer"
                          onUpload={(r) => setValue(`members.${index}.photo`, r.secure_url)}
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input type="text" {...register(`members.${index}.name`)} placeholder="Name" className="text-sm" />
                        <input type="text" {...register(`members.${index}.position`)} placeholder="Position" className="text-sm" />
                        <input type="text" {...register(`members.${index}.program`)} placeholder="Program (optional)" className="text-sm" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <button type="button" className="admin-icon-btn text-[var(--admin-red)] hover:bg-red-50" onClick={() => remove(index)}><Trash2 size={14} /></button>
                        <button type="button" className="admin-icon-btn" title="Remove photo" onClick={() => setValue(`members.${index}.photo`, "")}><UserRound size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" className="admin-btn admin-btn--sm mt-2" onClick={() => append({ photo: "", name: "", position: "", program: "" })}><Plus size={14} /> Add Member</button>
              </div>
            </div>
          </div>
          <div className="modal__foot">
            <button type="button" className="admin-btn" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{(saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />)}{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
