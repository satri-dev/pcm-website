"use client";

import { useState } from "react";
import { useFacilities } from "../hooks/useFacilities";
import FacilitiesTable from "./facilities-table";
import FacilitiesFormModal from "./facilities-form-modal";
import FacilitiesViewModal from "./facilities-view-modal";
import { FacilityItem } from "../types/facilities";
import { Plus, RefreshCw } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface FacilitiesManagerProps {
  initialData?: FacilityItem[];
}

export default function FacilitiesManager({
  initialData,
}: FacilitiesManagerProps) {
  const {
    facilities,
    loading,
    error,
    refresh,
    createFacility,
    updateFacility,
    deleteFacility,
  } = useFacilities({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityItem | null>(
    null,
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingFacility, setViewingFacility] = useState<FacilityItem | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemName, setDeletingItemName] = useState<string>("");

  const handleViewFacility = (facility: FacilityItem) => {
    setViewingFacility(facility);
    setIsViewOpen(true);
  };

  const handleAddFacility = () => {
    setEditingFacility(null);
    setIsModalOpen(true);
  };

  const handleEditFacility = (facility: FacilityItem) => {
    setEditingFacility(facility);
    setIsModalOpen(true);
  };

  const handleDeleteFacility = (facility: FacilityItem) => {
    setDeletingItemId(facility.id);
    setDeletingItemName(facility.name || "this item");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    try {
      await deleteFacility(deletingItemId);
      setDeleteDialogOpen(false);
      setDeletingItemId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveFacility = async (facilityData: FacilityItem) => {
    setSaving(true);
    try {
      if (facilityData.id && facilities.some((f) => f.id === facilityData.id)) {
        await updateFacility(facilityData.id, facilityData);
      } else {
        await createFacility(facilityData);
      }
      setIsModalOpen(false);
      setEditingFacility(null);
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
            Campus Facilities
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, search and edit campus facilities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAddFacility}
          >
            <Plus size={16} />
            Add Facility
          </button>
        </div>
      </div>

      {/* Table panel */}
      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <FacilitiesTable
              facilities={facilities}
              loading={loading}
              onView={handleViewFacility}
              onEdit={handleEditFacility}
              onDelete={handleDeleteFacility}
            />
          )}
        </div>
      </div>

      <FacilitiesViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        facility={viewingFacility}
      />

      <FacilitiesFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        facility={editingFacility}
        onSave={handleSaveFacility}
        saving={saving}
      />

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItemName}
        itemType="facility"
        loading={false}
      />
    </main>
  );
}
