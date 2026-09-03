"use client";

import { useState } from "react";
import { useApplications } from "../hooks/use-applications";
import ApplicationTable from "./application-table";
import ApplicationViewModal from "./application-view-modal";
import { Application } from "@/types/application";
import { RefreshCw } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface ApplicationManagerProps {
  initialData?: Application[];
}

export default function ApplicationManager({
  initialData,
}: ApplicationManagerProps) {
  const {
    applications,
    loading,
    error,
    refresh,
    updateStatus,
    deleteApplication,
  } = useApplications({ initialData });

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemName, setDeletingItemName] = useState<string>("");

  const handleView = (app: Application) => {
    setViewingApp(app);
    setIsViewOpen(true);
  };

  const handleDelete = (app: Application) => {
    setDeletingItemId(app.id);
    setDeletingItemName(app.name || "this application");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    try {
      await deleteApplication(deletingItemId);
      setDeleteDialogOpen(false);
      setDeletingItemId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleStatusChange = async (
    id: string,
    status: Application["status"]
  ) => {
    try {
      await updateStatus(id, status);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Applications
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Review admission form submissions and update their status.
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
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <ApplicationTable
              applications={applications}
              loading={loading}
              onView={handleView}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>

      <ApplicationViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        application={viewingApp}
      />

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItemName}
        itemType="application"
        loading={false}
      />
    </main>
  );
}
