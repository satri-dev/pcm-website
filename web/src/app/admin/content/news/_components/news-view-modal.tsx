"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { News } from "@/types/news";
import { CalendarDays, Eye, User, X } from "lucide-react";

interface NewsViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: News | null;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsViewModal({
  open,
  onOpenChange,
  news,
}: NewsViewModalProps) {
  if (!news) return null;

  const statusBadge = news.status === "published" ? "green" : "gold";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="news-modal w-[min(100%,640px)] sm:max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col gap-0 rounded-[16px] p-0 ring-0 outline-none"
      >
        {/* Head */}
        <div className="modal__head">
          <DialogTitle className="m-0 text-[1.05rem] font-normal flex items-center gap-2">
            <Eye size={18} />
            View News
          </DialogTitle>
          <button
            type="button"
            className="admin-icon-btn"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          {news.image && (
            <div className="img-prev mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={news.image} alt={news.title} />
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="badge badge--blue">{news.category}</span>
            <span className={`badge badge--${statusBadge} lowercase`}>
              {news.status}
            </span>
            {news.featured && (
              <span className="badge badge--gold">Featured</span>
            )}
          </div>

          <h3 className="m-0 mb-3 text-xl font-bold text-[var(--admin-ink)]">
            {news.title}
          </h3>

          <div className="flex items-center gap-4 flex-wrap text-sm text-[var(--admin-muted)] mb-4">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formatDate(news.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User size={14} />
              {news.author}
            </span>
            <span>{news.views.toLocaleString()} views</span>
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0 mb-4 text-sm">
            <dt className="font-semibold">Slug</dt>
            <dd className="m-0 text-[var(--admin-muted)] break-all">
              {news.slug}
            </dd>
          </dl>

          {news.excerpt && (
            <section className="mb-4">
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Excerpt
              </h4>
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: news.excerpt }}
              />
            </section>
          )}

          {news.content && (
            <section className="mb-4">
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Content
              </h4>
              <div
                className="text-sm leading-relaxed [&_p]:my-2 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-1.5 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[var(--admin-brand)] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--admin-line)] [&_blockquote]:pl-3 [&_blockquote]:italic [&_img]:max-w-full [&_rounded]:rounded-lg"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </section>
          )}

          {news.tags && news.tags.length > 0 && (
            <section className="mb-4">
              <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                Tags
              </h4>
              <div className="flex items-center gap-1.5 flex-wrap">
                {news.tags.map((tag) => (
                  <span key={tag} className="badge badge--gray">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {news.seo &&
            (news.seo.title || news.seo.description || news.seo.keywords) && (
              <section>
                <h4 className="text-[0.72rem] uppercase tracking-wider font-bold text-[var(--admin-muted)] mt-0 mb-2">
                  SEO
                </h4>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0 text-sm">
                  {news.seo.title && (
                    <>
                      <dt className="font-semibold">Title</dt>
                      <dd className="m-0 text-[var(--admin-muted)]">
                        {news.seo.title}
                      </dd>
                    </>
                  )}
                  {news.seo.description && (
                    <>
                      <dt className="font-semibold">Description</dt>
                      <dd className="m-0 text-[var(--admin-muted)]">
                        {news.seo.description}
                      </dd>
                    </>
                  )}
                  {news.seo.keywords && news.seo.keywords.length > 0 && (
                    <>
                      <dt className="font-semibold">Keywords</dt>
                      <dd className="m-0 text-[var(--admin-muted)]">
                        {news.seo.keywords.join(", ")}
                      </dd>
                    </>
                  )}
                </dl>
              </section>
            )}
        </div>

        {/* Footer */}
        <div className="modal__foot">
          <button
            type="button"
            className="admin-btn"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
