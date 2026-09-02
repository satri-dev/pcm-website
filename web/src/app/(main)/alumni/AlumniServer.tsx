import { getAlumniSettings } from "@/lib/data/alumni-page-settings";
import { getPublishedAlumni } from "@/lib/data/alumni";
import AlumniClient from "./AlumniClient";

export default async function AlumniServer() {
  const [settings, alumni] = await Promise.all([
    getAlumniSettings(),
    getPublishedAlumni(),
  ]);
  return <AlumniClient settings={settings} alumni={alumni} />;
}