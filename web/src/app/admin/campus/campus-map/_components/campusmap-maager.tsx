"use client";

import { useState } from "react";
import { useCampusMap } from "../hooks/useCampus";
import CampusMapTable from "./campus-map-table";
import CampusMapFormModal from "./campusmap-form-modal";
import CampusMapViewModal from "./campusmap-view-modal";
import { CampusMapItem } from "../types/campus";
import { Plus } from "lucide-react";

interface CampusMapManagerProps {
  initialData?: CampusMapItem[];
}

export default function CampusMapManager({
  initialData,
}: CampusMapManagerProps) {
  const {
    landmarks,
    loading,
    error,
    refresh,
    createLandmark,
    updateLandmark,
    deleteLandmark,
  } = useCampusMap({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLandmark, setEditingLandmark] = useState<CampusMapItem | null>(
    null,
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingLandmark, setViewingLandmark] = useState<CampusMapItem | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  const handleViewLandmark = (landmark: CampusMapItem) => {
    setViewingLandmark(landmark);
    setIsViewOpen(true);
  };

  const handleAddLandmark = () => {
    setEditingLandmark(null);
    setIsModalOpen(true);
  };

  const handleEditLandmark = (landmark: CampusMapItem) => {
    setEditingLandmark(landmark);
    setIsModalOpen(true);
  };

  const handleDeleteLandmark = async (id: string) => {
    if (!confirm("Are you sure you want to delete this landmark?")) return;
    try {
      await deleteLandmark(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveLandmark = async (landmarkData: CampusMapItem) => {
    setSaving(true);
    try {
      if (landmarkData.id && landmarks.some((l) => l.id === landmarkData.id)) {
        await updateLandmark(landmarkData.id, landmarkData);
      } else {
        await createLandmark(landmarkData);
      }
      setIsModalOpen(false);
      setEditingLandmark(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Campus Map
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, search and edit campus map landmarks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAddLandmark}
          >
            <Plus size={16} />
            Add Landmark
          </button>
        </div>
      </div>

      {/* Table panel */}
      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <CampusMapTable
              landmarks={landmarks}
              loading={loading}
              onView={handleViewLandmark}
              onEdit={handleEditLandmark}
              onDelete={handleDeleteLandmark}
            />
          )}
        </div>
      </div>

      <CampusMapViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        landmark={viewingLandmark}
      />

      <CampusMapFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        landmark={editingLandmark}
        onSave={handleSaveLandmark}
        saving={saving}
      />
    </main>
  );
}
