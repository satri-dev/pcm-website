"use client";

import { useState } from "react";
import { useFaqs } from "../hooks/use-faqs";
import FaqsTable from "./faqs-table";
import FaqsFormModal from "./faqs-form-modal";
import FaqsViewModal from "./faqs-view-modal";
import { Faq } from "@/types/faqs";
import { Plus, RefreshCw } from "lucide-react";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";

interface FaqsManagerProps {
  initialData?: Faq[];
}

export default function FaqsManager({ initialData }: FaqsManagerProps) {
  const {
    faqs,
    loading,
    error,
    refresh,
    createFaq,
    updateFaq,
    deleteFaq,
  } = useFaqs({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingFaq, setViewingFaq] = useState<Faq | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemName, setDeletingItemName] = useState<string>("");

  const handleViewFaq = (faq: Faq) => {
    setViewingFaq(faq);
    setIsViewOpen(true);
  };

  const handleAddFaq = () => {
    setEditingFaq(null);
    setIsModalOpen(true);
  };

  const handleEditFaq = (faq: Faq) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const handleDeleteFaq = (faq: Faq) => {
    setDeletingItemId(faq.id);
    setDeletingItemName(faq.question || "this item");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    try {
      await deleteFaq(deletingItemId);
      setDeleteDialogOpen(false);
      setDeletingItemId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveFaq = async (faqData: Faq) => {
    setSaving(true);
    try {
      if (faqData.id && faqs.some((f) => f.id === faqData.id)) {
        await updateFaq(faqData.id, faqData);
      } else {
        await createFaq(faqData);
      }
      setIsModalOpen(false);
      setEditingFaq(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            FAQs
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage frequently asked questions and answers.
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
            onClick={handleAddFaq}
          >
            <Plus size={16} />
            Add FAQ
          </button>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <FaqsTable
              faqs={faqs}
              loading={loading}
              onView={handleViewFaq}
              onEdit={handleEditFaq}
              onDelete={handleDeleteFaq}
            />
          )}
        </div>
      </div>

      <FaqsViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        faq={viewingFaq}
      />

      <FaqsFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        faq={editingFaq}
        onSave={handleSaveFaq}
        saving={saving}
      />

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItemName}
        itemType="FAQ"
        loading={false}
      />
    </main>
  );
}
