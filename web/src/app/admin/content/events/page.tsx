import type { Metadata } from "next";

import PageHeader from "../../_components/dashboard/page-header";
import EventsManager from "./_components/events-manager";
import { listEvents } from "@/repositories/events.repository";

export const metadata: Metadata = {
  title: "Events & Workshops Management",
  description:
    "Create, edit, and manage events and workshops for Pokhara College of Management website.",
  robots: { index: false, follow: false },
};

export default async function EventsPage() {
  const { items } = await listEvents({ pageSize: 50 });

  return (
    <>
      <PageHeader title="Events & Workshops" subtitle="Content · Events" />
      <EventsManager initialData={items} />
    </>
  );
}
