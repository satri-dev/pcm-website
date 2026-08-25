"use client";

import { useEffect, useState } from "react";
import PageHeader from "../../_components/dashboard/page-header";
import NewsTable from "./_components/news-table";
import NewsFormModal from "./_components/news-form-modal";
import NewsViewModal from "./_components/news-view-modal";
import { News } from "@/types/news";
import { Plus, RefreshCw } from "lucide-react";

const API_BASE = "/api/admin/content/news";

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingNews, setViewingNews] = useState<News | null>(null);
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
              : `Failed to load news (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setNews(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load news"
        );
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleViewNews = (newsItem: News) => {
    setViewingNews(newsItem);
    setIsViewOpen(true);
  };

  const handleAddNews = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem);
    setIsModalOpen(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Delete failed (HTTP ${res.status})`);
      }
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveNews = async (newsData: News) => {
    setSaving(true);
    try {
      const isEdit = !!editingNews;
      const payload = {
        title: newsData.title,
        slug: newsData.slug,
        excerpt: newsData.excerpt,
        content: newsData.content,
        category: newsData.category,
        image: newsData.image,
        author: newsData.author,
        publishedAt: newsData.publishedAt,
        status: newsData.status,
        featured: newsData.featured,
        views: newsData.views,
        tags: newsData.tags,
        seo: newsData.seo,
      };

      const res = await fetch(
        isEdit ? `${API_BASE}/${editingNews!.id}` : API_BASE,
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

      const saved: News = await res.json();
      setNews((prev) =>
        isEdit
          ? prev.map((n) => (n.id === saved.id ? saved : n))
          : [saved, ...prev]
      );
      setIsModalOpen(false);
      setEditingNews(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="News articles" subtitle="Content · News" />

      <main className="p-6">
        {/* Header outside the panel */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h2 className="m-0 text-2xl font-bold text-[var(--admin-ink)]">
              News articles
            </h2>
            <p className="mt-1 mb-0 text-[0.9rem] text-[var(--admin-muted)]">
              Manage, search and edit news articles.
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
              onClick={handleAddNews}
            >
              <Plus size={16} />
              Add News
            </button>
          </div>
        </div>

        {/* Table panel */}
        <div className="admin-panel">
          <div className="admin-panel__body p-0">
            {error ? (
              <div className="p-6 text-[var(--admin-red)]">{error}</div>
            ) : (
              <NewsTable
                news={news}
                loading={loading}
                onView={handleViewNews}
                onEdit={handleEditNews}
                onDelete={handleDeleteNews}
              />
            )}
          </div>
        </div>
      </main>

      <NewsViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        news={viewingNews}
      />

      <NewsFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        news={editingNews}
        onSave={handleSaveNews}
        saving={saving}
      />
    </>
  );
}
