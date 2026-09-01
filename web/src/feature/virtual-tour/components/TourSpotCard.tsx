import Link from "next/link";
import type { TourSpot } from "../types";

interface Props { item: TourSpot; }

export default function TourSpotCard({ item }: Props) {
  return (
    <Link href={item.href} className="vt-tour-card reveal" aria-label={`View ${item.title}`}>
      {/* Image wrapper — border-radius on top corners, aspect-ratio 4/3 */}
      <div className="vt-tour-card__img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="vt-tour-card__img"
          src={item.imageSrc}
          alt={item.imageAlt}
          loading="lazy"
        />
      </div>
      {/* Body below the image */}
      <div className="vt-tour-card__body">
        <h3 className="vt-tour-card__title">{item.title}</h3>
        <p className="vt-tour-card__desc">{item.description}</p>
      </div>
    </Link>
  );
}
