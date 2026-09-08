import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, BookOpen, Laptop } from "lucide-react";
import type { FacilityItem } from "@/app/admin/campus/facilities/types/facilities";

const iconMap: Record<string, typeof GraduationCap> = {
  Learning: GraduationCap,
  Library: BookOpen,
  IT: Laptop,
  Sports: GraduationCap,
  "Student Life": GraduationCap,
};

export default function FacilitiesSection({ facilities }: { facilities: FacilityItem[] }) {
  return (
    <section className="py-[clamp(4rem,8vw,6rem)] bg-secondary/30">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full bg-pcm-blue/10 text-pcm-blue text-sm font-mono uppercase tracking-wider mb-4">
              Our campus
            </span>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy mb-4">
              Facilities designed around you
            </h2>
            <p className="text-muted-foreground text-lg">
              Modern classrooms, dedicated labs and space to play and unwind — everything you need to learn well.
            </p>
          </div>
          <Link
            href="/facilities"
            className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold transition-colors group"
          >
            All facilities
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => {
            const Icon = iconMap[facility.category] ?? GraduationCap;
            return (
              <div key={facility.id} className="bg-card rounded-2xl overflow-hidden border border-border shadow-pcm-sm hover:shadow-pcm-md transition-shadow">
                <div className="relative aspect-[4/3]">
                  {facility.image && (
                    <Image
                      src={facility.image}
                      alt={facility.name}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-pcm-green/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-pcm-green" />
                    </div>
                    <span className="text-sm font-mono uppercase tracking-wider text-pcm-blue">
                      {facility.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-pcm-navy mb-2">
                    {facility.name}
                  </h3>
                  <div
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: facility.description }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
