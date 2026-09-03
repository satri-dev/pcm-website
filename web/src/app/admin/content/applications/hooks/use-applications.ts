import { useEffect, useRef, useState } from "react";
import { Application, ApplicationStatus } from "@/types/application";

const API_BASE = "/api/admin/applications";

export interface UseApplicationsOptions {
  initialData?: Application[];
  pageSize?: number;
}

export interface UseApplicationsReturn {
  applications: Application[];
  loading: boolean;
  error: string;
  refresh: () => void;
  updateStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
}

export function useApplications({
  initialData,
  pageSize = 50,
}: UseApplicationsOptions = {}): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>(
    initialData ?? []
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setApplications(initialData);
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
              : `Failed to load applications (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setApplications(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load applications"
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

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Update failed (HTTP ${res.status})`);
    }
    const updated = await res.json();
    setApplications((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  };

  const deleteApplication = async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setApplications((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    applications,
    loading,
    error,
    refresh,
    updateStatus,
    deleteApplication,
  };
}
