/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { Blog } from "../types/blog";

const API_BASE = "/api/admin/media/blogs";

export interface UseBlogOptions {
  initialData?: Blog[];
  pageSize?: number;
}

export interface UseBlogReturn {
  blogs: Blog[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createBlog: (data: Partial<Blog>) => Promise<Blog>;
  updateBlog: (id: string, data: Partial<Blog>) => Promise<Blog>;
  deleteBlog: (id: string) => Promise<void>;
}

export function useBlog({
  initialData,
  pageSize = 50,
}: UseBlogOptions = {}): UseBlogReturn {
  const [blogs, setBlogs] = useState<Blog[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setBlogs(initialData);
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
              : `Failed to load blogs (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setBlogs(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load blogs");
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

  const createBlog = async (data: Partial<Blog>): Promise<Blog> => {
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
    setBlogs((prev) => [...prev, created]);
    return created;
  };

  const updateBlog = async (
    id: string,
    data: Partial<Blog>
  ): Promise<Blog> => {
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
    setBlogs((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteBlog = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setBlogs((prev) => prev.filter((item) => item.id !== id));
  };

  return { blogs, loading, error, refresh, createBlog, updateBlog, deleteBlog };
}
