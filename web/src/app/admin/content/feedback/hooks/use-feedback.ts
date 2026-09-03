import { useEffect, useRef, useState } from "react";
import { Feedback } from "@/types/feedback";

const API_BASE = "/api/admin/content/feedback";

export interface UseFeedbackOptions {
  initialData?: Feedback[];
  pageSize?: number;
}

export interface UseFeedbackReturn {
  feedback: Feedback[];
  loading: boolean;
  error: string;
  refresh: () => void;
  getOne: (id: string) => Promise<Feedback>;
  deleteFeedback: (id: string) => Promise<void>;
}

export function useFeedback({
  initialData,
  pageSize = 50,
}: UseFeedbackOptions = {}): UseFeedbackReturn {
  const [feedback, setFeedback] = useState<Feedback[]>(
    initialData ?? []
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    // Skip fetching if we have initial data
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
              : `Failed to load feedback (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setFeedback(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load feedback"
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

  const getOne = async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to load feedback (HTTP ${res.status})`);
    }
    return (await res.json()) as Feedback;
  };

  const deleteFeedback = async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setFeedback((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    feedback,
    loading,
    error,
    refresh,
    getOne,
    deleteFeedback,
  };
}
