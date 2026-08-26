"use client";

import { useState } from "react";
import { useDownload } from "../hooks/useDownload";
import DownloadTable from "./download-table";
import DownloadFormModal from "./download-form-modal";
import DownloadViewModal from "./download-view-modal";
import { Download } from "../types/download";
import { Plus, RefreshCw } from "lucide-react";

interface DownloadManagerProps {
  initialData?: Download[];
}

export default function DownloadManager({
  initialData,
}: DownloadManagerProps) {
  const {
    downloads,
    loading,
    error,
    refresh,
    createDownload,
    updateDownload,
    deleteDownload,
  } = useDownload({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Download | null>(null);
  const [saving, setSaving] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Download | null>(null);

  const handleAddDownload = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleViewDownload = (item: Download) => {
    setViewingItem(item);
    setIsViewOpen(true);
  };

  const handleEditDownload = (item: Download) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteDownload = async (id: string) => {
    if (!confirm("Are you sure you want to delete this download item?"))
      return;
    try {
      await deleteDownload(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveDownload = async (data: Download) => {
    setSaving(true);
    try {
      if (data.id && downloads.some((d) => d.id === data.id)) {
        await updateDownload(data.id, data);
      } else {
        await createDownload(data);
      }
      setIsModalOpen(false);
      setEditingItem(null);
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
            Downloads
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, organize and publish downloadable files for students.
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
            onClick={handleAddDownload}
          >
            <Plus size={16} />
            Add Download
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <DownloadTable
              downloads={downloads}
              onAdd={handleAddDownload}
              onView={handleViewDownload}
              onEdit={handleEditDownload}
              onDelete={handleDeleteDownload}
            />
          )}
        </div>
      </div>

      <DownloadFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        download={editingItem}
        onSave={handleSaveDownload}
        saving={saving}
      />

      <DownloadViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        download={viewingItem}
      />
    </main>
  );
}
