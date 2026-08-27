"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Save, X, UserPlus } from "lucide-react";
import { DEFAULT_PASSWORD } from "../types";

const addUserSchema = z.object({
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
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["editor", "viewer"], {
    message: "Please select a role",
  }),
});

type AddUserFormData = z.infer<typeof addUserSchema>;

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: AddUserFormData) => Promise<void>;
  saving?: boolean;
}

export default function AddUserModal({
  open,
  onOpenChange,
  onSave,
  saving = false,
}: AddUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: DEFAULT_PASSWORD,
      role: "editor",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: "",
        email: "",
        username: "",
        password: DEFAULT_PASSWORD,
        role: "editor",
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: AddUserFormData) => {
    try {
      await onSave(data);
      reset();
    } catch {
      // Error handled by parent
    }
  };

  const fieldClass = (key: keyof AddUserFormData) =>
    errors[key] ? "field is-invalid" : "field";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <UserPlus size={18} /> Add User
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
                <label htmlFor="add-user-name">
                  Full Name <span className="req">*</span>
                </label>
                <input
                  id="add-user-name"
                  type="text"
                  {...register("name")}
                  placeholder="e.g. John Doe"
                />
                {errors.name && (
                  <div className="field__err">{errors.name.message}</div>
                )}
              </div>

              {/* Username */}
              <div className={fieldClass("username")}>
                <label htmlFor="add-user-username">
                  Username <span className="req">*</span>
                </label>
                <input
                  id="add-user-username"
                  type="text"
                  {...register("username")}
                  placeholder="e.g. john.doe"
                />
                {errors.username && (
                  <div className="field__err">{errors.username.message}</div>
                )}
              </div>

              {/* Email */}
              <div className={`field field--full ${fieldClass("email")}`}>
                <label htmlFor="add-user-email">
                  Email <span className="req">*</span>
                </label>
                <input
                  id="add-user-email"
                  type="email"
                  {...register("email")}
                  placeholder="e.g. john@example.com"
                />
                {errors.email && (
                  <div className="field__err">{errors.email.message}</div>
                )}
              </div>

              {/* Password */}
              <div className={fieldClass("password")}>
                <label htmlFor="add-user-password">
                  Password <span className="req">*</span>
                </label>
                <input
                  id="add-user-password"
                  type="text"
                  {...register("password")}
                  placeholder="Default: Password@123"
                />
                <div className="hint">
                  Default password is Password@123
                </div>
                {errors.password && (
                  <div className="field__err">{errors.password.message}</div>
                )}
              </div>

              {/* Role */}
              <div className={fieldClass("role")}>
                <label htmlFor="add-user-role">
                  Role <span className="req">*</span>
                </label>
                <select id="add-user-role" {...register("role")}>
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
              {saving ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
