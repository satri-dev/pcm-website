import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { EventItem } from "@/types/events";
import type { SectionText } from "@/types/homepage";
import { safeImg } from "@/lib/sanitize";

export default function EventsSection({
  text,
  events,
}: {
  text: SectionText;
  events: EventItem[];
}) {
  const t = text ?? { badge: "Campus calendar", heading: "Upcoming events", description: "Fests, seminars, workshops and tours — find your next moment at PCM.", linkLabel: "All events", linkHref: "/events" };
  return (
    <section className="py-[clamp(4rem,8vw,6rem)] bg-background">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full bg-pcm-blue/10 text-pcm-blue text-sm font-mono uppercase tracking-wider mb-4">
              {t.badge}
            </span>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy mb-4">
              {t.heading}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.description}
            </p>
          </div>
          <Link
            href={t.linkHref}
            className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold transition-colors group"
          >
            {t.linkLabel}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-pcm-sm hover:shadow-pcm-md transition-all hover:-translate-y-1">
              <div className="relative aspect-[16/10]">
                <Image
                  src={safeImg(event.image)}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-pcm-blue text-sm font-mono mb-3">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </div>
                <h3 className="text-xl font-display font-semibold text-pcm-navy mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <div 
                  className="prose prose-sm max-w-none text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
