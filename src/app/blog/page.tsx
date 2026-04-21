import Link from 'next/link';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Dispatches | Copy-Paste Converter Hub',
  description:
    'Field notes on the tools developers actually use. JSON, JWT, Base64, timestamps, regex — practical, opinionated, short.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: 'Dispatches | Copy-Paste Converter Hub',
    description:
      'Field notes on the tools developers actually use. Practical, opinionated, short.',
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
  const [featured, ...rest] = posts;

  return (
    <>
      {/* Masthead */}
      <section className="container pt-14 md:pt-20 pb-12">
        <div className="grid md:grid-cols-12 gap-10 items-end rise rise-1">
          <div className="md:col-span-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="meta-label meta-label--accent">Dispatches</span>
              <span className="h-px w-10 bg-accent" />
              <span className="meta-label">
                {posts.length === 0
                  ? 'No issues yet'
                  : `${posts.length} issue${posts.length === 1 ? '' : 's'} and counting`}
              </span>
            </div>
            <h1 className="font-display text-[12vw] md:text-[7.5rem] leading-[0.9] tracking-tight-display text-ink">
              Dispatches<span className="text-accent">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft leading-relaxed">
              Field notes on the tools developers actually use every day.
              Short, practical, light on hedging, heavy on examples you can
              paste into a terminal.
            </p>
          </div>
        </div>
        <div className="rule-double mt-12" />
      </section>

      {posts.length === 0 ? (
        <section className="container py-20 text-center">
          <p className="meta-label mb-2">No issues yet</p>
          <p className="font-display text-3xl text-ink">
            The press is warming up.
          </p>
        </section>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <section className="container pb-14">
              <div className="grid md:grid-cols-12 gap-10">
                <div className="md:col-span-3">
                  <div className="meta-label mb-2">Featured</div>
                  <div className="font-mono text-xs text-ink-muted">
                    {formatDate(featured.date)}
                  </div>
                  <div className="font-mono text-xs text-ink-muted mt-1">
                    {featured.readingMinutes} min read
                  </div>
                </div>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="md:col-span-9 group block"
                >
                  <h2 className="font-display text-4xl md:text-6xl font-medium leading-[0.98] tracking-tight-display text-ink group-hover:text-accent transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-5 text-lg text-ink-soft max-w-2xl leading-relaxed">
                    {featured.description}
                  </p>
                  <span className="inline-block mt-6 font-mono uppercase tracking-caps text-[0.72rem] text-ink link-grow">
                    Read the dispatch →
                  </span>
                </Link>
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="container pb-20">
              <div className="rule mb-10" />
              <div className="meta-label mb-6">More from the field</div>
              <ol className="divide-y divide-[color:var(--rule-soft)] border-y border-[color:var(--rule-soft)]">
                {rest.map((post, i) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group grid grid-cols-12 gap-4 md:gap-6 items-baseline py-6 hover:bg-[color:var(--paper-deep)] px-1"
                    >
                      <span className="col-span-2 md:col-span-1 ordinal">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="col-span-10 md:col-span-7">
                        <h3 className="font-display text-2xl text-ink font-medium tracking-tight-display group-hover:text-accent transition-colors">
                          {post.title}
                        </h3>
                        <p className="mt-1 text-sm text-ink-soft line-clamp-2">
                          {post.description}
                        </p>
                      </div>
                      <span className="col-span-6 md:col-span-2 meta-label">
                        {formatDate(post.date)}
                      </span>
                      <span className="col-span-6 md:col-span-2 justify-self-end font-mono uppercase tracking-caps text-[0.68rem] text-ink-muted group-hover:text-accent transition-colors">
                        {post.readingMinutes} min →
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}
    </>
  );
}
