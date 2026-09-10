"use client";

import { useState } from "react";
import { useBlogStudents } from "../hooks/use-blog-students";
import BlogStudentTable from "./blog-student-table";
import BlogStudentViewModal from "./blog-student-view-modal";
import StudentBlogFormModal from "@/components/blog-student/student-blog-form-modal";
import { SoftDeleteDialog } from "@/components/shared/SoftDeleteDialog";
import { BlogStudent } from "@/types/blog-student";
import { RefreshCw, Trash2 } from "lucide-react";

interface BlogStudentManagerProps {
  initialData?: BlogStudent[];
}

export default function BlogStudentManager({
  initialData,
}: BlogStudentManagerProps) {
  const {
    items,
    loading,
    error,
    refresh,
    updateStatus,
    updateItem,
    deleteItem,
  } = useBlogStudents({ initialData });

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<BlogStudent | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogStudent | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<BlogStudent | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({
    total: 0,
    completed: 0,
    deleting: false,
  });

  const handleView = (item: BlogStudent) => {
    setViewingItem(item);
    setIsViewOpen(true);
  };

  const handleEdit = (item: BlogStudent) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleToggleStatus = async (item: BlogStudent) => {
    try {
      await updateStatus(
        item.id,
        item.status === "approved" ? "pending" : "approved"
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleSaveEdit = async (values: {
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    image?: string;
    date: string;
    tag: string;
    author: string;
    category: string;
  }) => {
    if (!editingItem) return;
    setSaving(true);
    try {
      const updated = await updateItem(editingItem.id, {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        body: values.body,
        image: values.image || "",
        date: values.date,
        tag: values.tag,
        author: values.author,
        category: values.category,
      });
      setEditingItem(updated);
      setIsEditOpen(false);
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: BlogStudent) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteItem(deletingItem.id);
      setDeleteDialogOpen(false);
      setDeletingItem(null);
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
        await deleteItem(ids[i]);
      } catch {
        // Continue with remaining items
      }
      setBulkProgress((prev) => ({ ...prev, completed: i + 1 }));
    }

    setBulkProgress({ total: 0, completed: 0, deleting: false });
    setSelectedIds(new Set());
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
            Student Blog
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Review public student article submissions and approve them before
            they appear on /blogs-student. Approve, edit or hide any article.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && !bulkProgress.deleting && (
            <button
              type="button"
              className="admin-btn bg-red-600 hover:bg-red-700 text-white"
              onClick={handleBulkDelete}
            >
              <Trash2 size={16} />
              Delete Selected ({selectedIds.size})
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
        </div>
      </div>

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
              style={{ width: `${bulkProgress.total > 0 ? Math.round((bulkProgress.completed / bulkProgress.total) * 100) : 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <BlogStudentTable
              items={items}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          )}
        </div>
      </div>

      <BlogStudentViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        item={viewingItem}
      />

      <StudentBlogFormModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initial={editingItem}
        onSubmit={handleSaveEdit}
        submitting={saving}
        title="Edit Article"
      />

      <SoftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={deletingItem?.title || ""}
        itemType="student article"
        loading={false}
      />

      <SoftDeleteDialog
        open={bulkDialogOpen}
        onOpenChange={setBulkDialogOpen}
        onConfirm={handleConfirmBulkDelete}
        title={`Move ${selectedIds.size} item${selectedIds.size === 1 ? "" : "s"} to Trash?`}
        description={`Are you sure you want to move ${selectedIds.size} item${selectedIds.size === 1 ? "" : "s"} to trash? You can restore them later from the trash.`}
        confirmText={`Move ${selectedIds.size} item${selectedIds.size === 1 ? "" : "s"} to Trash`}
        loading={false}
      />
    </main>
  );
}