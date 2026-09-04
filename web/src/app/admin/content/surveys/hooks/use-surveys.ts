import { useEffect, useRef, useState } from "react";
import { Survey } from "@/types/surveys";

const API_BASE = "/api/admin/content/surveys";

export interface UseSurveysOptions {
  initialData?: Survey[];
  pageSize?: number;
}

export interface UseSurveysReturn {
  surveys: Survey[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createSurvey: (data: Partial<Survey>) => Promise<Survey>;
  updateSurvey: (id: string, data: Partial<Survey>) => Promise<Survey>;
  deleteSurvey: (id: string) => Promise<void>;
  restoreSurvey: (id: string) => Promise<void>;
  hardDeleteSurvey: (id: string) => Promise<void>;
}

export function useSurveys({
  initialData,
  pageSize = 50,
}: UseSurveysOptions = {}): UseSurveysReturn {
  const [surveys, setSurveys] = useState<Survey[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    // Skip fetch if we have initialData
    if (initialData) {
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
              : `Failed to load surveys (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setSurveys(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load surveys");
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

  const createSurvey = async (data: Partial<Survey>): Promise<Survey> => {
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
    setSurveys((prev) => [created, ...prev]);
    return created;
  };

  const updateSurvey = async (
    id: string,
    data: Partial<Survey>
  ): Promise<Survey> => {
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
    setSurveys((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteSurvey = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setSurveys((prev) => prev.filter((item) => item.id !== id));
  };

  const restoreSurvey = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=restore`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Restore failed (HTTP ${res.status})`);
    }
  };

  const hardDeleteSurvey = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=permanent-delete`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Permanent delete failed (HTTP ${res.status})`);
    }
  };

  return { surveys, loading, error, refresh, createSurvey, updateSurvey, deleteSurvey, restoreSurvey, hardDeleteSurvey };
}