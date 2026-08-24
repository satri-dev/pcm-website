"use client";

import Link from "next/link";

const announcements = [
  "🎓 Admissions Open for BBA · BBA-Finance · BCSIT — Apply Now",
  "📅 Entrance: Ashar 29, 2083, 8:00 AM · Form deadline: Ashar 26, 2083"
];

export default function AnnouncementTicker() {
  return (
    <div className="bg-pcm-navy text-white/90 overflow-hidden py-2" aria-label="Announcement">
      <div className="ticker-inner animate-scroll">
        {announcements.map((announcement, index) => (
          <span key={index} className="ticker-item">
            {announcement.includes("Apply Now") ? (
              <>
                {announcement.split(" — Apply Now")[0]} — <Link href="/admission" className="text-pcm-green hover:underline">Apply Now</Link>
              </>
            ) : (
              announcement
            )}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {announcements.map((announcement, index) => (
          <span key={`dup-${index}`} className="ticker-item">
            {announcement.includes("Apply Now") ? (
              <>
                {announcement.split(" — Apply Now")[0]} — <Link href="/admission" className="text-pcm-green hover:underline">Apply Now</Link>
              </>
            ) : (
              announcement
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
