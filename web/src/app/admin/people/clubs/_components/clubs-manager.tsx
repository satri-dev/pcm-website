"use client";

import { Club } from "@/types/clubs";
import { useClubs } from "../hooks/use-clubs";
import ClubsTable from "./clubs-table";
import ClubsFormModal from "./clubs-form-modal";
import ClubsViewModal from "./clubs-view-modal";
import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

interface ClubsManagerProps {
  initialData?: Club[];
}

export default function ClubsManager({ initialData }: ClubsManagerProps) {
  const { clubs, loading, error, refresh, createClub, updateClub, deleteClub } = useClubs({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Club | null>(null);
  const [saving, setSaving] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Club | null>(null);

  const handleAdd = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleView = (item: Club) => { setViewingItem(item); setIsViewOpen(true); };
  const handleEdit = (item: Club) => { setEditingItem(item); setIsModalOpen(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this club?")) return;
    try { await deleteClub(id); } catch (err) { alert(err instanceof Error ? err.message : "Delete failed"); }
  };

  const handleSave = async (data: Club) => {
    setSaving(true);
    try {
      if (data.id && clubs.some((c) => c.id === data.id)) {
        await updateClub(data.id, data);
      } else {
        await createClub(data);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">Clubs</h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">Manage student clubs, categories, and coordinators.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="admin-btn" onClick={refresh} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={handleAdd}>
            <Plus size={16} /> Add Club
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <ClubsTable clubs={clubs} onAdd={handleAdd} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>

      <ClubsFormModal open={isModalOpen} onOpenChange={setIsModalOpen} club={editingItem} onSave={handleSave} saving={saving} />
      <ClubsViewModal open={isViewOpen} onOpenChange={setIsViewOpen} club={viewingItem} />
    </main>
  );
}
