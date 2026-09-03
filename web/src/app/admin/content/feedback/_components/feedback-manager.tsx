"use client";

import { useState } from "react";
import { useFeedback } from "../hooks/use-feedback";
import FeedbackTable from "./feedback-table";
import FeedbackViewModal from "./feedback-view-modal";
import { Feedback } from "@/types/feedback";
import { RefreshCw } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface FeedbackManagerProps {
  initialData?: Feedback[];
}

export default function FeedbackManager({
  initialData,
}: FeedbackManagerProps) {
  const {
    feedback,
    loading,
    error,
    refresh,
    deleteFeedback,
  } = useFeedback({ initialData });

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Feedback | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemName, setDeletingItemName] = useState<string>("");

  const handleView = (item: Feedback) => {
    setViewingItem(item);
    setIsViewOpen(true);
  };

  const handleDelete = (item: Feedback) => {
    setDeletingItemId(item.id);
    const name = String(item.fields?.name ?? "");
    setDeletingItemName(name || "this feedback submission");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    try {
      await deleteFeedback(deletingItemId);
      setDeleteDialogOpen(false);
      setDeletingItemId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Feedback
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Review feedback submissions from the public feedback form.
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
            <FeedbackTable
              feedback={feedback}
              loading={loading}
              onView={handleView}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <FeedbackViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        feedback={viewingItem}
      />

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItemName}
        itemType="feedback"
        loading={false}
      />
    </main>
  );
}
