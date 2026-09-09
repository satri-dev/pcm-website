import PageHeader from "./_components/dashboard/page-header";
import DashboardHeader from "./_components/dashboard/dashboard-header";
import SummaryCards from "./_components/dashboard/summary-cards";
import ContentByCollection from "./_components/dashboard/content-by-collection";
import GalleryByCategory from "./_components/dashboard/gallery-by-category";
import SiteVisits from "./_components/dashboard/site-visits";
import SeoMetaPanel from "./_components/dashboard/seo-meta-panel";
import RecentActivity from "./_components/dashboard/recent-activity";
import QuickActions from "./_components/dashboard/quick-actions";
import { getSiteVisits } from "@/core/lib/analytics/stats";
import { countPublicPages } from "@/core/lib/page-count";
import { getDashboardCounts } from "@/core/lib/dashboard-stats";
import { connection } from "next/server";

export default async function AdminDashboard() {
  await connection();
  const [siteVisits, counts] = await Promise.all([
    getSiteVisits(60),
    getDashboardCounts(),
  ]);
  const totalPages = countPublicPages();
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Analytics & overview" />

      <main style={{ padding: "1.5rem", display: "grid", gap: "1.25rem" }}>
        <DashboardHeader />

        <SummaryCards
          values={{
            pages: totalPages,
            newsNotices: counts.news + counts.notices,
            gallery: counts.gallery,
            team: counts.faculty,
            programs: counts.programs,
            enquiries: counts.enquiries,
            media: counts.downloads,
          }}
          subs={{
            newsNotices: `${counts.news} news, ${counts.notices} notices`,
            enquiries: "Feedback & survey responses",
            media: "Download files",
          }}
        />

        <div className="admin-charts">
          <ContentByCollection />
          <GalleryByCategory />
        </div>

        <SiteVisits
          data={siteVisits.map((item) => ({
            date: item.date,
            desktop: item.desktop,
            mobile: item.mobile,
            tablet: item.tablet,
          }))}
        />

        <div className="admin-charts">
          <SeoMetaPanel />
          <RecentActivity />
        </div>

        <QuickActions />
      </main>
    </>
  );
}
