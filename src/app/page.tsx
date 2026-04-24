'use client';

import { tools, ToolMetadata } from '@/lib/tools/registry';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';

const categoryLabels: Record<string, string> = {
  converters: 'Converters',
  formatters: 'Formatters',
  encoders: 'Encoders',
  text: 'Text',
  'dev-utils': 'Dev Utilities',
};

const categoryOrder = [
  'converters',
  'formatters',
  'encoders',
  'dev-utils',
  'text',
];

export default function Home() {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q)) ||
        tool.category.toLowerCase().includes(q),
    );
  }, [query]);

  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, ToolMetadata[]> = {};
    for (const tool of filteredTools) {
      if (!grouped[tool.category]) grouped[tool.category] = [];
      grouped[tool.category].push(tool);
    }
    return grouped;
  }, [filteredTools]);

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
          text: 'Yes. Every tool on ConverterHub is free to use with no sign-up, no paywall, and no usage limits. The site is supported only by its static hosting.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my data sent to a server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. All conversions — JSON formatting, JWT decoding, Base64, timestamps, UUID, etc. — run entirely in your browser using JavaScript. Nothing you paste is transmitted to our servers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do these tools work offline?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Once a tool page has loaded, it typically continues to work without a network connection because all processing happens in the browser.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which tool should I use to decode a JWT?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use the JWT Decoder. It splits the token into header, payload, and signature, decodes the Base64URL, and shows expiry in a human-readable format. It never asks for your secret.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use these tools in commercial projects?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Use the results in any project, commercial or otherwise. The tools themselves are free to access on this site.',
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

      {/* ——— Hero + Search ——— */}
      <section className="border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
        <div className="container py-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-[color:var(--text)] leading-tight tracking-tight">
              Free Online Developer Tools
            </h1>
            <p className="mt-4 text-base md:text-lg text-[color:var(--text-soft)] leading-relaxed max-w-2xl">
              Fast, no-nonsense tools for JSON, JWT, Base64, timestamps, UUIDs, URLs and more. Everything runs in your browser — no sign-up, no tracking, no server calls.
            </p>
            <div className="mt-6">
              <label htmlFor="tool-search" className="sr-only">
                Search tools
              </label>
              <div className="relative max-w-xl">
                <input
                  ref={searchInputRef}
                  id="tool-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tools — e.g. json, jwt, base64, uuid…"
                  className="input-glass w-full py-3 pl-4 pr-14 rounded-lg text-[0.95rem]"
                  aria-label="Search tools"
                />
                <kbd className="kbd absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex">
                  ⌘K
                </kbd>
              </div>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">
                {filteredTools.length} of {tools.length} tool{tools.length === 1 ? '' : 's'}
                {query && ` matching "${query}"`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Tool grid ——— */}
      <section className="container py-10 md:py-14">
        {filteredTools.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[color:var(--text-muted)]">
              No tools match &ldquo;{query}&rdquo;. Try &ldquo;json&rdquo;, &ldquo;jwt&rdquo;, or &ldquo;base64&rdquo;.
            </p>
          </div>
        ) : (
          categoryOrder
            .filter((cat) => toolsByCategory[cat]?.length)
            .map((cat) => (
              <div key={cat} className="mb-10 last:mb-0">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-[color:var(--text)]">
                    {categoryLabels[cat] ?? cat}
                  </h2>
                  <span className="text-xs text-[color:var(--text-muted)]">
                    {toolsByCategory[cat].length} tool{toolsByCategory[cat].length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {toolsByCategory[cat].map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            ))
        )}
      </section>

      {/* ——— SEO content: why use + categorized explanations ——— */}
      <section className="border-t border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--text)] mb-4">
              Why use ConverterHub?
            </h2>
            <div className="prose">
              <p>
                ConverterHub is a collection of small, focused developer utilities that do one job well. Unlike many online converters, there are no ads, no trackers on the content you paste, no sign-up walls, and no server round-trips. Paste, convert, copy, close the tab.
              </p>
              <ul>
                <li><strong>100% client-side.</strong> Every conversion runs in your browser. Your JWTs, API responses, and tokens never leave your machine.</li>
                <li><strong>Free, forever.</strong> No pricing page, no &ldquo;pro&rdquo; tier, no rate limits.</li>
                <li><strong>Fast.</strong> Static pages, minimal JavaScript, no network hops. Usable on a weak connection.</li>
                <li><strong>Standards-compliant.</strong> We follow RFC 3339 for timestamps, RFC 7519 for JWTs, RFC 4648 for Base64, and WHATWG for URL encoding.</li>
                <li><strong>Keyboard-friendly.</strong> Press <kbd className="kbd">⌘K</kbd> anywhere on the homepage to jump to search.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Category explanations (keyword-rich) ——— */}
      <section className="container py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[color:var(--text)] mb-3">
              JSON tools
            </h2>
            <p className="text-[color:var(--text-soft)] leading-relaxed">
              Validate, format, and transform JSON without pasting it into a sketchy online editor. Our <Link href="/tools/json-formatter" className="text-[color:var(--accent)] hover:underline">JSON formatter and validator</Link> highlights syntax errors with line numbers, and the <Link href="/tools/json-to-csv" className="text-[color:var(--accent)] hover:underline">JSON to CSV converter</Link> turns nested arrays into spreadsheet-ready output.
            </p>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[color:var(--text)] mb-3">
              Encoding &amp; decoding
            </h2>
            <p className="text-[color:var(--text-soft)] leading-relaxed">
              Convert between raw text and wire formats: <Link href="/tools/base64-encode-decode" className="text-[color:var(--accent)] hover:underline">Base64 encoder/decoder</Link> with UTF-8 handling, <Link href="/tools/url-encode-decode" className="text-[color:var(--accent)] hover:underline">URL percent-encoding</Link>, and <Link href="/tools/html-escape-unescape" className="text-[color:var(--accent)] hover:underline">HTML entity escape/unescape</Link> for safely embedding data.
            </p>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[color:var(--text)] mb-3">
              Timestamps &amp; IDs
            </h2>
            <p className="text-[color:var(--text-soft)] leading-relaxed">
              The <Link href="/tools/timestamp-converter" className="text-[color:var(--accent)] hover:underline">Unix timestamp converter</Link> auto-detects seconds vs milliseconds and shows local and UTC output. The <Link href="/tools/uuid-generator" className="text-[color:var(--accent)] hover:underline">UUID generator</Link> emits RFC 4122 v4 UUIDs using the browser&rsquo;s crypto API.
            </p>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[color:var(--text)] mb-3">
              Debug &amp; inspect
            </h2>
            <p className="text-[color:var(--text-soft)] leading-relaxed">
              The <Link href="/tools/jwt-decoder" className="text-[color:var(--accent)] hover:underline">JWT decoder</Link> splits a token into header and payload, shows the algorithm, and flags expiry. Secrets never leave your browser because we never ask for them. The <Link href="/tools/word-counter" className="text-[color:var(--accent)] hover:underline">word counter</Link> counts words, characters, and reading time.
            </p>
          </div>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="border-t border-[color:var(--border)]">
        <div className="container py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--text)] mb-6">
            Frequently asked questions
          </h2>
          <div className="max-w-3xl divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
            {faqJsonLd.mainEntity.map((faq, i) => (
              <details key={i} className="group py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-[color:var(--text)]">
                  <span>{faq.name}</span>
                  <span className="text-[color:var(--text-muted)] group-open:rotate-45 transition-transform text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-[color:var(--text-soft)] leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ToolCard({ tool }: { tool: ToolMetadata }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="tool-card group">
      <div className="tool-card__title group-hover:text-[color:var(--accent)] transition-colors">
        {tool.title}
      </div>
      <div className="tool-card__desc">{tool.description}</div>
      <div className="tool-card__cat">
        {categoryLabels[tool.category] ?? tool.category}
      </div>
    </Link>
  );
}
