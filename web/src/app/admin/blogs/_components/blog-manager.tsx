"use client";

import { useState } from "react";
import { useBlog } from "../hooks/useBlog";
import BlogTable from "./blog-table";
import BlogFormModal from "./blog-form-modal";
import { Blog } from "../types/blog";
import { Plus, RefreshCw } from "lucide-react";

interface BlogManagerProps {
  initialData?: Blog[];
}

export default function BlogManager({
  initialData,
}: BlogManagerProps) {
  const {
    blogs,
    loading,
    error,
    refresh,
    createBlog,
    updateBlog,
    deleteBlog,
  } = useBlog({ initialData });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Blog | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAddBlog = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditBlog = (item: Blog) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await deleteBlog(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveBlog = async (data: Blog) => {
    setSaving(true);
    try {
      if (data.id && blogs.some((b) => b.id === data.id)) {
        await updateBlog(data.id, data);
      } else {
        await createBlog(data);
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
            Blog Posts
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, author and publish blog articles.
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
            onClick={handleAddBlog}
          >
            <Plus size={16} />
            Add Post
          </button>
        </div>
      </div>

      {/* Table panel */}
      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <BlogTable
              blogs={blogs}
              onAdd={handleAddBlog}
              onEdit={handleEditBlog}
              onDelete={handleDeleteBlog}
            />
          )}
        </div>
      </div>

      <BlogFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        blog={editingItem}
        onSave={handleSaveBlog}
        saving={saving}
      />
    </main>
  );
}
