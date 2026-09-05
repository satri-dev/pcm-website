import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getApprovedBlogStudentCached,
  getApprovedBlogStudents,
} from "@/lib/data/blog-student";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(dateISO: string) {
  const d = new Date(`${dateISO}T00:00:00`);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  const items = await getApprovedBlogStudents();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getApprovedBlogStudentCached(slug);
  if (!post) return {};

  const description = stripHtml(post.excerpt).slice(0, 160);

  return {
    title: `${post.title} | Student Blogs | Pokhara College of Management`,
    description: description || post.body,
    alternates: { canonical: `/blogs-student/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: `${post.date}T00:00:00.000Z`,
      authors: post.author ? [post.author] : undefined,
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
  };
}

export default async function StudentBlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getApprovedBlogStudentCached(slug),
    getApprovedBlogStudents(),
  ]);
  if (!post) notFound();

  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <section className="py-[clamp(3rem,6vw,5rem)]">
      <div className="w-full max-w-[840px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <nav className="font-mono text-[0.74rem] uppercase tracking-wide text-gray-400 mb-4">
          <Link href="/blogs-student" className="text-pcm-blue hover:underline">
            Student Blogs
          </Link>
          <span className="mx-2">/</span>
          <span>{post.category}</span>
        </nav>

        <span className="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-200 text-pcm-blue rounded-full text-[0.66rem] tracking-widest uppercase font-semibold mb-4">
          {post.tag || post.category}
        </span>
        <h1 className="text-[clamp(1.7rem,3.4vw,2.4rem)] font-(--font-poppins) font-semibold text-pcm-navy leading-[1.2]">
          {post.title}
        </h1>
        <p className="mt-3 font-mono text-sm text-gray-400">
          {formatDate(post.date)} · By {post.author}
        </p>

        {post.image && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-7 shadow-pcm-md">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 840px"
              className="object-cover"
            />
          </div>
        )}

        {post.excerpt && (
          <div
            className="prose prose-lg max-w-none prose-headings:text-pcm-navy prose-p:text-[#3a4358] prose-p:leading-relaxed [&_strong]:text-pcm-navy"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}

        {post.body && (
          <div className="mt-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-pcm-navy prose-p:text-[#3a4358] prose-p:leading-relaxed [&_strong]:text-pcm-navy"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link
            href="/blogs-student"
            className="inline-flex items-center gap-1.5 font-bold text-[0.92rem] text-[#21409a] hover:gap-2.5 hover:text-[#1b3376] transition-all"
          >
            <span aria-hidden>←</span> Back to all student blogs
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="w-full max-w-[1100px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] mt-16">
          <h2 className="text-[clamp(1.3rem,2.4vw,1.7rem)] font-(--font-poppins) font-semibold text-pcm-navy mb-6">
            More student stories
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/blogs-student/${item.slug}`}
                className="group flex flex-col bg-white border border-gray-200 rounded-[22px] overflow-hidden shadow-[0_1px_3px_rgba(22,40,91,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(22,40,91,0.12)]"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-gray-50">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#16285b] to-[#14265a]" />
                  )}
                </div>
                <div className="grid gap-2 px-5 py-4 flex-1 content-start">
                  <span className="justify-self-start inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-200 text-pcm-blue rounded-full text-[0.66rem] tracking-widest uppercase font-semibold">
                    {item.tag || item.category}
                  </span>
                  <h3 className="m-0 text-[1.02rem] leading-snug text-pcm-blue-900 group-hover:text-pcm-blue transition-colors">
                    {item.title}
                  </h3>
                  <span className="mt-auto text-[0.82rem] text-gray-400 font-medium">
                    {item.author}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}