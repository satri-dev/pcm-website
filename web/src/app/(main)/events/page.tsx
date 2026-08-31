import type { Metadata } from "next";
import { getEventsSettings } from "@/lib/data/events-page-settings";
import EventsServer from "./EventsServer";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getEventsSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    alternates: { canonical: "/events" },
  };
}

export default function EventsPage() {
  return <EventsServer />;
}
