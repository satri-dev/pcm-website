"use client";

import { useState } from "react";
import { useSurveyResponses } from "../hooks/use-survey-responses";
import { SurveyResponse, SurveyResponseGroup } from "@/types/survey-response";
import SurveyResponseGroups from "./survey-response-groups";
import SurveyResultsViewer from "./survey-responses-viewer";
import { RefreshCw } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface Props {
  initialGroups?: SurveyResponseGroup[];
}

export default function SurveyResponsesManager({ initialGroups }: Props) {
  const { groups, loading, error, refresh, opening, view, openSurvey, closeSurvey, deleteResponse } =
    useSurveyResponses({ initialGroups });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleView = (slug: string) => openSurvey(slug);

  const handleRequestDelete = (response: SurveyResponse) => {
    setDeletingId(response.id);
    setDeletingName(response.respondent?.trim() ? response.respondent.trim() : "this response");
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await deleteResponse(deletingId);
      setDeletingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">Survey Responses</h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Review public survey submissions, grouped survey-wise.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="admin-btn" onClick={refresh} disabled={loading || !!view}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && !view ? (
        <div className="admin-panel">
          <div className="admin-panel__body">
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          </div>
        </div>
      ) : view ? (
        <SurveyResultsViewer
          survey={view.survey}
          responses={view.responses}
          total={view.total}
          onBack={closeSurvey}
          onRequestDelete={handleRequestDelete}
        />
      ) : (
        <div className="admin-panel">
          <div className="admin-panel__body p-0">
            {opening ? (
              <div className="p-6 text-center text-[var(--admin-muted)]">Loading responses…</div>
            ) : (
              <SurveyResponseGroups groups={groups} loading={loading} onView={handleView} />
            )}
          </div>
        </div>
      )}

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingName}
        itemType="response"
        loading={deleting}
      />
    </main>
  );
}
