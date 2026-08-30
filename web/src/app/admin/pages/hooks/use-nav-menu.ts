import { useEffect, useRef, useState } from "react";
import {
  NavMenuItem,
  NavMenuUpdateInput,
} from "@/types/nav-menu";

const API_BASE = "/api/admin/pages/nav-menu";

export interface UseNavMenuOptions {
  initialData?: NavMenuItem[];
}

export interface UseNavMenuReturn {
  items: NavMenuItem[];
  loading: boolean;
  error: string;
  refresh: () => void;
  createNavMenu: (data: Partial<NavMenuItem>) => Promise<NavMenuItem>;
  updateNavMenu: (id: string, data: Partial<NavMenuItem>) => Promise<NavMenuItem>;
  deleteNavMenu: (id: string) => Promise<void>;
  moveNavMenu: (index: number, direction: -1 | 1) => Promise<void>;
}

function sortByOrder(list: NavMenuItem[]) {
  return [...list].sort((a, b) => a.order - b.order);
}

export function useNavMenu({
  initialData,
}: UseNavMenuOptions = {}): UseNavMenuReturn {
  const [items, setItems] = useState<NavMenuItem[]>(sortByOrder(initialData ?? []));
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setItems(sortByOrder(initialData));
      setLoading(false);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    fetch(API_BASE, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Your session has expired. Please sign in again."
              : `Failed to load navbar (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setItems(sortByOrder(data.items ?? []));
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load navbar");
        setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey.current, initialData]);

  const refresh = () => {
    reloadKey.current += 1;
    setLoading(true);
  };

  const createNavMenu = async (
    data: Partial<NavMenuItem>
  ): Promise<NavMenuItem> => {
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
    setItems((prev) => sortByOrder([...prev, created]));
    return created;
  };

  const updateNavMenu = async (
    id: string,
    data: NavMenuUpdateInput
  ): Promise<NavMenuItem> => {
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
    setItems((prev) => sortByOrder(prev.map((item) => (item.id === id ? updated : item))));
    return updated;
  };

  const deleteNavMenu = async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setItems((prev) => sortByOrder(prev.filter((item) => item.id !== id)));
  };

  const moveNavMenu = async (index: number, direction: -1 | 1) => {
    const current = items[index];
    const neighbor = items[index + direction];
    if (!current || !neighbor) return;

    // Optimistic local swap so the table reorders instantly
    setItems((prev) => {
      const next = [...prev];
      const i = next.findIndex((it) => it.id === current.id);
      const j = next.findIndex((it) => it.id === neighbor.id);
      if (i === -1 || j === -1) return prev;
      next[i] = { ...next[i], order: neighbor.order };
      next[j] = { ...next[j], order: current.order };
      return sortByOrder(next);
    });

    try {
      await updateNavMenu(current.id, { order: neighbor.order });
      await updateNavMenu(neighbor.id, { order: current.order });
    } catch (err) {
      refresh();
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    refresh,
    createNavMenu,
    updateNavMenu,
    deleteNavMenu,
    moveNavMenu,
  };
}