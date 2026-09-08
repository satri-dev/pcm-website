"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { News } from "@/types/news";
import { Notice } from "@/types/notices";
import { Result } from "@/types/results";
import { EventItem } from "@/types/events";

interface Props {
  news: News[];
  notices: Notice[];
  results: Result[];
  events: EventItem[];
}

const tabs = [
  { id: "news", label: "News" },
  { id: "notices", label: "Notices" },
  { id: "results", label: "Results" },
  { id: "events", label: "Events" }
];

export default function NewsSection({ news, notices, results, events }: Props) {
  const [activeTab, setActiveTab] = useState("news");

  const renderTabContent = () => {
    switch (activeTab) {
      case "news":
        return (
          <div className="space-y-4">
            {news.slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="flex gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                {item.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt="" width={64} height={64} className="object-cover w-full h-full" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-1">{item.publishedAt}</div>
                  <div className="font-medium text-pcm-navy line-clamp-2">{item.title}</div>
                </div>
              </Link>
            ))}
            <Link href="/news" className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold text-sm transition-colors group mt-4">
              View all news <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        );
      case "notices":
        return (
          <div className="space-y-4">
            {notices.slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/notices/${item.slug}`} className="block p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="text-xs text-muted-foreground mb-1">{item.date}</div>
                <div className="font-medium text-pcm-navy">{item.title}</div>
              </Link>
            ))}
            <Link href="/notices" className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold text-sm transition-colors group mt-4">
              View all notices <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        );
      case "results":
        return (
          <div className="space-y-4">
            {results.slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/results/${item.slug}`} className="block p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="text-xs text-muted-foreground mb-1">{item.date}</div>
                <div className="font-medium text-pcm-navy">{item.title}</div>
              </Link>
            ))}
            <Link href="/results" className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold text-sm transition-colors group mt-4">
              View all results <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        );
      case "events":
        return (
          <div className="space-y-4">
            {events.slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/events/${item.slug}`} className="flex gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                {item.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt="" width={64} height={64} className="object-cover w-full h-full" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-1">{item.date}</div>
                  <div className="font-medium text-pcm-navy line-clamp-2">{item.title}</div>
                </div>
              </Link>
            ))}
            <Link href="/events" className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold text-sm transition-colors group mt-4">
              View all events <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-[clamp(4rem,8vw,6rem)] mt-[clamp(4rem,8vw,6rem)] bg-secondary/30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 lg:gap-12">
          <div>
            <div className="max-w-2xl mb-8">
              <span className="inline-block px-4 py-2 rounded-full bg-pcm-blue/10 text-pcm-blue text-sm font-mono uppercase tracking-wider mb-4">
                Newsroom
              </span>
              <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy mb-4">
                Latest from PCM
              </h2>
              <p className="text-muted-foreground text-lg">
                Stories, achievements and campus updates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(0, 3).map((item) => (
                <Link key={item.slug} href={`/news/${item.slug}`} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-pcm-sm hover:shadow-pcm-md transition-all hover:-translate-y-1">
                  <div className="relative aspect-[16/10]">
                    {item.image && (
                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" />
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-md bg-pcm-dark/85 text-white text-xs font-mono">
                      {item.publishedAt}
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary border border-border text-pcm-blue text-xs font-mono uppercase tracking-wide mb-3">
                      {item.category}
                    </span>
                    <h3 className="font-display font-semibold text-pcm-navy mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div 
                      className="prose prose-sm max-w-none text-sm text-muted-foreground line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: item.excerpt }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-pcm-sm h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-pcm-navy">Updates</h3>
              <Link href="/news" className="text-pcm-green hover:text-pcm-green-600 font-semibold text-sm transition-colors">
                All
              </Link>
            </div>

            <div className="border-b border-border mb-6">
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-pcm-blue text-pcm-blue bg-secondary"
                        : "border-transparent text-muted-foreground hover:text-pcm-navy"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </section>
  );
}
