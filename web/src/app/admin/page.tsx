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

export const dynamic = "force-dynamic";


export default async function AdminDashboard() {
  const siteVisits = await getSiteVisits(60);
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Analytics & overview" />

      <main style={{ padding: "1.5rem", display: "grid", gap: "1.25rem" }}>
        <DashboardHeader />

        <SummaryCards />

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
