"use client";

import { useState } from "react";
import { useNotices } from "../hooks/use-notices";
import NoticesTable from "./notices-table";
import NoticesFormModal from "./notices-form-modal";
import NoticesViewModal from "./notices-view-modal";
import { Notice } from "@/types/notices";
import { Plus, RefreshCw } from "lucide-react";

interface NoticesManagerProps {
  initialData?: Notice[];
}

export default function NoticesManager({ initialData }: NoticesManagerProps) {
  const {
    notices,
    loading,
    error,
    refresh,
    createNotice,
    updateNotice,
    deleteNotice,
  } = useNotices({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);
  const [saving, setSaving] = useState(false);

  const handleViewNotice = (notice: Notice) => {
    setViewingNotice(notice);
    setIsViewOpen(true);
  };

  const handleAddNotice = () => {
    setEditingNotice(null);
    setIsModalOpen(true);
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      await deleteNotice(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveNotice = async (noticeData: Notice) => {
    setSaving(true);
    try {
      if (noticeData.id && notices.some((n) => n.id === noticeData.id)) {
        await updateNotice(noticeData.id, noticeData);
      } else {
        await createNotice(noticeData);
      }
      setIsModalOpen(false);
      setEditingNotice(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6">
      {/* Header outside the panel */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Notices
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, search and edit official notices.
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
            onClick={handleAddNotice}
          >
            <Plus size={16} />
            Add Notice
          </button>
        </div>
      </div>

      {/* Table panel */}
      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <NoticesTable
              notices={notices}
              loading={loading}
              onView={handleViewNotice}
              onEdit={handleEditNotice}
              onDelete={handleDeleteNotice}
            />
          )}
        </div>
      </div>

      <NoticesViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        notice={viewingNotice}
      />

      <NoticesFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        notice={editingNotice}
        onSave={handleSaveNotice}
        saving={saving}
      />
    </main>
  );
}
