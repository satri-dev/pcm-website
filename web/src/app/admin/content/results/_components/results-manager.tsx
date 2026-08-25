"use client";

import { useEffect, useState } from "react";
import ResultsTable from "./results-table";
import ResultsFormModal from "./results-form-modal";
import ResultsViewModal from "./results-view-modal";
import { Result } from "@/types/results";
import { Plus, RefreshCw } from "lucide-react";

const API_BASE = "/api/admin/content/results";

export default function ResultsManager() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingResult, setViewingResult] = useState<Result | null>(null);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}?pageSize=50`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Your session has expired. Please sign in again."
              : `Failed to load results (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setResults(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load results"
        );
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

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
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Delete failed (HTTP ${res.status})`);
      }
      setResults((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveResult = async (resultData: Result) => {
    setSaving(true);
    try {
      const isEdit = !!editingResult;
      const payload = {
        title: resultData.title,
        slug: resultData.slug,
        program: resultData.program,
        date: resultData.date,
        status: resultData.status,
        fileUrl: resultData.fileUrl,
        fileName: resultData.fileName,
        views: resultData.views,
      };

      const res = await fetch(
        isEdit ? `${API_BASE}/${editingResult!.id}` : API_BASE,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error ||
            (isEdit
              ? `Update failed (HTTP ${res.status})`
              : `Create failed (HTTP ${res.status})`)
        );
      }

      const saved: Result = await res.json();
      setResults((prev) =>
        isEdit
          ? prev.map((r) => (r.id === saved.id ? saved : r))
          : [saved, ...prev]
      );
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
