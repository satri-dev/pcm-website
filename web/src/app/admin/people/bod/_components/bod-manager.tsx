"use client";

import { Bod } from "@/types/bod";
import { useBod } from "../hooks/use-bod";
import BodTable from "./bod-table";
import BodFormModal from "./bod-form-modal";
import BodViewModal from "./bod-view-modal";
import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

interface BodManagerProps {
  initialData?: Bod[];
}

export default function BodManager({ initialData }: BodManagerProps) {
  const { bod, loading, error, refresh, createBod, updateBod, deleteBod } = useBod({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Bod | null>(null);
  const [saving, setSaving] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Bod | null>(null);

  const handleAdd = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleView = (item: Bod) => { setViewingItem(item); setIsViewOpen(true); };
  const handleEdit = (item: Bod) => { setEditingItem(item); setIsModalOpen(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this board member?")) return;
    try { await deleteBod(id); } catch (err) { alert(err instanceof Error ? err.message : "Delete failed"); }
  };

  const handleSave = async (data: Bod) => {
    setSaving(true);
    try {
      if (data.id && bod.some((b) => b.id === data.id)) {
        await updateBod(data.id, data);
      } else {
        await createBod(data);
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
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">Board of Directors</h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">Manage board of directors members and their details.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="admin-btn" onClick={refresh} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={handleAdd}>
            <Plus size={16} /> Add Member
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <BodTable bod={bod} onAdd={handleAdd} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>

      <BodFormModal open={isModalOpen} onOpenChange={setIsModalOpen} bod={editingItem} onSave={handleSave} saving={saving} />
      <BodViewModal open={isViewOpen} onOpenChange={setIsViewOpen} bod={viewingItem} />
    </main>
  );
}
