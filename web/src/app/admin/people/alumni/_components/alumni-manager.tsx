"use client";

import { Alumni } from "@/types/alumni";
import { useAlumni } from "../hooks/use-alumni";
import AlumniTable from "./alumni-table";
import AlumniFormModal from "./alumni-form-modal";
import AlumniViewModal from "./alumni-view-modal";
import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

interface AlumniManagerProps { initialData?: Alumni[]; programCodes?: string[]; }

export default function AlumniManager({ initialData, programCodes }: AlumniManagerProps) {
  const { alumni, loading, error, refresh, createAlumni, updateAlumni, deleteAlumni } = useAlumni({ initialData });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Alumni | null>(null);
  const [saving, setSaving] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Alumni | null>(null);

  const handleAdd = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleView = (item: Alumni) => { setViewingItem(item); setIsViewOpen(true); };
  const handleEdit = (item: Alumni) => { setEditingItem(item); setIsModalOpen(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alumni record?")) return;
    try { await deleteAlumni(id); } catch (err) { alert(err instanceof Error ? err.message : "Delete failed"); }
  };
  const handleSave = async (data: Alumni) => {
    setSaving(true);
    try {
      if (data.id && alumni.some((a) => a.id === data.id)) { await updateAlumni(data.id, data); } else { await createAlumni(data); }
      setIsModalOpen(false); setEditingItem(null);
    } catch (err) { alert(err instanceof Error ? err.message : "Save failed"); } finally { setSaving(false); }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">Alumni</h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">Manage, search and edit alumni spotlight.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="admin-btn" onClick={refresh} disabled={loading}><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={handleAdd}><Plus size={16} /> Add Alumni</button>
        </div>
      </div>
      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? <div className="p-6 text-[var(--admin-red)]">{error}</div> : <AlumniTable alumni={alumni} onAdd={handleAdd} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />}
        </div>
      </div>
      <AlumniFormModal open={isModalOpen} onOpenChange={setIsModalOpen} alumni={editingItem} onSave={handleSave} saving={saving} programCodes={programCodes} />
      <AlumniViewModal open={isViewOpen} onOpenChange={setIsViewOpen} alumni={viewingItem} />
    </main>
  );
}
