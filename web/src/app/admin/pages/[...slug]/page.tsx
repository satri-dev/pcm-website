import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Wrench } from "lucide-react";

import PageHeader from "../../_components/dashboard/page-header";
import NavMenuManager from "../_components/nav-menu-manager";
import PageContentManager from "../_components/page-content-manager";
import DownloadsPageSettings from "../_components/downloads-page-settings";
import GalleryPageSettings from "../_components/gallery-page-settings";
import FaqPageSettings from "../_components/faq-page-settings";
import { findEntry, resolveEntryContentSlug } from "../_config";
import {
  ensureNavMenusReady,
  listNavMenu,
} from "@/repositories/nav-menu.repository";
import {
  ensurePageContentsReady,
  getPageContentBySlug,
} from "@/repositories/page-content.repository";
import { getDownloadsPageSettings } from "@/repositories/downloads-settings.repository";
import type { PageContent } from "@/types/page-content";
import { connection } from "next/server";
import { getGalleryPageSettings } from "@/repositories/gallery-settings.repository";
import { getFaqPageSettings } from "@/repositories/faq-content.repository";
import TickersManager from "../_components/tickers-manager";
import { listTickers } from "@/repositories/ticker.repository";
import TopBarManager from "../_components/topbar-manager";
import {
  listAllTopBarLinks,
  getTopBarContact,
} from "@/repositories/topbar.repository";
import FooterManager from "../_components/footer-manager";
import { getFooterSettings } from "@/repositories/footer.repository";
import PlacementsPageSettings from "../_components/placements-page-settings";
import { getPlacementsPageSettings } from "@/repositories/placements-settings.repository";
import NewsPageSettings from "../_components/news-page-settings";
import { getNewsPageSettings } from "@/repositories/news-page-settings.repository";
import NewsArticleSettings from "../_components/news-article-settings";
import { getNewsArticleSettings } from "@/repositories/news-article-settings.repository";
import EventsPageSettings from "../_components/events-page-settings";
import { getEventsPageSettings } from "@/repositories/events-page-settings.repository";
import ResultsPageSettings from "../_components/results-page-settings";
import { getResultsPageSettings } from "@/repositories/results-page-settings.repository";
import NoticesPageSettings from "../_components/notices-page-settings";
import { getNoticesPageSettings } from "@/repositories/notices-page-settings.repository";
import CareersPageSettings from "../_components/careers-page-settings";
import { getCareersPageSettings } from "@/repositories/careers-page-settings.repository";
import ScholarshipPageSettings from "../_components/scholarship-page-settings";
import { getScholarshipPageSettings } from "@/repositories/scholarship-page-settings.repository";
import AlumniPageSettings from "../_components/alumni-page-settings";
import { getAlumniPageSettings } from "@/repositories/alumni-page-settings.repository";
import AboutPageSettings from "../_components/about-page-settings";
import { getAboutPageSettings } from "@/repositories/about-page-settings.repository";
import BoardPageSettings from "../_components/board-page-settings";
import { getBoardPageSettings } from "@/repositories/board-page-settings.repository";
import FacultyPageSettings from "../_components/faculty-page-settings";
import { getFacultyPageSettings } from "@/repositories/faculty-page-settings.repository";
import FacilitiesPageSettings from "../_components/facilities-page-settings";
import { getFacilitiesPageSettings } from "@/repositories/facilities-page-settings.repository";
import CampusMapPageSettings from "../_components/campus-map-page-settings";
import { getCampusMapPageSettings } from "@/repositories/campus-map-page-settings.repository";

interface RouteCtx {
  params: Promise<{ slug: string | string[] }>;
}

export async function generateMetadata({
  params,
}: RouteCtx): Promise<Metadata> {
  const { slug } = await params;
  const slugString = Array.isArray(slug) ? slug.join("/") : slug;
  const found = findEntry(slugString);
  return {
    title: found ? found.entry.label : "Not found",
    description: "Configure this section of the public website.",
    robots: { index: false, follow: false },
  };
}

export default async function PagesSectionPage({ params }: RouteCtx) {
  const { slug } = await params;
  const slugString = Array.isArray(slug) ? slug.join("/") : slug;
  await connection();

  const found = findEntry(slugString);
  if (!found) notFound();

  if (found.entry.slug === "navbar") {
    await ensureNavMenusReady();
    const items = await listNavMenu();
    const { getNavbarSettings } = await import("@/repositories/navbar-settings.repository");
    const settings = await getNavbarSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Sections · Navbar menus"
        />
        <NavMenuManager initialData={items} initialSettings={settings} />
      </>
    );
  }

  if (found.entry.slug === "downloads") {
    const settings = await getDownloadsPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & CTA"
        />
        <DownloadsPageSettings initial={settings} />
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

  if (found.entry.slug === "topbar") {
    const [links, contact] = await Promise.all([
      listAllTopBarLinks(),
      getTopBarContact(),
    ]);
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Sections · TopBar Links & Contact"
        />
        <TopBarManager links={links} contact={contact} />
      </>
    );
  }

  if (found.entry.slug === "footer") {
    const settings = await getFooterSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Sections · Footer Content & Settings"
        />
        <FooterManager settings={settings} />
      </>
    );
  }

  if (found.entry.slug === "placements") {
    const settings = await getPlacementsPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <PlacementsPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "news") {
    const settings = await getNewsPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <NewsPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "news-article") {
    const settings = await getNewsArticleSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Article detail layout"
        />
        <NewsArticleSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "events") {
    const settings = await getEventsPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <EventsPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "results") {
    const settings = await getResultsPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <ResultsPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "notices") {
    const settings = await getNoticesPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <NoticesPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "career") {
    const settings = await getCareersPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <CareersPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "scholarship") {
    const settings = await getScholarshipPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <ScholarshipPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "alumni") {
    const settings = await getAlumniPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <AlumniPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "about") {
    const settings = await getAboutPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <AboutPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "about/board") {
    const settings = await getBoardPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <BoardPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "about/faculty") {
    const settings = await getFacultyPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <FacultyPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "about/facility") {
    const settings = await getFacilitiesPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <FacilitiesPageSettings initial={settings} />
      </>
    );
  }

  if (found.entry.slug === "about/campus-map") {
    const settings = await getCampusMapPageSettings();
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Content & SEO"
        />
        <CampusMapPageSettings initial={settings} />
      </>
    );
  }

  if (found.kind === "page") {
    const contentSlug = resolveEntryContentSlug(found.entry.slug);
    let content: PageContent | null = null;
    try {
      await ensurePageContentsReady();
      content = await getPageContentBySlug(contentSlug);
    } catch {
      content = null;
    }
    return (
      <>
        <PageHeader
          title={found.entry.label}
          subtitle="Pages · Copy & metadata"
        />
        <PageContentManager slug={contentSlug} initialContent={content} />
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
