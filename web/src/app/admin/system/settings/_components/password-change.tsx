"use client";

import { useState } from "react";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";

interface PasswordChangeProps {
  onChangePassword: (data: {
    currentPassword: string;
    newPassword: string;
    totpCode: string;
  }) => Promise<{ success: boolean }>;
}

export default function PasswordChange({
  onChangePassword,
}: PasswordChangeProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      showToast("Please enter your current password", "error");
      return;
    }
    if (!newPassword) {
      showToast("Please enter a new password", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (!totpCode || totpCode.length !== 6) {
      showToast("Please enter a valid 6-digit TOTP code", "error");
      return;
    }

    setLoading(true);
    try {
      await onChangePassword({
        currentPassword,
        newPassword,
        totpCode,
      });
      showToast("Password updated successfully");
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTotpCode("");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to change password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all ${
            toast.type === "success"
              ? "bg-[var(--admin-green)]"
              : "bg-[var(--admin-red)]"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="admin-panel__head">
        <div>
          <h3 className="flex items-center gap-2">
            <Lock size={18} /> Change Password
          </h3>
          <p>Update your account password with TOTP verification from your authenticator app.</p>
        </div>
      </div>
      <div className="admin-panel__body">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-semibold text-[var(--admin-ink)] mb-1"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full px-3 py-2 pr-10 border border-[var(--admin-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-brand)] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] hover:text-[var(--admin-ink)]"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-semibold text-[var(--admin-ink)] mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                className="w-full px-3 py-2 pr-10 border border-[var(--admin-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-brand)] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] hover:text-[var(--admin-ink)]"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-[var(--admin-ink)] mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full px-3 py-2 border border-[var(--admin-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-brand)] focus:border-transparent"
            />
          </div>

          {/* TOTP Code */}
          <div>
            <label
              htmlFor="totpCode"
              className="block text-sm font-semibold text-[var(--admin-ink)] mb-1"
            >
              Authenticator Code
            </label>
            <input
              id="totpCode"
              type="text"
              inputMode="numeric"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code from your authenticator app"
              className="w-full px-3 py-2 border border-[var(--admin-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-brand)] focus:border-transparent text-center text-lg tracking-widest"
              maxLength={6}
            />
            <p className="text-xs text-[var(--admin-muted)] mt-1">
              Open your authenticator app (Google Authenticator, Authy, etc.) and enter the current code.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Lock size={16} />
              )}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}