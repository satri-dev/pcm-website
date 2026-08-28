import type { Metadata } from "next";
import { getDb } from "@/core/lib/db";
import PageHeader from "../../_components/dashboard/page-header";
import SettingsManager from "./_components/settings-manager";
import {
  SETTINGS_COLLECTION,
  siteSettingsFromDocument,
  type SiteSettingsDocument,
} from "./types/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Manage site settings and account security for the PCM website admin panel.",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  // Fetch site settings server-side
  const db = await getDb();
  const col = db.collection<SiteSettingsDocument>(SETTINGS_COLLECTION);
  const doc = await col.findOne({ key: "site" });

  const settings = doc
    ? siteSettingsFromDocument(doc)
    : {
        collegeName: "PCM",
        logoUrl: "/logo-pcm.png",
        updatedAt: new Date().toISOString(),
      };

  return (
    <>
      <PageHeader title="Settings" subtitle="System · Settings" />
      <SettingsManager initialData={settings} />
    </>
  );
}