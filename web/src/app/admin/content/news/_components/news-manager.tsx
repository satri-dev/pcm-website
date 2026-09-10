"use client";

import { useState } from "react";
import { useNews } from "../hooks/use-news";
import NewsTable from "./news-table";
import NewsFormModal from "./news-form-modal";
import NewsViewModal from "./news-view-modal";
import { News } from "@/types/news";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface NewsManagerProps {
  initialData?: News[];
}

export default function NewsManager({ initialData }: NewsManagerProps) {
  const {
    news,
    loading,
    error,
    refresh,
    createNews,
    updateNews,
    deleteNews,
  } = useNews({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingNews, setViewingNews] = useState<News | null>(null);
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

  const handleViewNews = (newsItem: News) => {
    setViewingNews(newsItem);
    setIsViewOpen(true);
  };

  const handleAddNews = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem);
    setIsModalOpen(true);
  };

  const handleDeleteNews = (newsItem: News) => {
    setDeletingItemId(newsItem.id);
    setDeletingItemName(newsItem.title || "this item");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    try {
      await deleteNews(deletingItemId);
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
        await deleteNews(ids[i]);
      } catch {
        // Continue with remaining items
      }
      setBulkProgress((prev) => ({ ...prev, completed: i + 1 }));
    }

    setBulkProgress({ total: 0, completed: 0, deleting: false });
    setSelectedIds(new Set());
  };

  const handleSaveNews = async (newsData: News) => {
    setSaving(true);
    try {
      if (newsData.id && news.some((n) => n.id === newsData.id)) {
        await updateNews(newsData.id, newsData);
      } else {
        await createNews(newsData);
      }
      setIsModalOpen(false);
      setEditingNews(null);
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
            News articles
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, search and edit news articles.
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
            onClick={handleAddNews}
            disabled={bulkProgress.deleting}
          >
            <Plus size={16} />
            Add News
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
            <NewsTable
              news={news}
              loading={loading}
              onView={handleViewNews}
              onEdit={handleEditNews}
              onDelete={handleDeleteNews}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          )}
        </div>
      </div>

      <NewsViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        news={viewingNews}
      />

      <NewsFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        news={editingNews}
        onSave={handleSaveNews}
        saving={saving}
      />

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItemName}
        itemType="news article"
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
