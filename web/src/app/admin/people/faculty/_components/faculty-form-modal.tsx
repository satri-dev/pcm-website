"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Faculty, FACULTY_GROUPS, FACULTY_ROLES } from "@/types/faculty";
import { Save, X } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";

const facultySchema = z.object({
  name: z.string().min(2, "Full name is required").max(200),
  role: z.string().min(1, "Role is required").max(200),
  group: z.enum(["Leadership", "Faculty", "Administration"]),
  order: z.number().int().min(0, "Order must be 0 or higher").optional(),
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
  existingFaculty?: Faculty[];
  saving?: boolean;
}

export default function FacultyFormModal({ open, onOpenChange, faculty, onSave, existingFaculty = [], saving = false }: FacultyFormModalProps) {
  const { register, handleSubmit, setValue, watch, reset, setError, clearErrors, formState: { errors } } = useForm<FacultySchema>({
    resolver: zodResolver(facultySchema),
    defaultValues: { name: "", role: "", group: "Faculty", order: 0, photo: "", email: "", phone: "" },
  });

  const photo = watch("photo");
  const order = Number(watch("order")) || 0;

  const takenOrders = existingFaculty
    .filter((f) => f.id !== faculty?.id && f.order > 0)
    .map((f) => f.order)
    .sort((a, b) => a - b);

  useEffect(() => {
    if (faculty) {
      reset({ name: faculty.name, role: faculty.role, group: faculty.group, order: faculty.order || 0, photo: faculty.photo || "", email: faculty.email || "", phone: faculty.phone || "" });
    } else {
      reset({ name: "", role: "", group: "Faculty", order: 0, photo: "", email: "", phone: "" });
    }
  }, [faculty, reset, open]);

  const handlePhotoUpload = (result: { secure_url: string }) => { setValue("photo", result.secure_url); };

  const orderTaken = order > 0 && takenOrders.includes(order);

  const onSubmit = async (data: FacultySchema) => {
    const targetOrder = data.order || 0;
    if (targetOrder > 0 && takenOrders.includes(targetOrder)) {
      setError("order", { type: "manual", message: `Order ${targetOrder} is already taken. Choose a different order.` });
      return;
    }
    clearErrors("order");

    const facultyData: Faculty = {
      id: faculty?.id || `faculty-${Date.now()}`,
      name: data.name,
      role: data.role,
      group: data.group,
      order: targetOrder,
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
              <div className={fv("role")}><label>Role <span className="req">*</span></label><input type="text" list="faculty-role-list" placeholder="e.g. Principal, BCSIT Coordinator, …" {...register("role")} /><datalist id="faculty-role-list">{[...new Set([...(faculty?.role ? [faculty.role] : []), ...FACULTY_ROLES])].map((r) => <option key={r} value={r} />)}</datalist>{errors.role && <div className="field__err">{errors.role.message}</div>}</div>
              <div className={fv("group")}><label>Group <span className="req">*</span></label><select {...register("group")}><option value="">— Select —</option>{FACULTY_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}</select>{errors.group && <div className="field__err">{errors.group.message}</div>}</div>
              <div className={fv("order")}>
                <label>Order</label>
                <input type="number" min={0} step={1} {...register("order", { valueAsNumber: true })} placeholder="0" onFocus={() => clearErrors("order")} />
                {order > 0 && orderTaken && <div className="field__err">Order {order} is already assigned to another member.</div>}
                {errors.order && <div className="field__err">{errors.order.message}</div>}
                {takenOrders.length > 0 && <small className="hint">Occupied: {takenOrders.join(", ")}{faculty ? ` · current: ${faculty.order || 0}` : ""}</small>}
              </div>

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