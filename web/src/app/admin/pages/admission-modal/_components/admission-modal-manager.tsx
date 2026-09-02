"use client";

import { useState } from "react";
import { Save, Eye, EyeOff } from "lucide-react";
import type { AdmissionModalSettings } from "@/types/admission-modal";

interface Props {
  settings: AdmissionModalSettings;
  onSave: (settings: AdmissionModalSettings) => Promise<void>;
}

export default function AdmissionModalManager({ settings: initialSettings, onSave }: Props) {
  const [settings, setSettings] = useState<AdmissionModalSettings>(initialSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(settings);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--admin-ink)] m-0">Admission Modal Settings</h3>
          <p className="text-sm text-[var(--admin-muted)] mt-1 m-0">
            Configure the popup modal that appears on the homepage
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Enable/Disable & Delay */}
        <div className="border border-[var(--admin-border)] rounded-xl p-5 bg-[var(--admin-surface)]">
          <h4 className="text-sm font-semibold text-[var(--admin-ink)] mb-4">Display Settings</h4>
          <div className="form-grid">
            <div className="field">
              <label className="flex items-center gap-2">
                {settings.enabled ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                Modal Status
              </label>
              <select
                value={settings.enabled ? "enabled" : "disabled"}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.value === "enabled" })}
                className="w-full"
              >
                <option value="enabled">Enabled (Show on homepage)</option>
                <option value="disabled">Disabled (Hidden)</option>
              </select>
            </div>
            <div className="field">
              <label>Delay (seconds)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={settings.delaySeconds}
                onChange={(e) => setSettings({ ...settings, delaySeconds: parseInt(e.target.value) || 0 })}
                placeholder="2"
              />
              <span className="text-xs text-[var(--admin-muted)] mt-1 block">
                How long to wait before showing the modal (0-10 seconds)
              </span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="border border-[var(--admin-border)] rounded-xl p-5 bg-[var(--admin-surface)]">
          <h4 className="text-sm font-semibold text-[var(--admin-ink)] mb-4">Modal Content</h4>
          <div className="form-grid">
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Eyebrow Text</label>
              <input
                value={settings.eyebrow}
                onChange={(e) => setSettings({ ...settings, eyebrow: e.target.value })}
                placeholder="Admissions Open · 2083 Intake"
              />
              <span className="text-xs text-[var(--admin-muted)] mt-1 block">
                Small text above the heading (e.g., "Admissions Open")
              </span>
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Heading</label>
              <input
                value={settings.heading}
                onChange={(e) => setSettings({ ...settings, heading: e.target.value })}
                placeholder="Join BBA, BBA-Finance & BCSIT"
              />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Description</label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows={3}
                placeholder="Applications are open for the 2083 intake..."
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="border border-[var(--admin-border)] rounded-xl p-5 bg-[var(--admin-surface)]">
          <h4 className="text-sm font-semibold text-[var(--admin-ink)] mb-4">Action Buttons</h4>
          <div className="form-grid">
            <div className="field">
              <label>Primary Button Label</label>
              <input
                value={settings.primaryButton.label}
                onChange={(e) => setSettings({
                  ...settings,
                  primaryButton: { ...settings.primaryButton, label: e.target.value }
                })}
                placeholder="Apply Now"
              />
            </div>
            <div className="field">
              <label>Primary Button Link</label>
              <input
                value={settings.primaryButton.href}
                onChange={(e) => setSettings({
                  ...settings,
                  primaryButton: { ...settings.primaryButton, href: e.target.value }
                })}
                placeholder="/admission"
              />
            </div>
            <div className="field">
              <label>Secondary Button Label</label>
              <input
                value={settings.secondaryButton.label}
                onChange={(e) => setSettings({
                  ...settings,
                  secondaryButton: { ...settings.secondaryButton, label: e.target.value }
                })}
                placeholder="Entrance Details"
              />
            </div>
            <div className="field">
              <label>Secondary Button Link</label>
              <input
                value={settings.secondaryButton.href}
                onChange={(e) => setSettings({
                  ...settings,
                  secondaryButton: { ...settings.secondaryButton, href: e.target.value }
                })}
                placeholder="/admission"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border border-[var(--admin-border)] rounded-xl p-5 bg-[var(--admin-surface)]">
          <h4 className="text-sm font-semibold text-[var(--admin-ink)] mb-4">Contact Information</h4>
          <div className="field">
            <label>Contact Phone</label>
            <input
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              placeholder="(061) 544761"
            />
            <span className="text-xs text-[var(--admin-muted)] mt-1 block">
              Shown at the bottom of the modal
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn--primary"
          >
            <Save size={14} /> {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
