import { useCallback, useEffect, useRef, useState } from "react";
import { Survey } from "@/types/surveys";
import {
  SurveyResponse,
  SurveyResponseGroup,
} from "@/types/survey-response";

const API_BASE = "/api/admin/content/survey-responses";

export interface SurveyResponsesData {
  survey: Survey;
  responses: SurveyResponse[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UseSurveyResponsesOptions {
  initialGroups?: SurveyResponseGroup[];
}

export interface UseSurveyResponsesReturn {
  groups: SurveyResponseGroup[];
  loading: boolean;
  error: string;
  refresh: () => void;
  opening: string | null;
  view: SurveyResponsesData | null;
  openSurvey: (slug: string) => Promise<void>;
  closeSurvey: () => void;
  deleteResponse: (id: string) => Promise<void>;
}

function httpError(status: number, fallback: string, err?: unknown) {
  if (err instanceof Error && err.message) return err.message;
  if (status === 401) return "Your session has expired. Please sign in again.";
  return fallback;
}

export function useSurveyResponses({
  initialGroups,
}: UseSurveyResponsesOptions = {}): UseSurveyResponsesReturn {
  const [groups, setGroups] = useState<SurveyResponseGroup[]>(initialGroups ?? []);
  const [loading, setLoading] = useState(!initialGroups);
  const [error, setError] = useState("");
  const [opening, setOpening] = useState<string | null>(null);
  const [view, setView] = useState<SurveyResponsesData | null>(null);
  const reloadKey = useRef(0);

  useEffect(() => {
    if (initialGroups) return;
    let cancelled = false;
    const controller = new AbortController();
    fetch(`${API_BASE}?pageSize=100`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setGroups(data.items ?? []);
        setError("");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load survey responses");
        setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [reloadKey.current, initialGroups]);

  const refresh = useCallback(() => {
    reloadKey.current += 1;
    setLoading(true);
    setView(null);
  }, []);

  const openSurvey = useCallback(async (slug: string) => {
    setOpening(slug);
    setError("");
    try {
      const res = await fetch(`${API_BASE}?survey=${encodeURIComponent(slug)}&pageSize=200`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setView({
        survey: data.survey,
        responses: data.items ?? [],
        total: data.total ?? 0,
        page: data.page ?? 1,
        pageSize: data.pageSize ?? 200,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open survey");
    } finally {
      setOpening(null);
    }
  }, []);

  const closeSurvey = useCallback(() => setView(null), []);

  const deleteResponse = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Delete failed (HTTP ${res.status})`);
    }
    setView((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        responses: prev.responses.filter((r) => r.id !== id),
        total: Math.max(0, prev.total - 1),
      };
    });
    setGroups((prev) =>
      prev
        .map((g) => (g.surveySlug === view?.survey.slug ? { ...g, count: Math.max(0, g.count - 1) } : g))
        .filter((g) => g.count > 0)
    );
  }, [view]);

  return { groups, loading, error, refresh, opening, view, openSurvey, closeSurvey, deleteResponse };
}
