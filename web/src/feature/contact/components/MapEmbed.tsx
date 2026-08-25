"use client";

import { useState } from "react";

/**
 * Optimized Google Maps embed.
 *
 * - Renders a static placeholder (preview image + "Load map" button) until
 *   the user explicitly clicks, avoiding an eager third-party network request.
 * - Once loaded the real iframe is injected — no layout shift because the
 *   wrapper already has a fixed aspect ratio.
 * - Location coordinates come from props so they can later be driven from
 *   a backend config endpoint (e.g. /api/settings/map-location).
 */

interface Props {
  /**
   * Google Maps embed URL.
   * Defaults to the PCM Nadipur campus.
   * Later: fetch this from /api/settings and pass it in as a prop.
   */
  embedUrl?: string;
  title?: string;
}

const DEFAULT_EMBED =
  "https://maps.google.com/maps?q=Pokhara%20College%20of%20Management%20Nadipur%20Pokhara&t=&z=15&ie=UTF8&iwloc=&output=embed";

const MapPinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function MapEmbed({
  embedUrl = DEFAULT_EMBED,
  title = "PCM campus location",
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="map-wrap" aria-label="Map showing PCM campus location">
      {loaded ? (
        <iframe
          title={title}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="map-iframe"
        />
      ) : (
        /* Static placeholder — no third-party request until user clicks */
        <div className="map-placeholder">
          <div className="map-placeholder__icon">
            <MapPinIcon />
          </div>
          <p className="map-placeholder__label">
            Gyan Marg, Nadipur, Pokhara-2
          </p>
          <button
            className="map-placeholder__btn"
            onClick={() => setLoaded(true)}
            type="button"
          >
            Load map
          </button>
          <p className="map-placeholder__note">
            Loads a Google Maps embed. By clicking you agree to Google&apos;s{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              privacy policy
            </a>
            .
          </p>
          {/* Directions link always available without loading the map */}
          <a
            className="map-placeholder__directions"
            href="https://maps.google.com/?q=Pokhara+College+of+Management+Nadipur"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps ↗
          </a>
        </div>
      )}
    </div>
  );
}
