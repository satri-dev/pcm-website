"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { studentBlogsData } from "@/data/news";

const PER_PAGE = 3;

const categories = [
  { value: "all", label: "All categories" },
  { value: "internships", label: "Internships" },
  { value: "campus-life", label: "Campus Life" },
  { value: "finance", label: "Finance" },
  { value: "skills", label: "Skills" },
  { value: "clubs", label: "Clubs" },
];

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

function BlogCardSvg({ color }: { color: string }) {
  return (
    <svg className="w-full h-full" viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <rect width="800" height="480" fill={color} />
      <circle cx="150" cy="120" r="70" fill="#fff" opacity=".12" />
      <path d="M0 480 L0 360 L240 250 L460 380 L680 290 L800 370 L800 480Z" fill="#fff" opacity=".13" />
      <path d="M0 480 L0 420 L280 340 L500 430 L720 350 L800 410 L800 480Z" fill="#14265A" opacity=".5" />
    </svg>
  );
}

function BlogsStudentInner() {
  const searchParams = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get("p") || "1", 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });

  const filteredItems = useMemo(() => {
    return studentBlogsData.filter((post) => {
      const matchCat = category === "all" || post.cat === category;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const { pagedSet, totalPages, current, shownCount } = useMemo(() => {
    const total = Math.max(1, Math.ceil(filteredItems.length / PER_PAGE));
    const cur = Math.min(page, total);
    const start = (cur - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const paged = new Set<string>();
    filteredItems.forEach((post, i) => {
      if (i < start || i >= end) paged.add(post.slug);
    });
    return { pagedSet: paged, totalPages: total, current: cur, shownCount: filteredItems.length };
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
    <div className="font-[var(--font-poppins)] leading-relaxed">
      {/* Hero */}
      <section className="relative bg-[#16285b] text-white/80 overflow-hidden">
        <svg className="absolute inset-x-0 top-0 w-full h-full pointer-events-none" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
          <path d="M0 400 L0 250 L300 120 L560 260 L820 90 L1120 240 L1440 120 L1440 400Z" fill="#4167C9" opacity=".2" />
          <path d="M0 400 L0 300 L360 200 L680 320 L980 210 L1280 300 L1440 240 L1440 400Z" fill="#14265A" opacity=".45" />
        </svg>
        <div className="relative z-10 w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(3rem,6vw,4.5rem)] grid gap-4">
          <nav className="flex flex-wrap items-center gap-1.5 text-[0.74rem] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <Link href="/" className="text-[#51B747] hover:underline">Home</Link>
            <ChevRight className="w-3 h-3 opacity-50" />
            <span>Student Blogs</span>
          </nav>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold" style={{ color: '#ffffff' }}>Student Blogs</h1>
          <p className="max-w-[56ch]" style={{ color: 'rgba(255,255,255,0.7)' }}>Life at PCM, told by the people who live it — our students.</p>
        </div>
      </section>

      {/* Student stories section */}
      <section className="py-[clamp(3.5rem,8vw,6.5rem)] text-gray-600">
        <div className="w-full max-w-[1360px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          {/* Header row */}
          <div className="flex justify-between items-end gap-4 flex-wrap mb-[clamp(2rem,4vw,2.75rem)]">
            <div className="max-w-[640px] grid gap-3.5">
              <span className="inline-flex items-center gap-2 text-[0.74rem] tracking-[0.2em] uppercase text-[#21409a]">Voices from campus</span>
              <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight text-[#16285b] font-semibold">Student stories</h2>
              <p className="text-gray-500">First-person accounts of campus life, internships, festivals and growth at PCM.</p>
            </div>
            <Link className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-bold text-sm border border-gray-200 text-[#16285b] hover:border-[#21409a] hover:text-[#21409a] transition-colors" href="/blogs">
              All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Search + filter */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <label className="relative flex-1 min-w-[220px]">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[1.05rem] h-[1.05rem] text-gray-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search student stories..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                aria-label="Search student stories..."
                className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-[14px] bg-white text-[#16285b] text-[0.92rem] outline-none focus:border-[#21409a] focus:shadow-[0_0_0_3px_rgba(33,64,154,0.14)] transition-all placeholder:text-gray-400"
              />
            </label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              aria-label="Filter by category"
              className="py-2.5 px-5 border border-gray-200 rounded-[14px] bg-white text-[#16285b] text-[0.9rem] font-semibold outline-none focus:border-[#21409a] transition-colors"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <span className="ml-auto font-[var(--font-poppins)] text-[0.78rem] tracking-wider text-gray-400 whitespace-nowrap">
              {shownCount} of {studentBlogsData.length} shown
            </span>
          </div>

          {/* Grid */}
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(1.25rem,2.5vw,1.75rem)]">
            {filteredItems.map((post, i) => {
              const isPaged = pagedSet.has(post.slug);
              if (isPaged) return null;
              const day = post.date.split(" ")[0] || "01";
              const monthYear = post.date.split(" ").slice(1).join(" ");
              return (
                <article
                  key={post.slug}
                  className="flex flex-col bg-white border border-gray-200 rounded-[22px] overflow-hidden shadow-[0_1px_3px_rgba(22,40,91,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(22,40,91,0.12)]"
                  style={{ transitionDelay: `${(i % PER_PAGE) * 50}ms` }}
                >
                  <Link className="relative aspect-[16/10] overflow-hidden bg-gray-50 block" href={`/blogs/${post.slug}`} aria-label={post.title}>
                    <BlogCardSvg color={post.color} />
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-[rgba(10,27,51,0.85)] text-white rounded-lg text-[0.72rem] backdrop-blur-sm">
                      <b className="font-bold mr-1">{day}</b>{monthYear}
                    </span>
                  </Link>
                  <div className="grid gap-2.5 px-6 py-4 flex-1 content-start">
                    <span className="justify-self-start inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-200 text-[#21409a] rounded-full text-[0.66rem] tracking-widest uppercase font-semibold">{post.tag}</span>
                    <h3 className="text-[1.18rem] leading-snug text-[#16285b]">
                      <Link href={`/blogs/${post.slug}`} className="hover:text-[#21409a] transition-colors">{post.title}</Link>
                    </h3>
                    <p className="text-gray-500 text-[0.93rem]">{post.excerpt}</p>
                  </div>
                  <div className="px-6 pb-6 mt-auto flex items-center justify-between">
                    <span className="text-[0.85rem] text-gray-400 font-medium">{post.author}</span>
                    <Link className="inline-flex items-center gap-1.5 font-bold text-[0.92rem] text-[#21409a] hover:gap-2.5 hover:text-[#1b3376] transition-all" href={`/blogs/${post.slug}`}>
                      Read <ArrowRight className="w-[1.05rem] h-[1.05rem]" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {shownCount === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No student stories found matching your search.</p>
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
                <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] mt-2 mb-2 font-semibold">A step towards your future</h2>
                <p className="max-w-[56ch] max-md:mx-auto" style={{ color: 'rgba(255,255,255,0.72)' }}>Applications for the 2083 intake are open across all three programs. Take the first step today.</p>
              </div>
              <div className="flex flex-wrap gap-3.5 max-md:justify-center">
                <Link className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-[14px] font-bold text-[0.98rem] bg-[#51B747] text-[#16285b] hover:bg-[#3f9e35] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(81,183,71,0.28)] transition-all" href="/admission">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link className="inline-flex items-center gap-1.5 px-7 py-3.5 rounded-[14px] font-bold text-[0.98rem] bg-transparent text-white border border-white/35 hover:border-white hover:text-white transition-all" href="/programs">
                  Explore Programs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BlogsStudentClient() {
  return (
    <Suspense>
      <BlogsStudentInner />
    </Suspense>
  );
}
