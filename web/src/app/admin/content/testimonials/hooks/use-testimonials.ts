import { useEffect, useRef, useState } from "react";
import { Testimonial, TestimonialStatus } from "@/types/testimonial";

const API_BASE = "/api/admin/content/testimonials";

export interface UseTestimonialsOptions {
  initialData?: Testimonial[];
  pageSize?: number;
}

export interface UseTestimonialsReturn {
  testimonials: Testimonial[];
  loading: boolean;
  error: string;
  refresh: () => void;
  updateStatus: (id: string, status: TestimonialStatus) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
}

export function useTestimonials({
  initialData,
  pageSize = 50,
}: UseTestimonialsOptions = {}): UseTestimonialsReturn {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    initialData ?? []
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setTestimonials(initialData);
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
              : `Failed to load testimonials (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setTestimonials(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load testimonials"
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

  const updateStatus = async (id: string, status: TestimonialStatus) => {
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
    setTestimonials((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  };

  const deleteTestimonial = async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setTestimonials((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    testimonials,
    loading,
    error,
    refresh,
    updateStatus,
    deleteTestimonial,
  };
}
