import Link from 'next/link';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Developer Tools Blog',
  description:
    'Practical notes on the developer tools you use every day: JSON, JWT, Base64, timestamps, regex, UUID. Short, opinionated, example-driven.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: 'Developer Tools Blog | ConverterHub',
    description:
      'Practical notes on the developer tools you use every day. Short, opinionated, example-driven.',
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
    <>
      <section className="border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
        <div className="container py-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--text)] leading-tight">
              Developer Tools Blog
            </h1>
            <p className="mt-3 text-base md:text-lg text-[color:var(--text-soft)] leading-relaxed">
              Practical notes on the tools you actually use: JSON, JWT, Base64, timestamps, regex, UUIDs. Short, example-driven, updated regularly.
            </p>
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
          <ul className="divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-12 gap-4 py-5 hover:bg-[color:var(--bg-subtle)] px-2 -mx-2 rounded-md transition-colors"
                >
                  <div className="col-span-12 md:col-span-8">
                    <h2 className="text-lg font-semibold text-[color:var(--text)] group-hover:text-[color:var(--accent)] transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-1 text-sm text-[color:var(--text-muted)] line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                  <div className="col-span-6 md:col-span-2 text-xs text-[color:var(--text-muted)] md:text-right self-center">
                    {formatDate(post.date)}
                  </div>
                  <div className="col-span-6 md:col-span-2 text-xs text-[color:var(--text-muted)] text-right self-center">
                    {post.readingMinutes} min read
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
