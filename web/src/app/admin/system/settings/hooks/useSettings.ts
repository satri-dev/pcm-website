/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { type SiteSettings } from "../types/settings";

const API_BASE = "/api/admin/system/settings";

function extractErrorMessage(err: Record<string, unknown>, fallback: string): string {
  if (typeof err.message === "string" && err.message) return err.message;
  if (typeof err.error === "string" && err.error) return err.error;
  return fallback;
}

export interface UseSettingsReturn {
  settings: SiteSettings;
  loading: boolean;
  error: string;
  refresh: () => void;
  updateSettings: (data: { collegeName: string; logoUrl: string }) => Promise<SiteSettings>;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    totpCode: string;
  }) => Promise<{ success: boolean }>;
}

const DEFAULT_SETTINGS: SiteSettings = {
  collegeName: "PCM",
  logoUrl: "/logo-pcm.png",
  updatedAt: new Date().toISOString(),
};

export function useSettings(initialData?: SiteSettings): UseSettingsReturn {
  const [settings, setSettings] = useState<SiteSettings>(initialData ?? DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialData) {
      setSettings(initialData);
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
              : `Failed to load settings (HTTP ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setSettings(data);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load settings");
        setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [reloadKey.current, initialData]);

  const refresh = () => {
    reloadKey.current += 1;
    setLoading(true);
  };

  const updateSettings = async (data: {
    collegeName: string;
    logoUrl: string;
  }): Promise<SiteSettings> => {
    const res = await fetch(API_BASE, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, `Update failed (HTTP ${res.status})`));
    }
    const updated = await res.json();
    setSettings(updated);
    return updated;
  };

  const changePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    totpCode: string;
  }): Promise<{ success: boolean }> => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, `Password change failed (HTTP ${res.status})`));
    }
    return res.json();
  };

  return {
    settings,
    loading,
    error,
    refresh,
    updateSettings,
    changePassword,
  };
}