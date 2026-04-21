import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';

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

  return (
    <main className="container px-4 py-12 max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-8 text-sm">
        <Link
          href="/blog"
          className="text-[var(--text-secondary)] hover:text-indigo-500 transition-colors"
        >
          ← Back to Blog
        </Link>
      </nav>
      <article>
        <header className="mb-10 border-b border-[var(--border-color)] pb-8">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[var(--text-muted)] mb-4">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingMinutes} min read</span>
            {post.author && (
              <>
                <span>·</span>
                <span>by {post.author}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            {post.description}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded border border-[var(--border-color)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <div
          className="prose prose-lg dark:prose-invert max-w-none blog-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
      <footer className="mt-16 pt-8 border-t border-[var(--border-color)] text-sm text-[var(--text-secondary)]">
        <p>
          Liked this? Try our{' '}
          <Link href="/" className="text-indigo-500 hover:underline">
            free developer tools
          </Link>{' '}
          — no sign-up, runs 100% in your browser.
        </p>
      </footer>
    </main>
  );
}
