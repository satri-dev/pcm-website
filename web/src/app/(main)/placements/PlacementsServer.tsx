import { getPlacementsSettings } from "@/lib/data/placements-page-settings";
import PlacementsClient from "./PlacementsClient";

export default async function PlacementsServer() {
  const settings = await getPlacementsSettings();
  return <PlacementsClient settings={settings} />;
}
