"use client";

/**
 * MapEmbed — Google Maps iframe of the PCM Nadipur campus.
 *
 * lat/lng props are ready for backend integration:
 * fetch from /api/settings/map-location and pass them in when ready.
 */

const PCM_LAT  = 28.2096;
const PCM_LNG  = 83.9856;
const PCM_ZOOM = 16;

const DIRECTIONS_URL =
  "https://maps.google.com/?q=Pokhara+College+of+Management+Nadipur+Pokhara";

function buildEmbedUrl(lat: number, lng: number, zoom: number) {
  return (
    `https://maps.google.com/maps` +
    `?q=${lat},${lng}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`
  );
}

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={{ width: "0.85rem", height: "0.85rem", display: "inline", marginLeft: "0.25rem" }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

interface Props {
  lat?:   number;
  lng?:   number;
  zoom?:  number;
  title?: string;
}

export default function MapEmbed({
  lat   = PCM_LAT,
  lng   = PCM_LNG,
  zoom  = PCM_ZOOM,
  title = "Pokhara College of Management — Nadipur campus",
}: Props) {
  const embedUrl = buildEmbedUrl(lat, lng, zoom);

  return (
    <div className="map-wrap">
      <iframe
        title={title}
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="map-iframe"
      />

      {/* Address bar overlay */}
      <div className="map-overlay">
        <div className="map-overlay__left">
          <span className="map-overlay__icon"><PinIcon /></span>
          <div>
            <strong className="map-overlay__name">
              Pokhara College of Management
            </strong>
            <span className="map-overlay__address">
              Gyan Marg, Nadipur, Pokhara-2, Kaski
            </span>
          </div>
        </div>
        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="map-overlay__btn map-overlay__btn--directions"
        >
          Get directions <ExternalIcon />
        </a>
      </div>
    </div>
  );
}
