"use client";

import { useState } from "react";
import { Building, Save, Loader2, ImageIcon } from "lucide-react";
import ImageUpload from "@/components/cloudinary/ImageUpload";
import type { SiteSettings } from "../types/settings";

interface SiteSettingsProps {
  settings: SiteSettings;
  onSave: (data: { collegeName: string; logoUrl: string }) => Promise<SiteSettings>;
}

export default function SiteSettings({ settings, onSave }: SiteSettingsProps) {
  const [collegeName, setCollegeName] = useState(settings.collegeName);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeName.trim()) {
      showToast("College name is required", "error");
      return;
    }
    if (!logoUrl.trim()) {
      showToast("Logo is required", "error");
      return;
    }

    setSaving(true);
    try {
      await onSave({ collegeName: collegeName.trim(), logoUrl: logoUrl.trim() });
      showToast("Site settings updated successfully");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to update settings",
        "error"
      );
    } finally {
      setSaving(false);
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
            <Building size={18} /> Site Settings
          </h3>
          <p>Configure your college name and logo for the admin panel.</p>
        </div>
      </div>
      <div className="admin-panel__body">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* College Name */}
            <div>
              <label
                htmlFor="collegeName"
                className="block text-sm font-semibold text-[var(--admin-ink)] mb-1"
              >
                College Name
              </label>
              <input
                id="collegeName"
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. Pokhara College of Management"
                className="w-full px-3 py-2 border border-[var(--admin-line)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-brand)] focus:border-transparent"
                required
              />
              <p className="text-xs text-[var(--admin-muted)] mt-1">
                This will be displayed in the admin sidebar and other areas.
              </p>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold text-[var(--admin-ink)] mb-1">
                College Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[var(--admin-surface-2)] border border-[var(--admin-line)] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl ? (
                    <div
                      className="w-12 h-12 bg-contain bg-no-repeat bg-center"
                      style={{ backgroundImage: `url(${logoUrl})` }}
                    />
                  ) : (
                    <ImageIcon size={24} className="text-[var(--admin-muted)]" />
                  )}
                </div>
                <div className="flex-1">
                  <ImageUpload
                    onUpload={(result) => {
                      setLogoUrl(result.secure_url);
                    }}
                  />
                  <p className="text-xs text-[var(--admin-muted)] mt-1">
                    Upload JPG, PNG, or WebP. Max 5 MB.
                  </p>
                </div>
              </div>
              {/* Hidden input for form validation */}
              <input type="hidden" value={logoUrl} required />
            </div>

            {/* Preview */}
            <div className="flex items-center gap-4 p-4 bg-[var(--admin-surface-2)] rounded-lg">
              <div className="w-10 h-10 bg-[var(--admin-surface)] border border-[var(--admin-line)] rounded-lg flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <div
                    className="w-8 h-8 bg-contain bg-no-repeat bg-center"
                    style={{ backgroundImage: `url(${logoUrl})` }}
                  />
                ) : (
                  <Building size={20} className="text-[var(--admin-muted)]" />
                )}
              </div>
              <div>
                <div className="font-semibold text-sm text-[var(--admin-ink)]">
                  {collegeName || "College Name"}
                </div>
                <div className="text-xs text-[var(--admin-muted)]">Admin Panel</div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}