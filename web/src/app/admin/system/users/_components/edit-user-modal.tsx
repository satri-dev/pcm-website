"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Save, X, Pencil } from "lucide-react";
import { UserEntry } from "../types";

const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, hyphens and underscores"
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  role: z.enum(["admin", "editor", "viewer"], {
    message: "Please select a role",
  }),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: UserEntry | null;
  onSave: (id: string, data: EditUserFormData) => Promise<void>;
  saving?: boolean;
}

export default function EditUserModal({
  open,
  onOpenChange,
  entry,
  onSave,
  saving = false,
}: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      role: "editor",
    },
  });

  useEffect(() => {
    if (entry && open) {
      reset({
        name: entry.name,
        email: entry.email,
        username: entry.username,
        password: "",
        role: entry.role as EditUserFormData["role"],
      });
    }
  }, [entry, reset, open]);

  const onSubmit = async (data: EditUserFormData) => {
    if (!entry) return;
    try {
      const payload: Record<string, unknown> = {
        name: data.name,
        email: data.email,
        username: data.username,
        role: data.role,
      };
      // Only include password if user entered a new one
      if (data.password && data.password.trim() !== "") {
        payload.password = data.password;
      }
      await onSave(entry.id, payload as EditUserFormData);
    } catch {
      // Error handled by parent
    }
  };

  const fieldClass = (key: keyof EditUserFormData) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <Pencil size={18} /> Edit User
          </DialogTitle>
          <button
            type="button"
            className="admin-icon-btn"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal__body">
            <div className="form-grid">
              {/* Full Name */}
              <div className={fieldClass("name")}>
                <label htmlFor="edit-user-name">
                  Full Name <span className="req">*</span>
                </label>
                <input
                  id="edit-user-name"
                  type="text"
                  {...register("name")}
                />
                {errors.name && (
                  <div className="field__err">{errors.name.message}</div>
                )}
              </div>

              {/* Username */}
              <div className={fieldClass("username")}>
                <label htmlFor="edit-user-username">
                  Username <span className="req">*</span>
                </label>
                <input
                  id="edit-user-username"
                  type="text"
                  {...register("username")}
                />
                {errors.username && (
                  <div className="field__err">{errors.username.message}</div>
                )}
              </div>

              {/* Email */}
              <div className={`field field--full ${fieldClass("email")}`}>
                <label htmlFor="edit-user-email">
                  Email <span className="req">*</span>
                </label>
                <input
                  id="edit-user-email"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <div className="field__err">{errors.email.message}</div>
                )}
              </div>

              {/* Password */}
              <div className={fieldClass("password")}>
                <label htmlFor="edit-user-password">Password</label>
                <input
                  id="edit-user-password"
                  type="text"
                  {...register("password")}
                  placeholder="Leave blank to keep current"
                />
                <div className="hint">
                  Leave empty to keep the current password
                </div>
                {errors.password && (
                  <div className="field__err">{errors.password.message}</div>
                )}
              </div>

              {/* Role */}
              <div className={fieldClass("role")}>
                <label htmlFor="edit-user-role">
                  Role <span className="req">*</span>
                </label>
                <select id="edit-user-role" {...register("role")}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                {errors.role && (
                  <div className="field__err">{errors.role.message}</div>
                )}
              </div>
            </div>
          </div>
          <div className="modal__foot">
            <button
              type="button"
              className="admin-btn"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
