import type { Metadata } from "next";
import ProgramsClient from "./ProgramsClient";

// Programs listing changes only when a new program is added — rare but possible.
// ISR at 300s (5 min) keeps it fast while allowing admin updates without redeploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Programs | BBA, BBA-Finance & BCSIT at PCM Pokhara",
  description:
    "Explore BBA, BBA-Finance and BCSIT degrees at Pokhara College of Management, affiliated to Pokhara University.",
};

export default function ProgramsPage() {
  return <ProgramsClient />;
}
