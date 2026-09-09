/**
 * Placeholder slug returned by `generateStaticParams` when the database is
 * empty during a production build.  Next.js 16 Cache Components require at
 * least one result from every `generateStaticParams` function; this dummy
 * entry satisfies that constraint while the real page component calls
 * `notFound()` at runtime if no matching resource exists.
 */
export const BUILD_PLACEHOLDER_SLUG = "__build_placeholder__";
