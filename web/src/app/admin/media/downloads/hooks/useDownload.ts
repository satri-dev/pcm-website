/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { Download } from "../types/download";

const API_BASE = "/api/admin/media/downloads";

export interface UseDownloadOptions {
  initialData?: Download[];
  pageSize?: number;
}

export interface UseDownloadReturn {
  downloads: Download[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createDownload: (data: Partial<Download>) => Promise<Download>;
  updateDownload: (id: string, data: Partial<Download>) => Promise<Download>;
  deleteDownload: (id: string) => Promise<void>;
  restoreDownload: (id: string) => Promise<void>;
  hardDeleteDownload: (id: string) => Promise<void>;
}

export function useDownload({
  initialData,
  pageSize = 50,
}: UseDownloadOptions = {}): UseDownloadReturn {
  const [downloads, setDownloads] = useState<Download[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setDownloads(initialData);
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
              : `Failed to load downloads (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setDownloads(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load downloads"
        );
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

  const createDownload = async (
    data: Partial<Download>
  ): Promise<Download> => {
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
    setDownloads((prev) => [...prev, created]);
    return created;
  };

  const updateDownload = async (
    id: string,
    data: Partial<Download>
  ): Promise<Download> => {
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
    setDownloads((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
    return updated;
  };

  const deleteDownload = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setDownloads((prev) => prev.filter((item) => item.id !== id));
  };

  const restoreDownload = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=restore`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Restore failed (HTTP ${res.status})`);
    }
    refresh();
  };

  const hardDeleteDownload = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=permanent-delete`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Permanent delete failed (HTTP ${res.status})`);
    }
    setDownloads((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    downloads,
    loading,
    error,
    refresh,
    createDownload,
    updateDownload,
    deleteDownload,
    restoreDownload,
    hardDeleteDownload,
  };
}
