import Link from 'next/link';
import { Metadata } from 'next';
import { getAllPosts, getAllTags } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Developer Tools Blog',
  description:
    'Long-form, practical posts on the developer tools you use every day: JSON formatters, JWT decoders, Base64, timestamps, regex, UUIDs. Example-driven, SEO-optimized, updated daily.',
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/rss.xml' } },
  openGraph: {
    type: 'website',
    title: 'Developer Tools Blog | ConverterHub',
    description:
      'Long-form, practical posts on the developer tools you use every day.',
    url: 'https://converterhub.dev/blog',
  },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const [featured, ...rest] = posts;

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'ConverterHub — Developer Tools Blog',
    url: 'https://converterhub.dev/blog',
    description:
      'Long-form, practical posts on the developer tools you use every day.',
    blogPost: posts.slice(0, 10).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://converterhub.dev/blog/${p.slug}`,
      datePublished: p.date,
      description: p.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <section className="border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
        <div className="container py-8 md:py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--text)] leading-tight">
              Developer Tools Blog
            </h1>
            <p className="mt-3 text-base md:text-lg text-[color:var(--text-soft)] leading-relaxed">
              Long-form, example-driven posts on the tools you actually use. Updated regularly.
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm">
              <a
                href="/blog/rss.xml"
                className="text-[color:var(--accent)] hover:underline"
              >
                RSS feed →
              </a>
              <span className="text-[color:var(--text-muted)]">·</span>
              <span className="text-[color:var(--text-muted)]">
                {posts.length} post{posts.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        {posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[color:var(--text-muted)]">
              No posts yet — first one is on the way.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-12 gap-10">
            {/* ——— Post list ——— */}
            <div className="md:col-span-9">
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group block border border-[color:var(--border)] rounded-lg p-5 md:p-6 hover:border-[color:var(--accent)] hover:shadow-md transition-all mb-8 bg-white"
                >
                  <div className="text-xs text-[color:var(--text-muted)] mb-2">
                    Featured · {formatDate(featured.date)} · {featured.readingMinutes} min read
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[color:var(--text)] group-hover:text-[color:var(--accent)] transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-2 text-[color:var(--text-soft)] leading-relaxed">
                    {featured.description}
                  </p>
                  {featured.tags && featured.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {featured.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-hover)] text-[0.7rem] font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              )}

              {rest.length > 0 && (
                <ul className="divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
                  {rest.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group block py-5 px-2 -mx-2 rounded-md hover:bg-[color:var(--bg-subtle)] transition-colors"
                      >
                        <div className="flex items-baseline justify-between gap-4 flex-wrap">
                          <h3 className="text-lg font-semibold text-[color:var(--text)] group-hover:text-[color:var(--accent)] transition-colors">
                            {post.title}
                          </h3>
                          <span className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">
                            {formatDate(post.date)} · {post.readingMinutes} min
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[color:var(--text-muted)] line-clamp-2">
                          {post.description}
                        </p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {post.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[0.7rem] text-[color:var(--text-muted)]"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ——— Sidebar: tags + about ——— */}
            <aside className="md:col-span-3 space-y-6">
              {tags.length > 0 && (
                <div className="border border-[color:var(--border)] rounded-lg p-4 bg-white">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
                    Topics
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(({ tag, count }) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[color:var(--bg-subtle)] text-[color:var(--text-soft)] text-xs"
                        title={`${count} post${count === 1 ? '' : 's'}`}
                      >
                        #{tag}
                        <span className="text-[color:var(--text-muted)]">{count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="border border-[color:var(--border)] rounded-lg p-4 bg-white">
                <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-2">
                  About the blog
                </div>
                <p className="text-sm text-[color:var(--text-soft)] leading-relaxed">
                  Practical writing on the tools a working developer uses every day. No fluff, code examples that actually work, one canonical post per topic.
                </p>
                <div className="mt-3 text-xs">
                  <Link href="/" className="text-[color:var(--accent)] hover:underline">
                    Back to tools →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
