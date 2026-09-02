"use client";

import { useCallback, useEffect, useState } from "react";
import type { HomepageData, HomepageUpdateInput } from "@/types/homepage";
import HeroSlidesManager from "./hero-slides-manager";
import StatsManager from "./stats-manager";
import ReasonsManager from "./reasons-manager";
import TestimonialsManager from "./testimonials-manager";
import AdmissionManager from "./admission-manager";
import CTAManager from "./cta-manager";

const API = "/api/admin/pages/home";

const tabs = [
  { id: "hero", label: "Hero Slides" },
  { id: "stats", label: "Welcome Stats" },
  { id: "reasons", label: "Why Choose PCM" },
  { id: "testimonials", label: "Testimonials" },
  { id: "admission", label: "Admission" },
  { id: "cta", label: "CTA" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function HomepageManager({
  initialData,
}: {
  initialData: HomepageData;
}) {
  const [data, setData] = useState<HomepageData>(initialData);
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const flash = (text: string, isError = false) => {
    if (isError) {
      setErrMsg(text);
      setMsg("");
    } else {
      setMsg(text);
      setErrMsg("");
    }
    setTimeout(() => {
      setMsg("");
      setErrMsg("");
    }, 3000);
  };

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(API);
      if (res.ok) {
        const fresh = await res.json();
        setData(fresh);
      }
    } catch {
      // ignore — we still have local data
    }
  }, []);

  const handleSave = async (patch: Record<string, unknown>) => {
    setSaving(true);
    setErrMsg("");
    setMsg("");
    try {
      const res = await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Save failed (HTTP ${res.status})`);
      }
      const updated = await res.json();
      setData(updated);
      flash("Saved successfully!");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Save failed", true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-6">
      {/* Tabs */}
      <div className="admin-panel mb-4">
        <div className="admin-panel__body p-2">
          <div className="flex gap-1 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-[var(--admin-brand)] text-white"
                    : "text-[var(--admin-muted)] hover:bg-[var(--admin-surface)] hover:text-[var(--admin-ink)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages - Fixed at bottom */}
      {saving && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-5">
          Saving…
        </div>
      )}
      {msg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-5">
          {msg}
        </div>
      )}
      {errMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-5">
          {errMsg}
        </div>
      )}

      {/* Content */}
      <div className="admin-panel">
        <div className="admin-panel__body p-6">
          {activeTab === "hero" && (
            <HeroSlidesManager
              slides={data.heroSlides}
              onSave={(slides) => handleSave({ heroSlides: slides })}
            />
          )}
          {activeTab === "stats" && (
            <StatsManager
              stats={data.welcomeStats}
              onSave={(stats) => handleSave({ welcomeStats: stats })}
            />
          )}
          {activeTab === "reasons" && (
            <ReasonsManager
              reasons={data.whyChooseReasons}
              onSave={(reasons) => handleSave({ whyChooseReasons: reasons })}
            />
          )}
          {activeTab === "testimonials" && (
            <TestimonialsManager
              testimonials={data.testimonials}
              onSave={(t) => handleSave({ testimonials: t })}
            />
          )}
          {activeTab === "admission" && (
            <AdmissionManager
              admission={data.admission}
              onSave={(a) => handleSave({ admission: a })}
            />
          )}
          {activeTab === "cta" && (
            <CTAManager
              cta={data.cta}
              onSave={(c) => handleSave({ cta: c })}
            />
          )}
        </div>
      </div>
    </main>
  );
}
