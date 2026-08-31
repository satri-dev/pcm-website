import { getEventsSettings } from "@/lib/data/events-page-settings";
import { getPublishedEvents } from "@/lib/data/events";
import EventsClient from "./EventsClient";

export default async function EventsServer() {
  const [settings, eventItems] = await Promise.all([
    getEventsSettings(),
    getPublishedEvents(),
  ]);
  return <EventsClient settings={settings} eventItems={eventItems} />;
}
