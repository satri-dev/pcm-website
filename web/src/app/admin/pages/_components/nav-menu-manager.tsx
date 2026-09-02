"use client";

import { useState } from "react";
import { useNavMenu } from "../hooks/use-nav-menu";
import NavMenuTable from "./nav-menu-table";
import NavMenuFormModal from "./nav-menu-form-modal";
import { NavMenuItem, NavbarSettings } from "@/types/nav-menu";
import { Plus, RefreshCw, Save, Image as ImageIcon } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";
import ImageUpload from "@/components/cloudinary/ImageUpload";

interface NavMenuManagerProps {
  initialData?: NavMenuItem[];
  initialSettings?: NavbarSettings;
}

export default function NavMenuManager({ initialData, initialSettings }: NavMenuManagerProps) {
  const {
    items,
    loading,
    error,
    refresh,
    createNavMenu,
    updateNavMenu,
    deleteNavMenu,
    moveNavMenu,
  } = useNavMenu({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavMenuItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemName, setDeletingItemName] = useState("");

  // Settings state
  const [settings, setSettings] = useState<NavbarSettings>(
    initialSettings || {
      logoUrl: "",
      ctaLabel: "Apply Now",
      ctaHref: "/admission",
      ctaEnabled: true,
    }
  );
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    setSettingsMessage("");
    try {
      const res = await fetch("/api/admin/pages/navbar-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const updated = await res.json();
      setSettings(updated);
      setSettingsMessage("✓ Settings saved successfully!");
      setTimeout(() => setSettingsMessage(""), 3000);
    } catch (err) {
      setSettingsMessage("❌ " + (err instanceof Error ? err.message : "Save failed"));
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: NavMenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: NavMenuItem) => {
    setDeletingItemId(item.id);
    setDeletingItemName(item.label || "this item");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    try {
      await deleteNavMenu(deletingItemId);
      setDeleteDialogOpen(false);
      setDeletingItemId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSave = async (data: NavMenuItem) => {
    setSaving(true);
    try {
      if (data.id && items.some((n) => n.id === data.id)) {
        await updateNavMenu(data.id, data);
      } else {
        await createNavMenu(data);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    try {
      await moveNavMenu(index, direction);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Reorder failed");
    }
  };

  return (
    <main className="p-6">
      {/* Settings Message Toast */}
      {settingsMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-bottom-5 bg-green-50 border-green-200 text-green-700 font-medium">
          {settingsMessage}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Navbar Configuration
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage the logo, Apply Now button, and navigation menu items
          </p>
        </div>
      </div>

      {/* Navbar Settings Section */}
      <div className="admin-panel mb-6">
        <div className="admin-panel__body p-6">
          <h3 className="text-lg font-bold text-[var(--admin-ink)] mb-4">Logo & CTA Button</h3>
          
          <div className="space-y-4 max-w-2xl">
            <div className="field">
              <label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Logo Image
              </label>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={settings.logoUrl}
                      onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <ImageUpload
                      onUpload={(result) => {
                        setSettings({ ...settings, logoUrl: result.secure_url });
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs text-[var(--admin-muted)]">
                  Upload an image or paste the Cloudinary URL above
                </span>
                {settings.logoUrl && (
                  <div className="mt-2">
                    <img
                      src={settings.logoUrl}
                      alt="Logo preview"
                      className="w-20 h-20 rounded-lg border border-[var(--admin-border)] object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.ctaEnabled}
                  onChange={(e) => setSettings({ ...settings, ctaEnabled: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--admin-brand)] focus:ring-[var(--admin-brand)]"
                />
                <span className="font-medium">Enable Apply Button</span>
              </label>
              <span className="text-xs text-[var(--admin-muted)] mt-1 block ml-6">
                Toggle to show or hide the Apply button in the navbar
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ opacity: settings.ctaEnabled ? 1 : 0.5 }}>
              <div className="field">
                <label>Apply Button Label</label>
                <input
                  type="text"
                  value={settings.ctaLabel}
                  onChange={(e) => setSettings({ ...settings, ctaLabel: e.target.value })}
                  placeholder="Apply Now"
                  className="w-full"
                  disabled={!settings.ctaEnabled}
                />
              </div>

              <div className="field">
                <label>Apply Button Link</label>
                <input
                  type="text"
                  value={settings.ctaHref}
                  onChange={(e) => setSettings({ ...settings, ctaHref: e.target.value })}
                  placeholder="/admission"
                  className="w-full"
                  disabled={!settings.ctaEnabled}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={settingsSaving}
                className="admin-btn admin-btn--primary"
              >
                <Save size={14} /> {settingsSaving ? "Saving…" : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Section */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div>
          <h3 className="m-0 text-lg font-bold text-[var(--admin-ink)]">
            Menu Items
          </h3>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Configure navigation links, dropdowns, and mega menus
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="admin-btn"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAdd}
          >
            <Plus size={16} />
            Add Menu Item
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <NavMenuTable
              items={items}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMove={handleMove}
            />
          )}
        </div>
      </div>

      <NavMenuFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={editingItem}
        onSave={handleSave}
        saving={saving}
      />

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItemName}
        itemType="navbar item"
        loading={false}
      />
    </main>
  );
}