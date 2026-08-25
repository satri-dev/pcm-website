"use client";

import { useEffect, useState } from "react";
import NoticesTable from "./notices-table";
import NoticesFormModal from "./notices-form-modal";
import NoticesViewModal from "./notices-view-modal";
import { Notice } from "@/types/notices";
import { Plus, RefreshCw } from "lucide-react";

const API_BASE = "/api/admin/content/notices";

export default function NoticesManager() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}?pageSize=50`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Your session has expired. Please sign in again."
              : `Failed to load notices (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setNotices(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load notices"
        );
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleViewNotice = (notice: Notice) => {
    setViewingNotice(notice);
    setIsViewOpen(true);
  };

  const handleAddNotice = () => {
    setEditingNotice(null);
    setIsModalOpen(true);
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Delete failed (HTTP ${res.status})`);
      }
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveNotice = async (noticeData: Notice) => {
    setSaving(true);
    try {
      const isEdit = !!editingNotice;
      const payload = {
        title: noticeData.title,
        slug: noticeData.slug,
        description: noticeData.description,
        category: noticeData.category,
        date: noticeData.date,
        status: noticeData.status,
        fileUrl: noticeData.fileUrl,
        fileName: noticeData.fileName,
        views: noticeData.views,
      };

      const res = await fetch(
        isEdit ? `${API_BASE}/${editingNotice!.id}` : API_BASE,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error ||
            (isEdit
              ? `Update failed (HTTP ${res.status})`
              : `Create failed (HTTP ${res.status})`)
        );
      }

      const saved: Notice = await res.json();
      setNotices((prev) =>
        isEdit
          ? prev.map((n) => (n.id === saved.id ? saved : n))
          : [saved, ...prev]
      );
      setIsModalOpen(false);
      setEditingNotice(null);
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
            Notices
          </h2>
          <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
            Manage, search and edit official notices.
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
            onClick={handleAddNotice}
          >
            <Plus size={16} />
            Add Notice
          </button>
        </div>
      </div>

      {/* Table panel */}
      <div className="admin-panel">
        <div className="admin-panel__body p-0">
          {error ? (
            <div className="p-6 text-[var(--admin-red)]">{error}</div>
          ) : (
            <NoticesTable
              notices={notices}
              loading={loading}
              onView={handleViewNotice}
              onEdit={handleEditNotice}
              onDelete={handleDeleteNotice}
            />
          )}
        </div>
      </div>

      <NoticesViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        notice={viewingNotice}
      />

      <NoticesFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        notice={editingNotice}
        onSave={handleSaveNotice}
        saving={saving}
      />
    </main>
  );
}
