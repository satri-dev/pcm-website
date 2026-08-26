"use client";

import { useState } from "react";
import { usePrograms } from "../hooks/use-programs";
import ProgramsTable from "./programs-table";
import ProgramsFormModal from "./programs-form-modal";
import ProgramsViewModal from "./programs-view-modal";
import { Program } from "@/types/programs";
import { Plus, RefreshCw } from "lucide-react";

interface ProgramsManagerProps {
  initialData?: Program[];
}

export default function ProgramsManager({ initialData }: ProgramsManagerProps) {
  const {
    programs,
    loading,
    error,
    refresh,
    createProgram,
    updateProgram,
    deleteProgram,
  } = usePrograms({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingProgram, setViewingProgram] = useState<Program | null>(null);
  const [saving, setSaving] = useState(false);

  const handleViewProgram = (program: Program) => {
    setViewingProgram(program);
    setIsViewOpen(true);
  };

  const handleAddProgram = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      await deleteProgram(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveProgram = async (programData: Program) => {
    setSaving(true);
    try {
      if (programData.id && programs.some((p) => p.id === programData.id)) {
        await updateProgram(programData.id, programData);
      } else {
        await createProgram(programData);
      }
      setIsModalOpen(false);
      setEditingProgram(null);
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
            Programs
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage academic programs, descriptions and eligibility.
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
            onClick={handleAddProgram}
          >
            <Plus size={16} />
            Add Program
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <ProgramsTable
              programs={programs}
              loading={loading}
              onView={handleViewProgram}
              onEdit={handleEditProgram}
              onDelete={handleDeleteProgram}
            />
          )}
        </div>
      </div>

      <ProgramsViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        program={viewingProgram}
      />

      <ProgramsFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        program={editingProgram}
        onSave={handleSaveProgram}
        saving={saving}
      />
    </main>
  );
}
