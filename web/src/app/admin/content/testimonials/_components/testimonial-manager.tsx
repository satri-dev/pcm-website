"use client";

import { useState } from "react";
import { useTestimonials } from "../hooks/use-testimonials";
import TestimonialTable from "./testimonial-table";
import TestimonialViewModal from "./testimonial-view-modal";
import { Testimonial } from "@/types/testimonial";
import { RefreshCw } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface TestimonialManagerProps {
  initialData?: Testimonial[];
}

export default function TestimonialManager({
  initialData,
}: TestimonialManagerProps) {
  const {
    testimonials,
    loading,
    error,
    refresh,
    updateStatus,
    deleteTestimonial,
  } = useTestimonials({ initialData });

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Testimonial | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemName, setDeletingItemName] = useState<string>("");

  const handleView = (item: Testimonial) => {
    setViewingItem(item);
    setIsViewOpen(true);
  };

  const handleDelete = (item: Testimonial) => {
    setDeletingItemId(item.id);
    setDeletingItemName(item.name || "this testimonial");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    try {
      await deleteTestimonial(deletingItemId);
      setDeleteDialogOpen(false);
      setDeletingItemId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleStatusChange = async (
    id: string,
    status: Testimonial["status"]
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
            Testimonials
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Review public testimonials and approve the ones you want to show on
            the website.
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
            <TestimonialTable
              testimonials={testimonials}
              loading={loading}
              onView={handleView}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>

      <TestimonialViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        testimonial={viewingItem}
        onApprove={(item) => handleStatusChange(item.id, "approved")}
        onReject={(item) => handleStatusChange(item.id, "rejected")}
      />

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItemName}
        itemType="testimonial"
        loading={false}
      />
    </main>
  );
}
