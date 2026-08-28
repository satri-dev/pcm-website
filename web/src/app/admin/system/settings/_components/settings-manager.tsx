"use client";

import { useState } from "react";
import { useSettings } from "../hooks/useSettings";
import SiteSettings from "./site-settings";
import PasswordChange from "./password-change";
import { Settings, RefreshCw } from "lucide-react";
import type { SiteSettings as SiteSettingsType } from "../types/settings";

interface SettingsManagerProps {
  initialData?: SiteSettingsType;
}

export default function SettingsManager({
  initialData,
}: SettingsManagerProps) {
  const {
    settings,
    loading,
    error,
    refresh,
    updateSettings,
    changePassword,
  } = useSettings(initialData);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateSettings = async (data: {
    collegeName: string;
    logoUrl: string;
  }) => {
    const result = await updateSettings(data);
    showToast("Site settings updated successfully");
    return result;
  };

  return (
    <main className="p-6">
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

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)] flex items-center gap-2">
            <Settings size={24} /> Settings
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage site settings and account security.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="admin-btn"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="admin-panel mb-4">
          <div className="admin-panel__body text-[var(--admin-red)]">{error}</div>
        </div>
      )}

      {/* Settings Content */}
      <div className="space-y-6">
        {/* Site Settings */}
        <SiteSettings settings={settings} onSave={handleUpdateSettings} />

        {/* Password Change */}
        <PasswordChange onChangePassword={changePassword} />
      </div>
    </main>
  );
}