import { useEffect, useState } from "react";
import { CampusMapItem } from "../types/campus";

const API_BASE = "/api/admin/campus/campus-map";

export interface UseCampusMapOptions {
  initialData?: CampusMapItem[];
  pageSize?: number;
}

export interface UseCampusMapReturn {
  landmarks: CampusMapItem[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createLandmark: (data: Partial<CampusMapItem>) => Promise<CampusMapItem>;
  updateLandmark: (
    id: string,
    data: Partial<CampusMapItem>
  ) => Promise<CampusMapItem>;
  deleteLandmark: (id: string) => Promise<void>;
  restoreLandmark: (id: string) => Promise<void>;
  hardDeleteLandmark: (id: string) => Promise<void>;
}

export function useCampusMap({
  initialData,
  pageSize = 100,
}: UseCampusMapOptions = {}): UseCampusMapReturn {
  const [landmarks, setLandmarks] = useState<CampusMapItem[]>(
    initialData ?? []
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    const controller = new AbortController();
    fetch(`${API_BASE}?pageSize=${pageSize}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Your session has expired. Please sign in again."
              : `Failed to load landmarks (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setLandmarks(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load landmarks"
        );
        setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey, pageSize]);

  const refresh = () => {
    setReloadKey((k) => k + 1);
    setLoading(true);
    setError("");
  };

  const createLandmark = async (
    data: Partial<CampusMapItem>
  ): Promise<CampusMapItem> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Create failed (HTTP ${res.status})`);
    }
    const created: CampusMapItem = await res.json();
    setLandmarks((prev) => [created, ...prev]);
    return created;
  };

  const updateLandmark = async (
    id: string,
    data: Partial<CampusMapItem>
  ): Promise<CampusMapItem> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Update failed (HTTP ${res.status})`);
    }
    const updated: CampusMapItem = await res.json();
    setLandmarks((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
    return updated;
  };

  const deleteLandmark = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setLandmarks((prev) => prev.filter((item) => item.id !== id));
  };

  const restoreLandmark = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=restore`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Restore failed (HTTP ${res.status})`);
    }
    refresh();
  };

  const hardDeleteLandmark = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=permanent-delete`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Permanent delete failed (HTTP ${res.status})`);
    }
    setLandmarks((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    landmarks,
    loading,
    error,
    refresh,
    createLandmark,
    updateLandmark,
    deleteLandmark,
    restoreLandmark,
    hardDeleteLandmark,
  };
}
