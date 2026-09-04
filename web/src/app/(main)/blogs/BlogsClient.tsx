"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import type { Blog } from "@/app/admin/media/blogs/types/blog";
import type { BlogPageSettings } from "@/types/blog-page-settings";

const PER_PAGE = 3;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function TruncatedExcerpt({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false);
  const plain = useMemo(() => stripHtml(html), [html]);
  const needsTruncation = plain.length > 180;
  const preview = needsTruncation ? plain.slice(0, 180) + "…" : plain;

  return (
    <div className="text-gray-500 text-[0.93rem]">
      {expanded ? (
        <div
          className="prose prose-sm max-w-none text-gray-500 [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="m-0">{preview}</p>
      )}
      {needsTruncation && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-[0.82rem] font-semibold text-pcm-blue hover:text-pcm-blue-700 bg-transparent border-none p-0 cursor-pointer"
        >
         
        </button>
      )}
    </div>
  );
}

const CATEGORY_LABELS: { value: string; label: string }[] = [
  { value: "all", label: "All categories" },
  { value: "Career", label: "Career" },
  { value: "Finance", label: "Finance" },
  { value: "Technology", label: "Technology" },
  { value: "Student Life", label: "Student Life" },
  { value: "Admissions", label: "Admissions" },
  { value: "Events", label: "Events" },
  { value: "Achievement", label: "Achievement" },
  { value: "Other", label: "Other" },
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(dateISO: string) {
  const d = new Date(dateISO.length === 10 ? `${dateISO}T00:00:00` : dateISO);
  if (isNaN(d.getTime())) return { day: "01", monthYear: "" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    monthYear: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  };
}

function ArrowRight({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function ChevRight({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
}

function ChevLeft({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
}

function SearchIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
}

function BlogCardSvg({ color }: { color?: string }) {
  const c = color || "#4167C9";
  return (
    <svg className="w-full h-full" viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <rect width="800" height="480" fill={c} />
      <circle cx="680" cy="90" r="60" fill="#fff" opacity=".15" />
      <path d="M0 480 L0 360 L220 260 L420 380 L640 280 L800 360 L800 480Z" fill="#fff" opacity=".14" />
      <path d="M0 480 L0 410 L260 330 L480 430 L700 350 L800 400 L800 480Z" fill="#14265A" opacity=".5" />
      <path d="M700 480 L740 400 H760 L760 480Z" fill="#fff" opacity=".05" />
    </svg>
  );
}

function BlogsInner({ settings, blogs }: { settings: BlogPageSettings; blogs: Blog[] }) {
  const searchParams = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get("p") || "1", 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });

  const hero = {
    title: settings.heroTitle,
    subtitle: settings.heroSubtitle,
  };
  const intro = {
    eyebrow: settings.articlesEyebrow,
    title: settings.articlesTitle,
    subtitle: settings.articlesSubtitle,
  };

  const filteredItems = useMemo(() => {
    return blogs.filter((post) => {
      const matchCat = category === "all" || post.category === category;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, category, blogs]);

  const { visibleItems, pagedSet, totalPages, current, shownCount } = useMemo(() => {
    const total = Math.max(1, Math.ceil(filteredItems.length / PER_PAGE));
    const cur = Math.min(page, total);
    const start = (cur - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const paged = new Set<string>();
    filteredItems.forEach((post, i) => {
      if (i < start || i >= end) paged.add(post.slug);
    });
    return {
      visibleItems: filteredItems,
      pagedSet: paged,
      totalPages: total,
      current: cur,
      shownCount: filteredItems.length,
    };
  }, [filteredItems, page]);

  const go = useCallback(
    (p: number) => {
      const next = Math.min(Math.max(1, p), totalPages);
      setPage(next);
      const params = new URLSearchParams(window.location.search);
      if (next === 1) params.delete("p");
      else params.set("p", String(next));
      const qs = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : "") + window.location.hash);
      const top = gridRef.current?.getBoundingClientRect().top;
      if (top !== undefined) {
        window.scrollTo({ top: Math.max(0, top + window.pageYOffset - 90), behavior: "smooth" });
      }
    },
    [totalPages]
  );

  return (
    <div className="font-(--font-poppins) leading-relaxed">
      {/* Hero */}
      <section className="relative bg-pcm-blue-900 text-white/80 overflow-hidden">
        <svg className="absolute inset-x-0 top-0 w-full h-full pointer-events-none" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="relative z-10 w-full max-w-340 mx-auto px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(3rem,6vw,4.5rem)] grid gap-4">
          <nav className="flex flex-wrap items-center gap-1.5 text-[0.74rem] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <Link href="/" className="text-[#51B747] hover:underline">Home</Link>
            <ChevRight className="w-3 h-3 opacity-50" />
            <span>{settings.breadcrumbLabel}</span>
          </nav>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold" style={{ color: '#ffffff' }}>{hero.title}</h1>
          <p className="max-w-[56ch]" style={{ color: 'rgba(255,255,255,0.7)' }}>{hero.subtitle}</p>
        </div>
      </section>

      {/* Articles section */}
      <section className="py-[clamp(3.5rem,8vw,6.5rem)] text-gray-600">
        <div className="w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          {/* Header row */}
          <div className="flex justify-between items-end gap-4 flex-wrap mb-[clamp(2rem,4vw,2.75rem)]">
            <div className="max-w-[640px] grid gap-3.5">
              <span className="inline-flex items-center gap-2 text-[0.74rem] tracking-[0.2em] uppercase text-[#21409a]">{intro.eyebrow}</span>
              <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight text-[#16285b] font-semibold">{intro.title}</h2>
              <p className="text-gray-500">{intro.subtitle}</p>
            </div>
            <Link className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-bold text-sm border border-gray-200 text-[#16285b] hover:border-[#21409a] hover:text-[#21409a] transition-colors" href="/blogs-student">
              Student Blogs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Search + filter */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <label className="relative flex-1 min-w-[220px]">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[1.05rem] h-[1.05rem] text-gray-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                aria-label="Search articles..."
                className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-[14px] bg-white text-[#16285b] text-[0.92rem] outline-none focus:border-[#21409a] focus:shadow-[0_0_0_3px_rgba(33,64,154,0.14)] transition-all placeholder:text-gray-400"
              />
            </label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              aria-label="Filter by category"
              className="py-2.5 px-5 border border-gray-200 rounded-[14px] bg-white text-[#16285b] text-[0.9rem] font-semibold outline-none focus:border-[#21409a] transition-colors"
            >
              {CATEGORY_LABELS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <span className="ml-auto font-[var(--font-poppins)] text-[0.78rem] tracking-wider text-gray-400 whitespace-nowrap">
              {shownCount} of {blogs.length} shown
            </span>
          </div>

          {/* Grid */}
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(1.25rem,2.5vw,1.75rem)]">
            {visibleItems.map((post, i) => {
              const isPaged = pagedSet.has(post.slug);
              if (isPaged) return null;
              const { day, monthYear } = formatDate(post.date);
              return (
                <article
                  key={post.slug}
                  className="flex flex-col bg-white border border-gray-200 rounded-[22px] overflow-hidden shadow-[0_1px_3px_rgba(22,40,91,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(22,40,91,0.12)]"
                  style={{ transitionDelay: `${(i % PER_PAGE) * 50}ms` }}
                >
                  <Link className="relative aspect-16/10 overflow-hidden bg-gray-50 block" href={`/blogs/${post.slug}`} aria-label={post.title}>
                    {post.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <BlogCardSvg />
                    )}
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-[rgba(10,27,51,0.85)] text-white rounded-lg text-[0.72rem] backdrop-blur-sm">
                      <b className="font-bold mr-1">{day}</b>{monthYear}
                    </span>
                  </Link>
                  <div className="grid gap-2.5 px-6 py-4 flex-1 content-start">
                    <span className="justify-self-start inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-200 text-pcm-blue rounded-full text-[0.66rem] tracking-widest uppercase font-semibold">{post.category}</span>
                    <h3 className="text-[1.18rem] leading-snug text-[#16285b]">
                      <Link href={`/blogs/${post.slug}`} className="hover:text-[#21409a] transition-colors">{post.title}</Link>
                    </h3>
                    <TruncatedExcerpt html={post.excerpt} />
                  </div>
                  <div className="px-6 pb-6 mt-auto">
                    <Link className="inline-flex items-center gap-1.5 font-bold text-[0.92rem] text-[#21409a] hover:gap-2.5 hover:text-[#1b3376] transition-all" href={`/blogs/${post.slug}`}>
                      Read article <ArrowRight className="w-[1.05rem] h-[1.05rem]" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {shownCount === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No articles found matching your search.</p>
            </div>
          )}

          {/* Pagination */}
          <nav className="flex items-center justify-center gap-1.5 mt-8 flex-wrap" aria-label="Pagination">
            <span className="font-[var(--font-poppins)] text-[0.72rem] tracking-widest uppercase text-gray-400 mr-1 whitespace-nowrap">Page {current} of {totalPages}</span>
            <button type="button" className="min-w-[42px] h-[42px] px-3.5 inline-flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg bg-white text-[#16285b] text-[0.9rem] font-semibold cursor-pointer transition-all hover:border-[#21409a] hover:text-[#21409a] disabled:opacity-45 disabled:cursor-default disabled:pointer-events-none" aria-label="Previous page" disabled={current <= 1} onClick={() => go(current - 1)}>
              <ChevLeft className="w-4 h-4" /><span className="hidden sm:inline">Prev</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" className={`min-w-[42px] h-[42px] px-3.5 inline-flex items-center justify-center border rounded-lg text-[0.9rem] font-semibold cursor-pointer transition-all ${n === current ? "bg-[#21409a] border-[#21409a] text-white shadow-[0_6px_16px_rgba(33,64,154,0.28)]" : "bg-white border-gray-200 text-[#16285b] hover:border-[#21409a] hover:text-[#21409a]"}`} aria-current={n === current ? "page" : undefined} onClick={() => go(n)}>
                {n}
              </button>
            ))}
            <button type="button" className="min-w-[42px] h-[42px] px-3.5 inline-flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg bg-white text-[#16285b] text-[0.9rem] font-semibold cursor-pointer transition-all hover:border-[#21409a] hover:text-[#21409a] disabled:opacity-45 disabled:cursor-default disabled:pointer-events-none" aria-label="Next page" disabled={current >= totalPages} onClick={() => go(current + 1)}>
              <span className="hidden sm:inline">Next</span><ChevRight className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[clamp(2.5rem,5vw,4rem)]">
        <div className="w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          <div className="relative overflow-hidden rounded-[22px] shadow-[0_4px_6px_-1px_rgba(22,40,91,0.1),0_2px_4px_-2px_rgba(22,40,91,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#16285b] to-[#14265a]" />
            <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_85%_10%,rgba(81,183,71,0.28),transparent_60%),radial-gradient(500px_300px_at_10%_90%,rgba(65,103,201,0.35),transparent_60%)]" />
            <div className="relative z-10 grid grid-cols-[1.3fr_auto] gap-[clamp(1.25rem,3vw,2.5rem)] items-center p-[clamp(2rem,5vw,3.5rem)_clamp(1.5rem,4vw,3rem)] max-md:grid-cols-1 max-md:text-center" style={{ color: '#ffffff' }}>
              <div>
                <span className="inline-flex items-center gap-2 text-[0.74rem] tracking-[0.2em] uppercase text-[#51B747]">Enter to Learn — Go Forth to Serve</span>
                <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mt-2 mb-2 font-semibold">{settings.ctaTitle}</h2>
                <p className="max-w-[56ch] max-md:mx-auto" style={{ color: 'rgba(255,255,255,0.72)' }}>{settings.ctaText}</p>
              </div>
              <div className="flex flex-wrap gap-3.5 max-md:justify-center">
                <Link className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-[14px] font-bold text-[0.98rem] bg-[#51B747] text-[#16285b] hover:bg-[#3f9e35] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(81,183,71,0.28)] transition-all" href={settings.ctaPrimaryHref}>
                  {settings.ctaPrimaryLabel} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-[14px] font-bold text-[0.98rem] bg-transparent text-white border border-white/35 hover:border-white hover:text-white transition-all" href={settings.ctaSecondaryHref}>
                  {settings.ctaSecondaryLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BlogsClient({ settings, blogs }: { settings: BlogPageSettings; blogs: Blog[] }) {
  return (
    <Suspense>
      <BlogsInner settings={settings} blogs={blogs} />
    </Suspense>
  );
}
