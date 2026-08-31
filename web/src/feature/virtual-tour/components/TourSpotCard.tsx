import Link from "next/link";
import type { TourSpot } from "../types";

interface Props { item: TourSpot; }

export default function TourSpotCard({ item }: Props) {
  return (
    <Link href={item.href} className="vt-tour-card reveal" aria-label={`View ${item.title}`}>
      <div className="vt-tour-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageSrc} alt={item.imageAlt} loading="lazy" />
      </div>
      <div className="vt-tour-card__body">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </Link>
  );
}
