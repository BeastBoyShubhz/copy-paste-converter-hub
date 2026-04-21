import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllSlugs, getAllPosts, getPostBySlug } from '@/lib/blog';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Copy-Paste Converter Hub`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `https://converterhub.dev/blog/${post.slug}`,
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author ?? 'Shubham Singla',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://converterhub.dev/blog/${post.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Copy-Paste Converter Hub',
      url: 'https://converterhub.dev',
    },
  };

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="container pt-12 md:pt-16 pb-10">
        <nav className="mb-10 meta-label">
          <Link href="/blog" className="link-grow">
            ← Back to Dispatches
          </Link>
        </nav>
        <div className="max-w-4xl rise rise-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="meta-label meta-label--accent">Dispatch</span>
            <span className="h-px w-10 bg-accent" />
            <time dateTime={post.date} className="meta-label">
              {formatDate(post.date)}
            </time>
            <span className="meta-label">·</span>
            <span className="meta-label">{post.readingMinutes} min read</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight-display text-ink font-normal">
            {post.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-ink-soft leading-relaxed">
            {post.description}
          </p>
          <div className="mt-8 flex items-center gap-6 flex-wrap">
            {post.author && (
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center font-display text-sm">
                  {post.author
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <div>
                  <div className="meta-label meta-label--ink">
                    {post.author}
                  </div>
                  <div className="font-mono text-[0.7rem] text-ink-muted">
                    Author
                  </div>
                </div>
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[0.7rem] uppercase tracking-caps text-ink-muted border border-[color:var(--rule-soft)] px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="rule mt-12" />
      </header>

      {/* Body */}
      <section className="container pb-16">
        <div className="grid md:grid-cols-12 gap-10">
          <aside className="md:col-span-3 order-2 md:order-1">
            <div className="sticky top-32">
              <div className="meta-label mb-2">In this issue</div>
              <p className="font-display italic text-ink leading-snug">
                {post.description}
              </p>
              <div className="rule-soft my-5" />
              <div className="space-y-2 text-sm text-ink-soft">
                <div className="flex justify-between">
                  <span className="meta-label">Published</span>
                  <span className="font-mono text-[0.7rem] text-ink">
                    {formatDate(post.date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="meta-label">Read time</span>
                  <span className="font-mono text-[0.7rem] text-ink">
                    {post.readingMinutes} min
                  </span>
                </div>
              </div>
            </div>
          </aside>
          <div
            className="md:col-span-9 order-1 md:order-2 blog-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-[color:var(--paper-deep)] border-y border-ink">
          <div className="container py-14">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <div className="meta-label mb-1">§ Continue reading</div>
                <h3 className="font-display text-3xl text-ink">
                  More dispatches
                </h3>
              </div>
              <Link
                href="/blog"
                className="font-mono uppercase tracking-caps text-[0.72rem] text-ink link-grow"
              >
                All →
              </Link>
            </div>
            <ol className="divide-y divide-[color:var(--rule-soft)] border-y border-[color:var(--rule-soft)]">
              {related.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group grid grid-cols-12 gap-4 items-baseline py-5 hover:bg-paper px-1"
                  >
                    <span className="col-span-2 md:col-span-1 ordinal">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="col-span-10 md:col-span-9 font-display text-xl text-ink group-hover:text-accent transition-colors">
                      {p.title}
                    </span>
                    <span className="col-span-12 md:col-span-2 meta-label text-right">
                      {p.readingMinutes} min
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </article>
  );
}
