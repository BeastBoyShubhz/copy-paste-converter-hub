import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
} from '@/lib/blog';

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
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.tags,
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

  const related = getRelatedPosts(post, 3);

  const postingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags?.join(', '),
    articleSection: post.tags?.[0],
    author: {
      '@type': 'Person',
      name: post.author ?? 'Shubham Singla',
      url: 'https://shubhamsingla.tech',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://converterhub.dev/blog/${post.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ConverterHub',
      url: 'https://converterhub.dev',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://converterhub.dev' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://converterhub.dev/blog' },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://converterhub.dev/blog/${post.slug}`,
      },
    ],
  };

  const faqJsonLd =
    post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* ——— Header ——— */}
      <section className="border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
        <div className="container py-8 md:py-10">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-[color:var(--text-muted)] mb-3"
          >
            <ol className="flex items-center gap-2 flex-wrap">
              <li><Link href="/" className="hover:text-[color:var(--accent)]">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/blog" className="hover:text-[color:var(--accent)]">Blog</Link></li>
              <li aria-hidden>/</li>
              <li className="text-[color:var(--text-soft)]" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold text-[color:var(--text)] leading-tight max-w-3xl">
            {post.title}
          </h1>
          <p className="mt-3 text-base md:text-lg text-[color:var(--text-soft)] leading-relaxed max-w-3xl">
            {post.description}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-[color:var(--text-muted)] flex-wrap">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingMinutes} min read</span>
            {post.author && (
              <>
                <span>·</span>
                <span>By {post.author}</span>
              </>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap ml-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-hover)] text-[0.7rem] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ——— Body with TOC ——— */}
      <section className="container py-8 md:py-12">
        <div className="grid md:grid-cols-12 gap-10">
          <aside className="md:col-span-3 order-2 md:order-1">
            {post.toc.length > 0 && (
              <nav
                aria-label="Table of contents"
                className="sticky top-20 border border-[color:var(--border)] rounded-lg p-4 bg-white"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
                  On this page
                </div>
                <ol className="space-y-2 text-sm">
                  {post.toc.map((item) => (
                    <li
                      key={item.id}
                      className={item.level === 3 ? 'pl-3' : ''}
                    >
                      <a
                        href={`#${item.id}`}
                        className="text-[color:var(--text-soft)] hover:text-[color:var(--accent)] transition-colors"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>
          <div className="md:col-span-9 order-1 md:order-2">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
        </div>
      </section>

      {/* ——— Related posts ——— */}
      {related.length > 0 && (
        <section className="border-t border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
          <div className="container py-10 md:py-14">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-[color:var(--text)]">
                Related posts
              </h2>
              <Link
                href="/blog"
                className="text-sm text-[color:var(--accent)] hover:underline"
              >
                All posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="tool-card group"
                >
                  <div className="text-xs text-[color:var(--text-muted)] mb-2">
                    {formatDate(p.date)} · {p.readingMinutes} min read
                  </div>
                  <div className="tool-card__title group-hover:text-[color:var(--accent)] transition-colors">
                    {p.title}
                  </div>
                  <div className="tool-card__desc">{p.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
