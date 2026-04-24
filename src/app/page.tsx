import Link from 'next/link';
import { tools, ToolMetadata } from '@/lib/tools/registry';
import { getAllPosts } from '@/lib/blog';
import { HeroTool } from '@/components/home/HeroTool';

const categoryLabels: Record<string, string> = {
  converters: 'Converters',
  formatters: 'Formatters',
  encoders: 'Encoders',
  text: 'Text',
  'dev-utils': 'Dev Utilities',
};

const categoryOrder = [
  'formatters',
  'encoders',
  'converters',
  'dev-utils',
  'text',
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  const toolsByCategory: Record<string, ToolMetadata[]> = {};
  for (const tool of tools) {
    if (!toolsByCategory[tool.category]) toolsByCategory[tool.category] = [];
    toolsByCategory[tool.category].push(tool);
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://converterhub.dev/tools/${tool.slug}`,
      name: tool.title,
    })),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are these developer tools really free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every tool on ConverterHub is free with no sign-up, no paywall, and no usage limits.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my data sent to a server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. All conversions run entirely in your browser. Nothing you paste is transmitted to our servers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do the tools work offline?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Once a tool page has loaded it typically keeps working without a network connection, because all processing happens in the browser.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which tool should I use to decode a JWT?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use the JWT Decoder. It splits the token into header, payload and signature and shows expiry in a human-readable format. It never asks for your secret.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ——— Hero: tool first, headline above it ——— */}
      <section className="border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
        <div className="container py-6 md:py-8">
          <div className="max-w-3xl mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--text)] leading-tight tracking-tight">
              Free Online Developer Tools — in Your Browser
            </h1>
            <p className="mt-2 text-sm md:text-base text-[color:var(--text-soft)] leading-relaxed">
              Format JSON, decode JWTs, encode Base64, convert Unix timestamps — paste and convert right here. No sign-up, no tracking, no server calls.
            </p>
          </div>
          <HeroTool />
        </div>
      </section>

      {/* ——— All tools ——— */}
      <section className="container py-10 md:py-14" id="tools">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[color:var(--text)]">
            All tools
          </h2>
          <span className="text-sm text-[color:var(--text-muted)]">
            {tools.length} tools · 100% free
          </span>
        </div>

        {categoryOrder
          .filter((cat) => toolsByCategory[cat]?.length)
          .map((cat) => (
            <div key={cat} className="mb-8 last:mb-0">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
                {categoryLabels[cat] ?? cat}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {toolsByCategory[cat].map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="tool-card group"
                  >
                    <div className="tool-card__title group-hover:text-[color:var(--accent)] transition-colors">
                      {tool.title}
                    </div>
                    <div className="tool-card__desc">{tool.description}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </section>

      {/* ——— Blog section ——— */}
      {posts.length > 0 && (
        <section className="border-t border-[color:var(--border)] bg-[color:var(--bg-subtle)]" id="blog">
          <div className="container py-10 md:py-14">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[color:var(--text)]">
                  From the blog
                </h2>
                <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                  Practical notes on the tools developers actually use.
                </p>
              </div>
              <Link
                href="/blog"
                className="text-sm text-[color:var(--accent)] hover:underline whitespace-nowrap"
              >
                All posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="tool-card group"
                >
                  <div className="text-xs text-[color:var(--text-muted)] mb-2">
                    {formatDate(post.date)} · {post.readingMinutes} min read
                  </div>
                  <div className="tool-card__title group-hover:text-[color:var(--accent)] transition-colors">
                    {post.title}
                  </div>
                  <div className="tool-card__desc">{post.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— FAQ ——— */}
      <section className="container py-10 md:py-14">
        <h2 className="text-xl md:text-2xl font-bold text-[color:var(--text)] mb-6">
          Frequently asked questions
        </h2>
        <div className="max-w-3xl divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
          {faqJsonLd.mainEntity.map((faq, i) => (
            <details key={i} className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-[color:var(--text)]">
                <span>{faq.name}</span>
                <span className="text-[color:var(--text-muted)] group-open:rotate-45 transition-transform text-xl leading-none ml-4">
                  +
                </span>
              </summary>
              <p className="mt-2 text-[color:var(--text-soft)] leading-relaxed">
                {faq.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
