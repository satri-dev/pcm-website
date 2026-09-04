"use client";

import { useState } from "react";
import { useSurveys } from "../hooks/use-surveys";
import SurveysTable from "./surveys-table";
import SurveysFormModal from "./surveys-form-modal";
import SurveysViewModal from "./surveys-view-modal";
import { Survey } from "@/types/surveys";
import { Plus, RefreshCw } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface SurveysManagerProps {
  initialData?: Survey[];
}

export default function SurveysManager({ initialData }: SurveysManagerProps) {
  const {
    surveys,
    loading,
    error,
    refresh,
    createSurvey,
    updateSurvey,
    deleteSurvey,
  } = useSurveys({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingSurvey, setViewingSurvey] = useState<Survey | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemName, setDeletingItemName] = useState<string>("");

  const handleViewSurvey = (survey: Survey) => {
    setViewingSurvey(survey);
    setIsViewOpen(true);
  };

  const handleAddSurvey = () => {
    setEditingSurvey(null);
    setIsModalOpen(true);
  };

  const handleEditSurvey = (survey: Survey) => {
    setEditingSurvey(survey);
    setIsModalOpen(true);
  };

  const handleDeleteSurvey = (survey: Survey) => {
    setDeletingItemId(survey.id);
    setDeletingItemName(survey.title || "this item");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    try {
      await deleteSurvey(deletingItemId);
      setDeleteDialogOpen(false);
      setDeletingItemId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveSurvey = async (surveyData: Survey) => {
    setSaving(true);
    try {
      if (surveyData.id && surveys.some((s) => s.id === surveyData.id)) {
        await updateSurvey(surveyData.id, surveyData);
      } else {
        await createSurvey(surveyData);
      }
      setIsModalOpen(false);
      setEditingSurvey(null);
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
            Surveys
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, search and edit surveys with dynamic questionnaires.
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
            onClick={handleAddSurvey}
          >
            <Plus size={16} />
            Add Survey
          </button>
        </div>
      </div>

      {/* Table panel */}
      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <SurveysTable
              surveys={surveys}
              loading={loading}
              onView={handleViewSurvey}
              onEdit={handleEditSurvey}
              onDelete={handleDeleteSurvey}
            />
          )}
        </div>
      </div>

      <SurveysViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        survey={viewingSurvey}
      />

      <SurveysFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        survey={editingSurvey}
        onSave={handleSaveSurvey}
        saving={saving}
      />

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItemName}
        itemType="survey"
        loading={false}
      />
    </main>
  );
}