import type { Metadata } from "next";
import { connection } from "next/server";

import PageHeader from "../../_components/dashboard/page-header";
import HomepageManager from "./_components/homepage-manager";
import { getHomepage } from "@/repositories/homepage.repository";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Configure the home page hero, stats, sections and CTA.",
  robots: { index: false, follow: false },
};

export default async function HomepageAdminPage() {
  await connection();
  const data = await getHomepage();
  return (
    <>
        <PageHeader
        title="Home Page"
        subtitle="Pages · Home"
      />
      <HomepageManager initialData={data} />
    </>
  );
}
