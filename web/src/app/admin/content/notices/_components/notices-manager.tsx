"use client";

import { useState } from "react";
import { useNotices } from "../hooks/use-notices";
import NoticesTable from "./notices-table";
import NoticesFormModal from "./notices-form-modal";
import NoticesViewModal from "./notices-view-modal";
import { Notice } from "@/types/notices";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemName, setDeletingItemName] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({
    total: 0,
    completed: 0,
    deleting: false,
  });

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

  const handleDeleteNotice = (notice: Notice) => {
    setDeletingItemId(notice.id);
    setDeletingItemName(notice.title || "this item");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    try {
      await deleteNotice(deletingItemId);
      setDeleteDialogOpen(false);
      setDeletingItemId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setBulkDialogOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    const total = ids.length;
    if (total === 0) return;

    setBulkDialogOpen(false);
    setBulkProgress({ total, completed: 0, deleting: true });

    for (let i = 0; i < ids.length; i++) {
      try {
        await deleteNotice(ids[i]);
      } catch {
        // Continue with remaining items
      }
      setBulkProgress((prev) => ({ ...prev, completed: i + 1 }));
    }

    setBulkProgress({ total: 0, completed: 0, deleting: false });
    setSelectedIds(new Set());
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
          {selectedIds.size > 0 && !bulkProgress.deleting && (
            <button
              type="button"
              className="admin-btn bg-red-600 hover:bg-red-700 text-white"
              onClick={handleBulkDelete}
            >
              <Trash2 size={16} />
              Delete Selected ({selectedIds.size})
            </button>
          )}
          <button
            type="button"
            className="admin-btn"
            onClick={refresh}
            disabled={loading || bulkProgress.deleting}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAddNotice}
            disabled={bulkProgress.deleting}
          >
            <Plus size={16} />
            Add Notice
          </button>
        </div>
      </div>

      {bulkProgress.deleting && (
        <div className="mb-4 rounded-lg border border-[var(--admin-line)] bg-[var(--admin-surface)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--admin-ink)]">
              Moving items to trash...
            </span>
            <span className="text-sm text-[var(--admin-muted)]">
              {bulkProgress.completed} of {bulkProgress.total} items
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--admin-surface-2)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--admin-brand)] transition-all duration-300 ease-out"
              style={{ width: `${bulkProgress.total > 0 ? Math.round((bulkProgress.completed / bulkProgress.total) * 100) : 0}%` }}
            />
          </div>
        </div>
      )}

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
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
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

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItemName}
        itemType="notice"
        loading={false}
      />

      <SoftDeleteDialog
        open={bulkDialogOpen}
        onOpenChange={setBulkDialogOpen}
        onConfirm={handleConfirmBulkDelete}
        title={`Move ${selectedIds.size} item${selectedIds.size === 1 ? "" : "s"} to Trash?`}
        description={`Are you sure you want to move ${selectedIds.size} item${selectedIds.size === 1 ? "" : "s"} to trash? You can restore them later from the trash.`}
        confirmText={`Move ${selectedIds.size} item${selectedIds.size === 1 ? "" : "s"} to Trash`}
        loading={false}
      />
    </main>
  );
}
