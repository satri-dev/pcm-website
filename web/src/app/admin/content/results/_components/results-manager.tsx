"use client";

import { useState } from "react";
import { useResults } from "../hooks/use-results";
import ResultsTable from "./results-table";
import ResultsFormModal from "./results-form-modal";
import ResultsViewModal from "./results-view-modal";
import { Result } from "@/types/results";
import { Plus, RefreshCw } from "lucide-react";

interface ResultsManagerProps {
  initialData?: Result[];
}

export default function ResultsManager({ initialData }: ResultsManagerProps) {
  const {
    results,
    loading,
    error,
    refresh,
    createResult,
    updateResult,
    deleteResult,
  } = useResults({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingResult, setViewingResult] = useState<Result | null>(null);
  const [saving, setSaving] = useState(false);

  const handleViewResult = (result: Result) => {
    setViewingResult(result);
    setIsViewOpen(true);
  };

  const handleAddResult = () => {
    setEditingResult(null);
    setIsModalOpen(true);
  };

  const handleEditResult = (result: Result) => {
    setEditingResult(result);
    setIsModalOpen(true);
  };

  const handleDeleteResult = async (id: string) => {
    if (!confirm("Are you sure you want to delete this result?")) return;
    try {
      await deleteResult(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveResult = async (resultData: Result) => {
    setSaving(true);
    try {
      if (resultData.id && results.some((r) => r.id === resultData.id)) {
        await updateResult(resultData.id, resultData);
      } else {
        await createResult(resultData);
      }
      setIsModalOpen(false);
      setEditingResult(null);
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
            Results
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, search and edit academic results.
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
            onClick={handleAddResult}
          >
            <Plus size={16} />
            Add Result
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <ResultsTable
              results={results}
              loading={loading}
              onView={handleViewResult}
              onEdit={handleEditResult}
              onDelete={handleDeleteResult}
            />
          )}
        </div>
      </div>

      <ResultsViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        result={viewingResult}
      />

      <ResultsFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        result={editingResult}
        onSave={handleSaveResult}
        saving={saving}
      />
    </main>
  );
}
