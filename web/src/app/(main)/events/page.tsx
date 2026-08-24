import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import EventsClient from "./EventsClient";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Events & Workshops | Pokhara College of Management",
  description:
    "Fests, seminars, workshops, tours and competitions — find your next moment at PCM.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <div className={poppins.variable}>
      <EventsClient />
    </div>
  );
}
