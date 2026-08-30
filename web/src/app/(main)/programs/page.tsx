import type { Metadata } from "next";
import ProgramsClient from "./ProgramsClient";

// Programs listing data is fetched client-side; the page shell is static.
export const metadata: Metadata = {
  title: "Programs | BBA, BBA-Finance & BCSIT at PCM Pokhara",
  description:
    "Explore BBA, BBA-Finance and BCSIT degrees at Pokhara College of Management, affiliated to Pokhara University.",
};

export default function ProgramsPage() {
  return <ProgramsClient />;
}
