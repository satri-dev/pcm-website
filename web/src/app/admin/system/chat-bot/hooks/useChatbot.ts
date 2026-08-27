/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { ChatbotEntry } from "../types/chatbot";

const API_BASE = "/api/admin/chatbot";

export interface UseChatbotOptions {
  initialData?: ChatbotEntry[];
  pageSize?: number;
}

export interface UseChatbotReturn {
  entries: ChatbotEntry[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createEntry: (data: Partial<ChatbotEntry>) => Promise<ChatbotEntry>;
  updateEntry: (id: string, data: Partial<ChatbotEntry>) => Promise<ChatbotEntry>;
  deleteEntry: (id: string) => Promise<void>;
  restoreEntry: (id: string) => Promise<void>;
  hardDeleteEntry: (id: string) => Promise<void>;
}

export function useChatbot({
  initialData,
  pageSize = 50,
}: UseChatbotOptions = {}): UseChatbotReturn {
  const [entries, setEntries] = useState<ChatbotEntry[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setEntries(initialData);
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
              : `Failed to load chatbot entries (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setEntries(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load chatbot entries"
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

  const createEntry = async (data: Partial<ChatbotEntry>): Promise<ChatbotEntry> => {
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
    setEntries((prev) => [created, ...prev]);
    return created;
  };

  const updateEntry = async (
    id: string,
    data: Partial<ChatbotEntry>
  ): Promise<ChatbotEntry> => {
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
    setEntries((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const deleteEntry = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const restoreEntry = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=restore`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Restore failed (HTTP ${res.status})`);
    }
    refresh();
  };

  const hardDeleteEntry = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}?action=permanent-delete`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Permanent delete failed (HTTP ${res.status})`);
    }
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  return { entries, loading, error, refresh, createEntry, updateEntry, deleteEntry, restoreEntry, hardDeleteEntry };
}
