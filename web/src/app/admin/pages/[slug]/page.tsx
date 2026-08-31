import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Wrench } from "lucide-react";

import PageHeader from "../../_components/dashboard/page-header";
import NavMenuManager from "../_components/nav-menu-manager";
import GalleryPageSettings from "../_components/gallery-page-settings";
import FaqPageSettings from "../_components/faq-page-settings";
import PageContentManager from "../_components/page-content-manager";
import { findEntry } from "../_config";
import {
  ensureNavMenusReady,
  listNavMenu,
} from "@/repositories/nav-menu.repository";
import { getGalleryPageSettings } from "@/repositories/gallery-settings.repository";
import { getFaqPageSettings } from "@/repositories/faq-content.repository";
import {
  getPageContentBySlug,
} from "@/repositories/page-content.repository";
import { connection } from "next/server";
import TickersManager from "../_components/tickers-manager";
import { listTickers } from "@/repositories/ticker.repository";

interface RouteCtx {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RouteCtx): Promise<Metadata> {
  const { slug } = await params;
  const found = findEntry(slug);
  return {
    title: found ? found.entry.label : "Not found",
    description: "Configure this section of the public website.",
    robots: { index: false, follow: false },
  };
}

export default async function PagesSectionPage({ params }: RouteCtx) {
  const { slug } = await params;
  await connection();

  const found = findEntry(slug);
  if (!found) notFound();

  if (found.entry.slug === "navbar") {
    await ensureNavMenusReady();
    const items = await listNavMenu();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Sections · Navbar menus"
        />
        <NavMenuManager initialData={items} />
      </>
    );
  }

  if (found.entry.slug === "gallery") {
    const settings = await getGalleryPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & CTA"
        />
        <GalleryPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "faq") {
    const settings = await getFaqPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & CTA"
        />
        <FaqPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "tickers") {
    const settings = await listTickers();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & CTA"
        />
        <TickersManager tickers={settings} />
      </>
    );
  }

  if (found.kind === "page") {
    const content = await getPageContentBySlug(found.entry.slug);
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Copy & metadata"
        />
        <PageContentManager slug={found.entry.slug} initialContent={content} />
      </>
    );
  }

  return (
    <>
      <PageHeader title={found.entry.label} subtitle="Sections · Overview" />
      <div className="admin-panel">
        <div className="admin-panel__body p-6">
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <Wrench size={22} />
            </div>
            <div>
              <h3 className="m-0 text-lg font-bold text-(--admin-ink)">
                Under construction
              </h3>
              <p className="mt-1 mb-3 text-[0.9rem] text-(--admin-muted)">
                The editor for this {found.kind} will be wired up here
                incrementally. The public version is live now at its current
                path.
              </p>
              <a
                href={found.entry.publicHref}
                className="admin-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                View live page
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
