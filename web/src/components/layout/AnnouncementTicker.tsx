import Link from "next/link";
import { getTickerItems } from "@/lib/data/ticker";

export default async function AnnouncementTicker() {
  const items = await getTickerItems();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-pcm-navy text-white/90 overflow-hidden py-2 relative z-50" aria-label="Announcement">
      {/* Left scroll indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-pcm-navy to-transparent pointer-events-none z-10 flex items-center justify-start pl-1 sm:pl-2">
        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white/50 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </div>

      {/* Ticker content */}
      <div className="ticker-inner">
        {items.map((item) => (
          <span key={item.id} className="ticker-item">
            <span className="hidden sm:inline">
              <span className="font-semibold">{item.category}:</span> {item.title}
            </span>
            <span className="sm:hidden">
              {(() => {
                const text = `${item.category}: ${item.title}`;
                return text.length > 60 ? text.substring(0, 60) + "..." : text;
              })()}
            </span>
            {" — "}
            <Link href={item.href} className="text-pcm-green hover:underline font-medium">
              View Details
            </Link>
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {items.map((item) => (
          <span key={`dup-${item.id}`} className="ticker-item">
            <span className="hidden sm:inline">
              <span className="font-semibold">{item.category}:</span> {item.title}
            </span>
            <span className="sm:hidden">
              {(() => {
                const text = `${item.category}: ${item.title}`;
                return text.length > 60 ? text.substring(0, 60) + "..." : text;
              })()}
            </span>
            {" — "}
            <Link href={item.href} className="text-pcm-green hover:underline font-medium">
              View Details
            </Link>
          </span>
        ))}
      </div>

      {/* Right scroll indicator */}
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-pcm-navy to-transparent pointer-events-none z-10 flex items-center justify-end pr-1 sm:pr-2">
        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white/50 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
