"use client";

import { useState } from "react";
import { authClient } from "@/core/lib/auth-client";
import { Shield, Loader2, Eye, EyeOff, QrCode } from "lucide-react";
import Image from "next/image";

export default function TwoFactorQR() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [totpURI, setTotpURI] = useState("");
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      showToast("Please enter your password", "error");
      return;
    }

    setLoading(true);
    setToast(null);
    try {
      const { data, error } = await authClient.twoFactor.getTotpUri({
        password,
      });
      if (error) {
        showToast(error.message || "Invalid password", "error");
        return;
      }
      if (data?.totpURI) {
        setTotpURI(data.totpURI);
        setRevealed(true);
        setPassword("");
      }
    } catch {
      showToast("Failed to retrieve QR code", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleHide = () => {
    setRevealed(false);
    setTotpURI("");
    setPassword("");
  };

  return (
    <div className="admin-panel">
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
            <Shield size={18} /> Two-Factor Authentication
          </h3>
          <p>
            View the TOTP QR code to scan with your authenticator app. All
            administrators share the same secret.
          </p>
        </div>
      </div>

      <div className="admin-panel__body">
        {!revealed ? (
          <form onSubmit={handleReveal} className="space-y-4">
            <p className="text-sm text-[var(--admin-muted)]">
              Enter your password to reveal the QR code. This is required for
              security verification.
            </p>
            <div>
              <label
                htmlFor="2faPassword"
                className="block text-sm font-semibold text-[var(--admin-ink)] mb-1"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="2faPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 pr-10 border border-[var(--admin-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-brand)] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] hover:text-[var(--admin-ink)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <QrCode size={16} />
                )}
                Show QR Code
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--admin-line)] bg-[var(--admin-surface)] p-5">
              <p className="mb-3 text-center text-sm font-medium text-[var(--admin-ink)]">
                Scan this QR code with Google Authenticator / Authy:
              </p>
              <div className="flex items-center justify-center rounded-xl bg-white p-4 shadow-inner ring-1 ring-slate-100">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(totpURI)}`}
                  alt="2FA QR Code"
                  width={280}
                  height={280}
                  className="block w-44 h-44 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-lg"
                  unoptimized
                />
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--admin-muted)]">
                Setup key
              </p>
              <code className="mt-2 block w-full break-all rounded-lg border border-[var(--admin-line)] bg-white px-3 py-2 text-left text-[11px] text-[var(--admin-ink)]">
                {totpURI}
              </code>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <strong>Security note:</strong> All administrators share this same
              TOTP secret. Anyone with access to this QR code and your admin
              credentials can generate valid codes. Only view this on a trusted
              device.
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="admin-btn"
                onClick={handleHide}
              >
                Hide QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
