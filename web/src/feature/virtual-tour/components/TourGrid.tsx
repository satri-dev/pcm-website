import type { TourSpot } from "../types";
import TourSpotCard from "./TourSpotCard";

interface Props {
  spots: TourSpot[];
}

export default function TourGrid({ spots }: Props) {
  return (
    <div className="vt-tour-grid">
      {spots.map((spot) => (
        <TourSpotCard key={spot.id} item={spot} />
      ))}
    </div>
  );
}
