import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";

const upcomingEvents = [
  {
    date: "15 Aug 2026",
    title: "Coding Bootcamp for BCSIT",
    description: "Intensive coding workshop for BCSIT students to enhance programming skills.",
    image: "/images/hero-6.jpg"
  },
  {
    date: "22 Aug 2026", 
    title: "Guest Lecture: Careers in Banking",
    description: "Industry experts share insights about banking and finance career opportunities.",
    image: "/images/about-1.jpg"
  },
  {
    date: "29 Aug 2026",
    title: "Inter-Batch Sports Tournament",
    description: "Annual sports competition bringing together students from all programs.",
    image: "/images/about-games.jpg"
  }
];

export default function EventsSection() {
  return (
    <section className="py-[clamp(4rem,8vw,6rem)] bg-background">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full bg-pcm-blue/10 text-pcm-blue text-sm font-mono uppercase tracking-wider mb-4">
              Campus calendar
            </span>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy mb-4">
              Upcoming events
            </h2>
            <p className="text-muted-foreground text-lg">
              Fests, seminars, workshops and tours — find your next moment at PCM.
            </p>
          </div>
          <Link 
            href="/events" 
            className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold transition-colors group"
          >
            All events 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <Link key={event.title} href="/events" className="group bg-card border border-border rounded-2xl overflow-hidden shadow-pcm-sm hover:shadow-pcm-md transition-all hover:-translate-y-1">
              <div className="relative aspect-[16/10]">
                <Image
                  src={event.image}
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
                <p className="text-muted-foreground line-clamp-3">
                  {event.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}