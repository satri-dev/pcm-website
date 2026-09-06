import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedBlogBySlugCached,
  getPublishedBlogs,
} from "@/lib/data/blogs";
import { getBlogArticleSettingsCached } from "@/lib/data/blog-article-settings";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateISO: string) {
  const d = new Date(dateISO.length === 10 ? `${dateISO}T00:00:00` : dateISO);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  try {
    const items = await getPublishedBlogs();
    return items.map((n) => ({ slug: n.slug }));
  } catch (error) {
    console.warn("Failed to generate static params for blogs:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogBySlugCached(slug);
  const settings = await getBlogArticleSettingsCached();
  if (!post) return {};

  const description = stripHtml(post.excerpt).slice(0, 160);

  return {
    title: `${post.title} ${settings.seoTitleSuffix.trim()}`.trim(),
    description: description || post.excerpt,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: post.author ? [post.author] : undefined,
      ...(post.thumbnail ? { images: [{ url: post.thumbnail }] } : {}),
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settings, allBlogs] = await Promise.all([
    getPublishedBlogBySlugCached(slug),
    getBlogArticleSettingsCached(),
    getPublishedBlogs(),
  ]);
  if (!post) notFound();

  const related = settings.showRelated
    ? allBlogs.filter((b) => b.slug !== post.slug).slice(0, 3)
    : [];

  return (
    <section className="py-[clamp(3rem,6vw,5rem)]">
      <div className="container max-w-[820px]">
        <nav className="font-mono text-[0.74rem] uppercase tracking-wide text-muted-foreground mb-4">
          <Link
            href={settings.backToAllHref}
            className="text-pcm-blue hover:underline"
          >
            {settings.backToAllLabel}
          </Link>
          <span className="mx-2">/</span>
          <span>{settings.breadcrumbLabel}</span>
        </nav>

        <span className="inline-block px-3 py-1 rounded-full bg-secondary border border-border text-pcm-blue font-mono text-[0.66rem] uppercase tracking-wide mb-3">
          {post.category}
        </span>
        <h1 className="text-[clamp(1.7rem,3.4vw,2.4rem)] font-display font-semibold text-pcm-navy">
          {post.title}
        </h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          {settings.publishedLabel} {settings.publishedLabelPrefix}{" "}
          {formatDate(post.date)}
          {post.author ? ` · ${settings.bylinePrefix} ${post.author}` : ""}
        </p>

        {post.thumbnail && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-7 shadow-pcm-md">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 820px"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none [&_:where(p)]:text-muted-foreground [&_:where(p)]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
      </div>

      {settings.showUsefulLinks && settings.usefulLinks?.length > 0 && (
        <div className="container max-w-[820px] mt-14">
          <div className="rounded-2xl border border-border bg-secondary/40 p-6">
            {settings.usefulLinksEyebrow && (
              <span className="font-mono text-[0.66rem] uppercase tracking-wide text-pcm-blue">
                {settings.usefulLinksEyebrow}
              </span>
            )}
            <h2 className="mt-1 text-[1.15rem] font-display font-semibold text-pcm-navy">
              {settings.usefulLinksTitle}
            </h2>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 list-none p-0">
              {settings.usefulLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm text-pcm-blue hover:underline"
                  >
                    {link.label}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="container max-w-[1100px] mt-16">
          <h2 className="text-[clamp(1.3rem,2.4vw,1.7rem)] font-display font-semibold text-pcm-navy mb-6">
            {settings.relatedTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((s) => (
              <Link key={s.slug} href={`/blogs/${s.slug}`} className="group">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
                  {s.thumbnail ? (
                    <Image
                      src={s.thumbnail}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#16285b] to-[#14265a]" />
                  )}
                </div>
                <span className="font-mono text-[0.66rem] uppercase tracking-wide text-pcm-blue">
                  {s.category}
                </span>
                <h3 className="mt-1 text-[0.98rem] font-semibold text-pcm-navy group-hover:underline">
                  {s.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
