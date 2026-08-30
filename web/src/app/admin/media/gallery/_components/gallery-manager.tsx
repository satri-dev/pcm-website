"use client";

import { useState } from "react";
import { useGallery } from "../hooks/use-gallery";
import GalleryTable from "./gallery-table";
import GalleryFormModal from "./gallery-form-modal";
import GalleryViewModal from "./gallery-view-modal";
import { Gallery } from "@/types/gallery";
import { Plus, RefreshCw } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface GalleryManagerProps {
  initialData?: Gallery[];
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
  const [editingItem, setEditingItem] = useState<Gallery | null>(null);
  const [saving, setSaving] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Gallery | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemName, setDeletingItemName] = useState<string>("");

  const handleAddGallery = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleViewGallery = (item: Gallery) => {
    setViewingItem(item);
    setIsViewOpen(true);
  };

  const handleEditGallery = (item: Gallery) => {
    setEditingItem(item);
    setIsModalOpen(true);
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

  const handleSaveGallery = async (data: Gallery) => {
    setSaving(true);
    try {
      if (data.id && gallery.some((g) => g.id === data.id)) {
        await updateGallery(data.id, data);
      } else {
        await createGallery(data);
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
            onClick={handleAddGallery}
          >
            <Plus size={16} />
            Add Photo
          </button>
        </div>
      </div>

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
    </main>
  );
}
