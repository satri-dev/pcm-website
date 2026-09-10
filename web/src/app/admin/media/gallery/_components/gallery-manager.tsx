"use client";

import { useState } from "react";
import { useGallery } from "../hooks/use-gallery";
import GalleryTable from "./gallery-table";
import GalleryFormModal from "./gallery-form-modal";
import GalleryVideoFormModal from "./gallery-video-form-modal";
import GalleryViewModal from "./gallery-view-modal";
import { Gallery } from "@/types/gallery";
import { Plus, RefreshCw, Video, Trash2 } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface GalleryManagerProps {
  initialData?: Gallery[];
}

interface BulkProgress {
  total: number;
  completed: number;
  deleting: boolean;
}

export default function GalleryManager({
  initialData,
}: GalleryManagerProps) {
  const {
    gallery,
    loading,
    error,
    refresh,
    createGallery,
    updateGallery,
    deleteGallery,
  } = useGallery({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Gallery | null>(null);
  const [saving, setSaving] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Gallery | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemName, setDeletingItemName] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<BulkProgress>({
    total: 0,
    completed: 0,
    deleting: false,
  });

  const handleAddGallery = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleAddVideo = () => {
    setEditingItem(null);
    setIsVideoModalOpen(true);
  };

  const handleViewGallery = (item: Gallery) => {
    setViewingItem(item);
    setIsViewOpen(true);
  };

  const handleEditGallery = (item: Gallery) => {
    setEditingItem(item);
    if (item.type === "video") {
      setIsVideoModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDeleteGallery = (gallery: Gallery) => {
    setDeletingItemId(gallery.id);
    setDeletingItemName(gallery.title || "this item");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    try {
      await deleteGallery(deletingItemId);
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
        await deleteGallery(ids[i]);
      } catch {
        // Continue deleting remaining items even if one fails
      }
      setBulkProgress((prev) => ({ ...prev, completed: i + 1 }));
    }

    setBulkProgress({ total: 0, completed: 0, deleting: false });
    setSelectedIds(new Set());
  };

  const handleSaveGallery = async (data: Gallery) => {
    setSaving(true);
    try {
      if (data.id && gallery.some((g) => g.id === data.id)) {
        await updateGallery(data.id, data);
      } else {
        await createGallery(data);
      }
      setIsModalOpen(false);
      setIsVideoModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = selectedIds.size;
  const bulkProgressPercent =
    bulkProgress.total > 0
      ? Math.round((bulkProgress.completed / bulkProgress.total) * 100)
      : 0;

  return (
    <main className="p-6">
      {/* Header outside the panel */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Photo Gallery
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, organize and publish photo albums.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && !bulkProgress.deleting && (
            <button
              type="button"
              className="admin-btn bg-red-600 hover:bg-red-700 text-white"
              onClick={handleBulkDelete}
            >
              <Trash2 size={16} />
              Delete Selected ({selectedCount})
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
            className="admin-btn"
            onClick={handleAddVideo}
            disabled={bulkProgress.deleting}
          >
            <Video size={16} />
            Add Video
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAddGallery}
            disabled={bulkProgress.deleting}
          >
            <Plus size={16} />
            Add Photo
          </button>
        </div>
      </div>

      {/* Bulk delete progress bar */}
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
              style={{ width: `${bulkProgressPercent}%` }}
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
            <GalleryTable
              gallery={gallery}
              onAdd={handleAddGallery}
              onView={handleViewGallery}
              onEdit={handleEditGallery}
              onDelete={handleDeleteGallery}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          )}
        </div>
      </div>

      <GalleryFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        gallery={editingItem}
        onSave={handleSaveGallery}
        saving={saving}
      />

      <GalleryVideoFormModal
        open={isVideoModalOpen}
        onOpenChange={setIsVideoModalOpen}
        gallery={editingItem}
        onSave={handleSaveGallery}
        saving={saving}
      />

      <GalleryViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        gallery={viewingItem}
      />

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItemName}
        itemType="gallery item"
        loading={false}
      />

      <SoftDeleteDialog
        open={bulkDialogOpen}
        onOpenChange={setBulkDialogOpen}
        onConfirm={handleConfirmBulkDelete}
        title={`Move ${selectedCount} item${selectedCount === 1 ? "" : "s"} to Trash?`}
        description={`Are you sure you want to move ${selectedCount} item${selectedCount === 1 ? "" : "s"} to trash? You can restore them later from the trash.`}
        confirmText={`Move ${selectedCount} item${selectedCount === 1 ? "" : "s"} to Trash`}
        loading={false}
      />
    </main>
  );
}
