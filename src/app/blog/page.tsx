import Link from 'next/link';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Developer Blog | Copy-Paste Converter Hub',
  description:
    'Tutorials, deep dives, and practical guides for developers — JSON, JWT, Base64, timestamps, regex, and more. Written by working engineers.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: 'Developer Blog | Copy-Paste Converter Hub',
    description:
      'Tutorials, deep dives, and practical guides for developers — JSON, JWT, Base64, timestamps, regex, and more.',
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

  return (
    <main className="container px-4 py-12 max-w-4xl mx-auto">
      <header className="mb-12 border-b border-[var(--border-color)] pb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] mb-4">
          Developer Blog
        </h1>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          Hands-on tutorials and deep dives on the tools developers actually use every day.
          Short, practical, and light on fluff.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--text-secondary)]">No posts yet — check back soon.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="group border border-[var(--border-color)] rounded-2xl p-6 md:p-8 bg-[var(--bg-card)] hover:border-indigo-500 transition-colors"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>·</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {post.description}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
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
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
