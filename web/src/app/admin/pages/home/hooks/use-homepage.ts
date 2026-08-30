import { useEffect, useRef, useState } from "react";
import {
  HomepageData,
  HomepageUpdateInput,
  HeroSlide,
  WelcomeStat,
  WhyChooseReason,
  HomepageTestimonial,
  AdmissionConfig,
  CTAConfig,
} from "@/types/homepage";

const API_BASE = "/api/admin/pages/home";

export interface UseHomepageReturn {
  data: HomepageData | null;
  loading: boolean;
  error: string;
  refresh: () => void;
  save: (patch: HomepageUpdateInput) => Promise<HomepageData>;
  saving: boolean;
}

export function useHomepage(initialData?: HomepageData): UseHomepageReturn {
  const [data, setData] = useState<HomepageData | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
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
              : `Failed to load homepage (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load homepage");
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

  const save = async (patch: HomepageUpdateInput): Promise<HomepageData> => {
    setSaving(true);
    try {
      const res = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Save failed (HTTP ${res.status})`);
      }
      const updated = await res.json();
      setData(updated);
      return updated;
    } finally {
      setSaving(false);
    }
  };

  return { data, loading, error, refresh, save, saving };
}
