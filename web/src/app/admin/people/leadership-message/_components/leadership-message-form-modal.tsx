"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LeadershipMessage, LEADERSHIP_ROLES } from "@/types/leadership-message";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import { Save, X, Trash2, UserRound, Loader2 } from "lucide-react";

const msgSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  author: z.string().min(1, "Author is required").max(200),
  role: z.string().optional(),
  order: z.number().int().min(0, "Order must be 0 or higher").optional(),
  excerpt: z.string().optional(),
  photo: z.string().optional(),
});

type MsgSchema = z.infer<typeof msgSchema>;

interface PersonOption {
  name: string;
  role: string;
  photo: string;
  source: "Faculty" | "Board of Directors";
}

interface LeadershipMessageFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: LeadershipMessage | null;
  onSave: (message: LeadershipMessage) => void;
  existingMessages?: LeadershipMessage[];
  saving?: boolean;
}

const PEOPLE_API = [
  { api: "/api/admin/people/faculty?pageSize=100", source: "Faculty" as const },
  { api: "/api/admin/people/board?pageSize=100", source: "Board of Directors" as const },
];

export default function LeadershipMessageFormModal({ open, onOpenChange, message, onSave, existingMessages = [], saving = false }: LeadershipMessageFormModalProps) {
  const { register, handleSubmit, reset, setValue, watch, setError, clearErrors, formState: { errors } } = useForm<MsgSchema>({
    resolver: zodResolver(msgSchema),
    defaultValues: { title: "", author: "", role: "", order: 0, excerpt: "", photo: "" },
  });

  const photo = watch("photo") || "";
  const order = Number(watch("order")) || 0;

  const takenOrders = existingMessages
    .filter((m) => m.id !== message?.id && m.order > 0)
    .map((m) => m.order)
    .sort((a, b) => a - b);
  const [people, setPeople] = useState<PersonOption[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [peopleError, setPeopleError] = useState("");

  useEffect(() => {
    if (open) {
      let cancelled = false;
      setPeopleLoading(true);
      setPeopleError("");
      Promise.all(
        PEOPLE_API.map(async ({ api, source }) => {
          const res = await fetch(api);
          if (!res.ok) throw new Error(`Failed to load ${source}`);
          const data = await res.json();
          const items: { name?: string; role?: string; photo?: string }[] = data.items ?? [];
          return items
            .filter((it) => it.name)
            .map((it) => ({ name: String(it.name), role: String(it.role || ""), photo: String(it.photo || ""), source }));
        })
      )
        .then((groups) => {
          if (cancelled) return;
          setPeople(groups.flat());
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setPeopleError(err instanceof Error ? err.message : "Failed to load people");
        })
        .finally(() => {
          if (!cancelled) setPeopleLoading(false);
        });
      return () => { cancelled = true; };
    }
  }, [open]);

  useEffect(() => {
    if (message) { reset({ title: message.title, author: message.author, role: message.role || "", order: message.order || 0, excerpt: message.excerpt || "", photo: message.photo || "" }); }
    else { reset({ title: "", author: "", role: "", order: 0, excerpt: "", photo: "" }); }
  }, [message, reset, open]);

  const applyPerson = (name: string) => {
    const person = people.find((p) => p.name === name);
    if (!person) return;
    setValue("author", person.name, { shouldValidate: true });
    setValue("role", person.role, { shouldValidate: true });
    setValue("photo", person.photo, { shouldValidate: true });
  };

  const orderTaken = order > 0 && takenOrders.includes(order);

  const onSubmit = async (data: MsgSchema) => {
    const targetOrder = data.order || 0;
    if (targetOrder > 0 && takenOrders.includes(targetOrder)) {
      setError("order", { type: "manual", message: `Order ${targetOrder} is already taken. Choose a different order.` });
      return;
    }
    clearErrors("order");

    const msgData: LeadershipMessage = {
      id: message?.id || `msg-${Date.now()}`,
      title: data.title,
      author: data.author,
      role: data.role || "",
      order: targetOrder,
      excerpt: data.excerpt || "",
      photo: data.photo || "",
    };
    await onSave(msgData);
  };

  const fv = (key: keyof MsgSchema) => errors[key] ? "field is-invalid" : "field";

  const grouped = people.reduce<Record<string, PersonOption[]>>((acc, p) => {
    (acc[p.source] ||= []).push(p);
    return acc;
  }, {});

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
              <div className={fv("title")}><label>Title <span className="req">*</span></label><input type="text" {...register("title")} placeholder="e.g. Message from the Principal" />{errors.title && <div className="field__err">{errors.title.message}</div>}</div>

              <div className="field field--full">
                <label>Select Author from Existing People <span className="hint">(optional — or type below)</span></label>
                <select
                  value=""
                  onChange={(e) => e.target.value && applyPerson(e.target.value)}
                  disabled={peopleLoading}
                >
                  <option value="">{peopleLoading ? "Loading people…" : "— Choose a person —"}</option>
                  {Object.keys(grouped).map((source) => (
                    <optgroup key={source} label={source}>
                      {grouped[source].map((p) => (
                        <option key={`${source}-${p.name}`} value={p.name}>{p.name} — {p.role || "No role"}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {peopleError && <div className="field__err">{peopleError}</div>}
              </div>

              <div className={fv("author")}><label>Author Name <span className="req">*</span></label><input type="text" {...register("author")} placeholder="Type a name manually" />{errors.author && <div className="field__err">{errors.author.message}</div>}</div>
              <div className={fv("role")}><label>Role</label><select {...register("role")}><option value="">— Select —</option>{[...new Set([...(message?.role ? [message.role] : []), ...LEADERSHIP_ROLES])].map((r) => <option key={r} value={r}>{r}</option>)}</select></div>

              <div className={fv("order")}>
                <label>Order</label>
                <input type="number" min={0} step={1} {...register("order", { valueAsNumber: true })} placeholder="0" onFocus={() => clearErrors("order")} />
                {order > 0 && orderTaken && <div className="field__err">Order {order} is already assigned to another message.</div>}
                {errors.order && <div className="field__err">{errors.order.message}</div>}
                {takenOrders.length > 0 && <small className="hint">Occupied: {takenOrders.join(", ")}{message ? ` · current: ${message.order || 0}` : ""}</small>}
              </div>

              <div className="field field--full">
                <label>Profile Photo</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {photo ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[var(--admin-line)]" style={{ width: 64, height: 64 }}>
                      <img src={photo} alt="Author" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--admin-surface-2)] text-[var(--admin-muted)] border border-dashed border-[var(--admin-line)]"><UserRound size={22} /></div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <ImageUpload
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16285B] text-white text-sm font-medium hover:bg-[#1e3a7a] transition-colors cursor-pointer"
                      onUpload={(r) => setValue("photo", r.secure_url, { shouldValidate: true })}
                    />
                    {photo && (
                      <button type="button" className="inline-flex items-center gap-1.5 text-[0.8rem] text-[var(--admin-red)] hover:underline" onClick={() => setValue("photo", "")}><Trash2 size={14} /> Remove</button>
                    )}
                  </div>
                </div>
              </div>

              <div className="field field--full"><label>Message / Excerpt</label><textarea {...register("excerpt")} rows={4} placeholder="Write the leader's message…" /></div>
            </div>
          </div>
          <div className="modal__foot">
            <button type="button" className="admin-btn" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{(saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />)}{saving ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
