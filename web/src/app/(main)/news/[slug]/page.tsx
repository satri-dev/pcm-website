import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { newsData, getNewsBySlug } from "@/data/news";

export function generateStaticParams() {
  return newsData.map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getNewsBySlug(params.slug);
  if (!post) return {};
  return { title: `${post.title} | PCM News`, description: post.excerpt };
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const post = getNewsBySlug(params.slug);
  if (!post) notFound();

  return (
    <section className="py-[clamp(3rem,6vw,5rem)]">
      <div className="container max-w-[820px]">
        <nav className="font-mono text-[0.74rem] uppercase tracking-wide text-muted-foreground mb-4">
          <Link href="/news" className="text-pcm-blue hover:underline">News</Link>
          <span className="mx-2">/</span>
          <span>{post.tag}</span>
        </nav>

        <span className="inline-block px-3 py-1 rounded-full bg-secondary border border-border text-pcm-blue font-mono text-[0.66rem] uppercase tracking-wide mb-3">
          {post.tag}
        </span>
        <h1 className="text-[clamp(1.7rem,3.4vw,2.4rem)] font-display font-semibold text-pcm-navy">
          {post.title}
        </h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">{post.date}</p>

        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-7 shadow-pcm-md">
          <Image 
            src={post.image} 
            alt={post.title} 
            fill 
            priority
            sizes="(max-width: 768px) 100vw, 820px"
            className="object-cover" 
          />
        </div>

        <article className="prose grid gap-4 max-w-none">
          {post.body.map((para, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed max-w-[72ch]">
              {para}
            </p>
          ))}
        </article>
      </div>
    </section>
  );
}
