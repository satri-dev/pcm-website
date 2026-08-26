import { useEffect, useRef, useState } from "react";
import { Gallery } from "@/types/gallery";

const API_BASE = "/api/admin/media/gallery";

export interface UseGalleryOptions {
  initialData?: Gallery[];
  pageSize?: number;
}

export interface UseGalleryReturn {
  gallery: Gallery[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createGallery: (data: Partial<Gallery>) => Promise<Gallery>;
  updateGallery: (id: string, data: Partial<Gallery>) => Promise<Gallery>;
  deleteGallery: (id: string) => Promise<void>;
  restoreGallery: (id: string) => Promise<void>;
  hardDeleteGallery: (id: string) => Promise<void>;
}

export function useGallery({
  initialData,
  pageSize = 50,
}: UseGalleryOptions = {}): UseGalleryReturn {
  const [gallery, setGallery] = useState<Gallery[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setGallery(initialData);
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
              : `Failed to load gallery (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setGallery(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load gallery"
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

  const createGallery = async (data: Partial<Gallery>): Promise<Gallery> => {
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
    setGallery((prev) => [...prev, created]);
    return created;
  };

  const updateGallery = async (
    id: string,
    data: Partial<Gallery>
  ): Promise<Gallery> => {
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
    setGallery((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteGallery = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setGallery((prev) => prev.filter((item) => item.id !== id));
  };

  const restoreGallery = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=restore`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Restore failed (HTTP ${res.status})`);
    }
    refresh();
  };

  const hardDeleteGallery = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=permanent-delete`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Permanent delete failed (HTTP ${res.status})`);
    }
    setGallery((prev) => prev.filter((item) => item.id !== id));
  };

  return { gallery, loading, error, refresh, createGallery, updateGallery, deleteGallery, restoreGallery, hardDeleteGallery };
}
