"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LeadershipMessage, LEADERSHIP_ROLES } from "@/types/leadership-message";
import { Save, X } from "lucide-react";

const msgSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  author: z.string().min(1, "Author is required").max(200),
  role: z.string().optional(),
  excerpt: z.string().optional(),
});

type MsgSchema = z.infer<typeof msgSchema>;

interface LeadershipMessageFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: LeadershipMessage | null;
  onSave: (message: LeadershipMessage) => void;
  saving?: boolean;
}

export default function LeadershipMessageFormModal({ open, onOpenChange, message, onSave, saving = false }: LeadershipMessageFormModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MsgSchema>({
    resolver: zodResolver(msgSchema),
    defaultValues: { title: "", author: "", role: "", excerpt: "" },
  });

  useEffect(() => {
    if (message) { reset({ title: message.title, author: message.author, role: message.role || "", excerpt: message.excerpt || "" }); }
    else { reset({ title: "", author: "", role: "", excerpt: "" }); }
  }, [message, reset, open]);

  const onSubmit = async (data: MsgSchema) => {
    const msgData: LeadershipMessage = {
      id: message?.id || `msg-${Date.now()}`,
      title: data.title,
      author: data.author,
      role: data.role || "",
      excerpt: data.excerpt || "",
    };
    await onSave(msgData);
  };

  const fv = (key: keyof MsgSchema) => errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none">
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal">{message ? "Edit Message" : "Add Message"}</DialogTitle>
          <button type="button" className="admin-icon-btn" aria-label="Close" onClick={() => onOpenChange(false)}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <div className="form-grid">
              <div className={fv("title")}><label>Title <span className="req">*</span></label><input type="text" {...register("title")} />{errors.title && <div className="field__err">{errors.title.message}</div>}</div>
              <div className={fv("author")}><label>Author <span className="req">*</span></label><input type="text" {...register("author")} />{errors.author && <div className="field__err">{errors.author.message}</div>}</div>
              <div className={fv("role")}><label>Role</label><select {...register("role")}><option value="">— Select —</option>{[...new Set([...(message?.role ? [message.role] : []), ...LEADERSHIP_ROLES])].map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
              <div className="field field--full"><label>Excerpt</label><textarea {...register("excerpt")} rows={4} placeholder="Short message or excerpt…" /></div>
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
