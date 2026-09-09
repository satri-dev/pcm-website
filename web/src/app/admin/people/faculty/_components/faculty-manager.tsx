"use client";

import { Faculty, FACULTY_GROUPS } from "@/types/faculty";
import { useFaculty } from "../hooks/use-faculty";
import FacultyTable from "./faculty-table";
import FacultyFormModal from "./faculty-form-modal";
import FacultyViewModal from "./faculty-view-modal";
import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

interface FacultyManagerProps {
  initialData?: Faculty[];
}

export default function FacultyManager({ initialData }: FacultyManagerProps) {
  const { faculty, loading, error, refresh, createFaculty, updateFaculty, deleteFaculty } = useFaculty({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Faculty | null>(null);
  const [saving, setSaving] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Faculty | null>(null);

  const handleAdd = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleView = (item: Faculty) => { setViewingItem(item); setIsViewOpen(true); };
  const handleEdit = (item: Faculty) => { setEditingItem(item); setIsModalOpen(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this faculty member?")) return;
    try { await deleteFaculty(id); } catch (err) { alert(err instanceof Error ? err.message : "Delete failed"); }
  };

  const handleSave = async (data: Faculty) => {
    setSaving(true);
    try {
      if (data.id && faculty.some((f) => f.id === data.id)) {
        await updateFaculty(data.id, data);
      } else {
        await createFaculty(data);
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
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">Faculty & Staff</h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">Manage, search and edit faculty & staff.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="admin-btn" onClick={refresh} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={handleAdd}>
            <Plus size={16} /> Add Staff
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <FacultyTable faculty={faculty} onAdd={handleAdd} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>

      <FacultyFormModal open={isModalOpen} onOpenChange={setIsModalOpen} faculty={editingItem} onSave={handleSave} saving={saving} />
      <FacultyViewModal open={isViewOpen} onOpenChange={setIsViewOpen} faculty={viewingItem} />
    </main>
  );
}
