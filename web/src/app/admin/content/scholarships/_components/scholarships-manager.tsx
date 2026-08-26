"use client";

import { useState } from "react";
import { useScholarships } from "../hooks/use-scholarships";
import ScholarshipsTable from "./scholarships-table";
import ScholarshipsFormModal from "./scholarships-form-modal";
import ScholarshipsViewModal from "./scholarships-view-modal";
import { Scholarship } from "@/types/scholarships";
import { Plus, RefreshCw } from "lucide-react";

interface ScholarshipsManagerProps {
  initialData?: Scholarship[];
}

export default function ScholarshipsManager({ initialData }: ScholarshipsManagerProps) {
  const {
    scholarships,
    loading,
    error,
    refresh,
    createScholarship,
    updateScholarship,
    deleteScholarship,
  } = useScholarships({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingScholarship, setViewingScholarship] = useState<Scholarship | null>(null);
  const [saving, setSaving] = useState(false);

  const handleViewScholarship = (scholarship: Scholarship) => {
    setViewingScholarship(scholarship);
    setIsViewOpen(true);
  };

  const handleAddScholarship = () => {
    setEditingScholarship(null);
    setIsModalOpen(true);
  };

  const handleEditScholarship = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setIsModalOpen(true);
  };

  const handleDeleteScholarship = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scholarship?")) return;
    try {
      await deleteScholarship(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveScholarship = async (scholarshipData: Scholarship) => {
    setSaving(true);
    try {
      if (scholarshipData.id && scholarships.some((s) => s.id === scholarshipData.id)) {
        await updateScholarship(scholarshipData.id, scholarshipData);
      } else {
        await createScholarship(scholarshipData);
      }
      setIsModalOpen(false);
      setEditingScholarship(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Scholarships
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage scholarship schemes, descriptions and availability.
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
            onClick={handleAddScholarship}
          >
            <Plus size={16} />
            Add Scholarship
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <ScholarshipsTable
              scholarships={scholarships}
              loading={loading}
              onView={handleViewScholarship}
              onEdit={handleEditScholarship}
              onDelete={handleDeleteScholarship}
            />
          )}
        </div>
      </div>

      <ScholarshipsViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        scholarship={viewingScholarship}
      />

      <ScholarshipsFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        scholarship={editingScholarship}
        onSave={handleSaveScholarship}
        saving={saving}
      />
    </main>
  );
}
