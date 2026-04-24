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
    title: post.title,
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

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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
          <div className="mt-4 flex items-center gap-4 text-xs text-[color:var(--text-muted)] flex-wrap">
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
              <>
                <span>·</span>
                <span>{post.tags.join(', ')}</span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div
          className="blog-content max-w-3xl"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </section>

      {related.length > 0 && (
        <section className="border-t border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
          <div className="container py-10 md:py-14">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-[color:var(--text)]">
                More from the blog
              </h2>
              <Link
                href="/blog"
                className="text-sm text-[color:var(--accent)] hover:underline"
              >
                All posts →
              </Link>
            </div>
            <ul className="divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group grid grid-cols-12 gap-4 py-4 hover:bg-white px-2 -mx-2 rounded-md transition-colors"
                  >
                    <span className="col-span-12 md:col-span-9 font-medium text-[color:var(--text)] group-hover:text-[color:var(--accent)] transition-colors">
                      {p.title}
                    </span>
                    <span className="col-span-6 md:col-span-2 text-xs text-[color:var(--text-muted)] self-center md:text-right">
                      {formatDate(p.date)}
                    </span>
                    <span className="col-span-6 md:col-span-1 text-xs text-[color:var(--text-muted)] text-right self-center">
                      {p.readingMinutes} min
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
