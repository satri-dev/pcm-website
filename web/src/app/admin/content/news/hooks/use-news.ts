import { useEffect, useRef, useState } from "react";
import { News } from "@/types/news";

const API_BASE = "/api/admin/content/news";

export interface UseNewsOptions {
  initialData?: News[];
  pageSize?: number;
}

export interface UseNewsReturn {
  news: News[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createNews: (data: Partial<News>) => Promise<News>;
  updateNews: (id: string, data: Partial<News>) => Promise<News>;
  deleteNews: (id: string) => Promise<void>;
}

export function useNews({
  initialData,
  pageSize = 50,
}: UseNewsOptions = {}): UseNewsReturn {
  const [news, setNews] = useState<News[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setNews(initialData);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    fetch(`${API_BASE}?pageSize=${pageSize}`, { signal: controller.signal })
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
        setError(err instanceof Error ? err.message : "Failed to load news");
        setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [reloadKey.current, initialData, pageSize]);

  const refresh = () => {
    reloadKey.current += 1;
    setLoading(true);
  };

  const createNews = async (data: Partial<News>): Promise<News> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Create failed (HTTP ${res.status})`);
    }
    const created = await res.json();
    setNews((prev) => [created, ...prev]);
    return created;
  };

  const updateNews = async (
    id: string,
    data: Partial<News>
  ): Promise<News> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Update failed (HTTP ${res.status})`);
    }
    const updated = await res.json();
    setNews((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteNews = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  return { news, loading, error, refresh, createNews, updateNews, deleteNews };
}
