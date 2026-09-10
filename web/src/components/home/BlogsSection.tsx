import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Blog } from "@/app/admin/media/blogs/types/blog";

export default function BlogsSection({ blogs }: { blogs: Blog[] }) {
  return (
    <section className="py-[clamp(4rem,8vw,6rem)] bg-background">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full bg-pcm-blue/10 text-pcm-blue text-sm font-mono uppercase tracking-wider mb-4">
              From the blog
            </span>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-display font-semibold text-pcm-navy mb-4">
              Ideas worth reading
            </h2>
            <p className="text-muted-foreground text-lg">
              Career guidance, industry trends and honest advice from the PCM
              community.
            </p>
          </div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold transition-colors group"
          >
            All articles
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug}`}
              className="group bg-card border border-border rounded-2xl overflow-hidden shadow-pcm-sm hover:shadow-pcm-md transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] bg-gradient-to-br from-pcm-blue to-pcm-blue-700">
                {blog.thumbnail ? (
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <svg
                    viewBox="0 0 800 480"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <defs>
                      <linearGradient
                        id={`gradient-${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor={
                            index % 3 === 0
                              ? "#21409a"
                              : index % 3 === 1
                                ? "#51b747"
                                : "#1a3173"
                          }
                        />
                        <stop
                          offset="100%"
                          stopColor={
                            index % 3 === 0
                              ? "#16285b"
                              : index % 3 === 1
                                ? "#3f9e35"
                                : "#14265a"
                          }
                        />
                      </linearGradient>
                    </defs>
                    <rect
                      width="800"
                      height="480"
                      fill={`url(#gradient-${index})`}
                    />
                    <circle
                      cx="680"
                      cy="90"
                      r="60"
                      fill="#fff"
                      opacity="0.15"
                    />
                    <path
                      d="M0 480 L0 360 L220 260 L420 380 L640 280 L800 360 L800 480Z"
                      fill="#fff"
                      opacity="0.14"
                    />
                  </svg>
                )}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-xs font-mono z-10">
                  {blog.date}
                </div>
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary border border-border text-pcm-blue text-xs font-mono uppercase tracking-wide mb-3">
                  {blog.category}
                </span>
                <h3 className="font-display font-semibold text-pcm-navy mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                />
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 text-pcm-blue hover:text-pcm-blue-700 font-semibold text-sm transition-colors group-hover:gap-3">
                    Read article{" "}
                    <ArrowRight className="w-3 h-3 transition-all" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
