import { useEffect, useRef, useState } from "react";
import { Faq } from "@/types/faqs";

const API_BASE = "/api/admin/content/faqs";

export interface UseFaqsOptions {
  initialData?: Faq[];
  pageSize?: number;
}

export interface UseFaqsReturn {
  faqs: Faq[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createFaq: (data: Partial<Faq>) => Promise<Faq>;
  updateFaq: (id: string, data: Partial<Faq>) => Promise<Faq>;
  deleteFaq: (id: string) => Promise<void>;
  restoreFaq: (id: string) => Promise<void>;
  hardDeleteFaq: (id: string) => Promise<void>;
}

export function useFaqs({
  initialData,
  pageSize = 50,
}: UseFaqsOptions = {}): UseFaqsReturn {
  const [faqs, setFaqs] = useState<Faq[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setFaqs(initialData);
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
              : `Failed to load FAQs (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setFaqs(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load FAQs");
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

  const createFaq = async (data: Partial<Faq>): Promise<Faq> => {
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
    setFaqs((prev) => [created, ...prev]);
    return created;
  };

  const updateFaq = async (id: string, data: Partial<Faq>): Promise<Faq> => {
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
    setFaqs((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteFaq = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setFaqs((prev) => prev.filter((item) => item.id !== id));
  };

  const restoreFaq = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=restore`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Restore failed (HTTP ${res.status})`);
    }
    refresh();
  };

  const hardDeleteFaq = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=permanent-delete`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Permanent delete failed (HTTP ${res.status})`);
    }
    setFaqs((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    faqs,
    loading,
    error,
    refresh,
    createFaq,
    updateFaq,
    deleteFaq,
    restoreFaq,
    hardDeleteFaq,
  };
}
