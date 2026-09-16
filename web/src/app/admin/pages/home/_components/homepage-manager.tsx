"use client";

import { useCallback, useEffect, useState } from "react";
import type { HomepageData, HomepageUpdateInput } from "@/types/homepage";
import { DEFAULT_HOMEPAGE_DATA } from "@/types/homepage";
import HeroSlidesManager from "./hero-slides-manager";
import StatsManager from "./stats-manager";
import ReasonsManager from "./reasons-manager";
import TestimonialsManager from "./testimonials-manager";
import AdmissionManager from "./admission-manager";
import SectionTextManager from "./section-text-manager";
import CTAManager from "./cta-manager";

const API = "/api/admin/pages/home";

const tabs = [
  { id: "hero", label: "Hero Slides" },
  { id: "stats", label: "Welcome Stats" },
  { id: "reasons", label: "Why Choose PCM" },
  { id: "programs", label: "Programs" },
  { id: "facilities", label: "Facilities" },
  { id: "events", label: "Events" },
  { id: "gallery", label: "Gallery" },
  { id: "blogs", label: "Blogs" },
  { id: "news", label: "News" },
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
  const [data, setData] = useState<HomepageData>({
    ...DEFAULT_HOMEPAGE_DATA,
    ...initialData,
    id: initialData.id,
    updatedAt: initialData.updatedAt,
  });
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
              welcomeText={data.welcomeText}
              stats={data.welcomeStats}
              onSaveText={(text) => handleSave({ welcomeText: text })}
              onSave={(stats) => handleSave({ welcomeStats: stats })}
            />
          )}
          {activeTab === "reasons" && (
            <ReasonsManager
              whyChooseText={data.whyChooseText}
              reasons={data.whyChooseReasons}
              onSaveText={(text) => handleSave({ whyChooseText: text })}
              onSave={(reasons) => handleSave({ whyChooseReasons: reasons })}
            />
          )}
          {activeTab === "programs" && (
            <SectionTextManager
              label="Programs Section Header"
              data={data.programsText}
              onSave={(text) => handleSave({ programsText: text })}
              defaults={DEFAULT_HOMEPAGE_DATA.programsText}
            />
          )}
          {activeTab === "facilities" && (
            <SectionTextManager
              label="Facilities Section Header"
              data={data.facilitiesText}
              onSave={(text) => handleSave({ facilitiesText: text })}
              defaults={DEFAULT_HOMEPAGE_DATA.facilitiesText}
            />
          )}
          {activeTab === "events" && (
            <SectionTextManager
              label="Events Section Header"
              data={data.eventsText}
              onSave={(text) => handleSave({ eventsText: text })}
              defaults={DEFAULT_HOMEPAGE_DATA.eventsText}
            />
          )}
          {activeTab === "gallery" && (
            <SectionTextManager
              label="Gallery Section Header"
              data={data.galleryText}
              onSave={(text) => handleSave({ galleryText: text })}
              defaults={DEFAULT_HOMEPAGE_DATA.galleryText}
            />
          )}
          {activeTab === "blogs" && (
            <SectionTextManager
              label="Blogs Section Header"
              data={data.blogsText}
              onSave={(text) => handleSave({ blogsText: text })}
              defaults={DEFAULT_HOMEPAGE_DATA.blogsText}
            />
          )}
          {activeTab === "news" && (
            <SectionTextManager
              label="News Section Header"
              data={data.newsText}
              onSave={(text) => handleSave({ newsText: text })}
              defaults={DEFAULT_HOMEPAGE_DATA.newsText}
            />
          )}
          {activeTab === "testimonials" && (
            <div className="space-y-8">
              <SectionTextManager
                label="Testimonials Section Header"
                data={data.testimonialsText}
                onSave={(text) => handleSave({ testimonialsText: text })}
                defaults={DEFAULT_HOMEPAGE_DATA.testimonialsText}
              />
              <hr className="border-[var(--admin-border)]" />
              <TestimonialsManager
                testimonials={data.testimonials}
                onSave={(t) => handleSave({ testimonials: t })}
              />
            </div>
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
