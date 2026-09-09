import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedNewsBySlugCached,
  getPublishedNews,
} from "@/lib/data/news";
import { getNewsArticleSettingsCached } from "@/lib/data/news-article-settings";
import { BUILD_PLACEHOLDER_SLUG } from "@/lib/constants";

export async function generateStaticParams() {
  try {
    const items = await getPublishedNews();
    if (items.length === 0) return [{ slug: BUILD_PLACEHOLDER_SLUG }];
    return items.map((n) => ({ slug: n.slug }));
  } catch (error) {
    console.warn("Failed to generate static params for news:", error);
    return [{ slug: BUILD_PLACEHOLDER_SLUG }];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedNewsBySlugCached(slug);
  const settings = await getNewsArticleSettingsCached();
  if (!post) return {};
  return {
    title:
      post.seo?.title ||
      `${post.title} ${settings.seoTitleSuffix.trim()}`.trim(),
    description: post.seo?.description || post.excerpt,
    keywords: post.seo?.keywords,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settings, allNews] = await Promise.all([
    getPublishedNewsBySlugCached(slug),
    getNewsArticleSettingsCached(),
    getPublishedNews(),
  ]);
  if (!post) notFound();

  const related = settings.showRelated
    ? allNews.filter((n) => n.slug !== post.slug).slice(0, 3)
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
          {post.publishedAt}
          {post.author ? ` · ${settings.bylinePrefix} ${post.author}` : ""}
        </p>

        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-7 shadow-pcm-md">
          <Image
            src={post.image || "/assets/img/news-default.jpg"}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 820px"
            className="object-cover"
          />
        </div>

        <div
          className="prose prose-lg max-w-none [&_:where(p)]:text-muted-foreground [&_:where(p)]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
        />
      </div>

      {related.length > 0 && (
        <div className="container max-w-[1100px] mt-16">
          <h2 className="text-[clamp(1.3rem,2.4vw,1.7rem)] font-display font-semibold text-pcm-navy mb-6">
            {settings.relatedTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((s) => (
              <Link key={s.slug} href={`/news/${s.slug}`} className="group">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
                  <Image
                    src={s.image || "/assets/img/news-default.jpg"}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
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
