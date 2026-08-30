import { useEffect, useState } from "react";
import { FacilityItem } from "../types/facilities";

const API_BASE = "/api/admin/campus/facilities";

export interface UseFacilitiesOptions {
  initialData?: FacilityItem[];
  pageSize?: number;
}

export interface UseFacilitiesReturn {
  facilities: FacilityItem[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createFacility: (data: Partial<FacilityItem>) => Promise<FacilityItem>;
  updateFacility: (
    id: string,
    data: Partial<FacilityItem>
  ) => Promise<FacilityItem>;
  deleteFacility: (id: string) => Promise<void>;
  restoreFacility: (id: string) => Promise<void>;
  hardDeleteFacility: (id: string) => Promise<void>;
}

export function useFacilities({
  initialData,
  pageSize = 100,
}: UseFacilitiesOptions = {}): UseFacilitiesReturn {
  const [facilities, setFacilities] = useState<FacilityItem[]>(
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
              : `Failed to load facilities (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setFacilities(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load facilities"
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

  const createFacility = async (
    data: Partial<FacilityItem>
  ): Promise<FacilityItem> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Create failed (HTTP ${res.status})`);
    }
    const created: FacilityItem = await res.json();
    setFacilities((prev) => [created, ...prev]);
    return created;
  };

  const updateFacility = async (
    id: string,
    data: Partial<FacilityItem>
  ): Promise<FacilityItem> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Update failed (HTTP ${res.status})`);
    }
    const updated: FacilityItem = await res.json();
    setFacilities((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
    return updated;
  };

  const deleteFacility = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setFacilities((prev) => prev.filter((item) => item.id !== id));
  };

  const restoreFacility = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=restore`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Restore failed (HTTP ${res.status})`);
    }
    refresh();
  };

  const hardDeleteFacility = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=permanent-delete`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Permanent delete failed (HTTP ${res.status})`);
    }
    setFacilities((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    facilities,
    loading,
    error,
    refresh,
    createFacility,
    updateFacility,
    deleteFacility,
    restoreFacility,
    hardDeleteFacility,
  };
}
