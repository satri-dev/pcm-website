"use client";

import { useState } from "react";
import { useNavMenu } from "../hooks/use-nav-menu";
import NavMenuTable from "./nav-menu-table";
import NavMenuFormModal from "./nav-menu-form-modal";
import { NavMenuItem } from "@/types/nav-menu";
import { Plus, RefreshCw } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface NavMenuManagerProps {
  initialData?: NavMenuItem[];
}

export default function NavMenuManager({ initialData }: NavMenuManagerProps) {
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
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Navbar Menus
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage the top navigation bar. Changes publish to the public
            website immediately.
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
            Add Navbar Item
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