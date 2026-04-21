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

  const filteredTools = useMemo(
    () =>
      tools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(query.toLowerCase()) ||
          tool.keywords.some((k) =>
            k.toLowerCase().includes(query.toLowerCase()),
          ) ||
          tool.category.includes(query.toLowerCase()),
      ),
    [query],
  );

  const allTools = useMemo(
    () => [...tools].sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );

  return (
    <>
      {/* ————————————————— HERO ————————————————— */}
      <section className="relative">
        <div className="container pt-14 md:pt-20 pb-10 md:pb-16">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8 rise rise-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="meta-label meta-label--accent">Issue 04</span>
                <span className="h-px w-10 bg-accent" />
                <span className="meta-label">The Paste Board</span>
              </div>
              <h1 className="font-display text-[14vw] md:text-[9rem] leading-[0.9] tracking-tight-display text-ink font-normal">
                The{' '}
                <span className="font-italic-serif text-accent">paste</span>
                <br />
                board.
              </h1>
              <p className="mt-8 max-w-xl text-lg md:text-xl text-ink-soft leading-relaxed dropcap">
                A field manual of tools for engineers who live in the liminal
                space between one system and another — where JSON is malformed,
                timestamps lie about their timezone, and tokens arrive
                base64-shaped. Clean, fast, browser-only. Nothing is sent.
                Nothing is logged.
              </p>
            </div>

            <aside className="md:col-span-4 rise rise-3">
              <div className="border border-ink bg-paper-card">
                <div className="flex items-center justify-between px-4 py-2 border-b border-ink">
                  <span className="meta-label meta-label--ink">
                    Masthead
                  </span>
                  <span className="meta-label">01</span>
                </div>
                <dl className="px-4 py-4 text-sm leading-relaxed space-y-3">
                  <div className="flex justify-between gap-4">
                    <dt className="meta-label">Tools</dt>
                    <dd className="font-mono text-ink">{tools.length}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="meta-label">Ads</dt>
                    <dd className="font-mono text-ink">0</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="meta-label">Server calls</dt>
                    <dd className="font-mono text-ink">0</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="meta-label">Sign-ups</dt>
                    <dd className="font-mono text-ink">none</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="meta-label">Price</dt>
                    <dd className="font-mono text-ink">free</dd>
                  </div>
                </dl>
                <div className="px-4 py-3 bg-ink text-paper text-[0.7rem] font-mono uppercase tracking-caps">
                  Client-side only · zero logs
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="container">
          <div className="rule-double" />
        </div>
      </section>

      {/* ————————————————— SEARCH + INDEX ————————————————— */}
      <section className="relative">
        <div className="container pt-10 md:pt-14 pb-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 rise rise-1">
            <div>
              <div className="meta-label mb-2">Section 02 · Index</div>
              <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight-display text-ink">
                The <span className="font-italic-serif">complete</span> catalogue
              </h2>
              <p className="mt-3 text-ink-soft max-w-md">
                Every tool in the house, alphabetised. Type to filter.
              </p>
            </div>
            <div className="w-full md:w-80">
              <label
                htmlFor="tool-search"
                className="meta-label block mb-2"
              >
                Search (⌘ K)
              </label>
              <div className="relative border-b-2 border-ink">
                <input
                  ref={searchInputRef}
                  id="tool-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. jwt, base64, uuid…"
                  className="w-full py-2 pr-8 bg-transparent outline-none font-mono text-sm text-ink placeholder:text-ink-muted"
                />
                <span
                  aria-hidden
                  className="absolute right-0 bottom-2 text-ink-muted font-mono text-xs"
                >
                  /{filteredTools.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container pb-20">
          <div className="rule mb-0" />
          <ol className="divide-y divide-[color:var(--rule-soft)]">
            {(query ? filteredTools : allTools).map((tool, i) => (
              <IndexRow key={tool.slug} tool={tool} index={i} />
            ))}
          </ol>
          <div className="rule mt-0" />
        </div>
      </section>

      {/* ————————————————— CRAFT NOTES ————————————————— */}
      <section className="bg-[color:var(--paper-deep)] border-y border-ink">
        <div className="container py-16 md:py-20">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <div className="meta-label mb-3">Section 03 · Colophon</div>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight-display text-ink">
                Notes on craft
              </h2>
            </div>
            <div className="md:col-span-8 grid sm:grid-cols-2 gap-8">
              {[
                {
                  kicker: '§ 01',
                  title: 'Client-side only',
                  body: 'Every conversion runs in your browser. Your keys, tokens, and payloads never leave the machine.',
                },
                {
                  kicker: '§ 02',
                  title: 'No interruption',
                  body: 'No sign-ups, no newsletters, no cookie banners. Open the page, use the tool, close the tab.',
                },
                {
                  kicker: '§ 03',
                  title: 'Offline-capable',
                  body: 'The bundle is small enough to cache. Once loaded, most tools work on a plane.',
                },
                {
                  kicker: '§ 04',
                  title: 'Standards first',
                  body: 'RFC-compliant where a spec exists. When a spec is ambiguous, we follow the spec and say so.',
                },
              ].map((item) => (
                <article key={item.title}>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-display italic text-accent text-lg">
                      {item.kicker}
                    </span>
                    <h3 className="font-display text-xl font-medium text-ink">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-ink-soft leading-relaxed">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ————————————————— LONG-FORM SEO ————————————————— */}
      <section>
        <div className="container py-16 md:py-20">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <div className="meta-label mb-3">Section 04 · Appendix</div>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight-display text-ink">
                The <span className="font-italic-serif">reference</span>
              </h2>
              <p className="mt-3 text-ink-soft">
                Plain-spoken notes on what each tool does, when it helps, and
                the mistakes people make around it.
              </p>
            </div>
            <div className="md:col-span-8 space-y-14">
              {allTools.map((tool) => (
                <article
                  key={tool.slug}
                  className="border-b border-[color:var(--rule-soft)] pb-10"
                >
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="meta-label">
                      {categoryLabels[tool.category] ?? tool.category}
                    </span>
                    <span className="h-px flex-1 bg-[color:var(--rule-soft)]" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-medium text-ink mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-ink-soft leading-relaxed mb-4 max-w-3xl">
                    {tool.description}
                  </p>
                  {tool.faqs.length > 0 && (
                    <div className="border-l-2 border-accent pl-4 max-w-3xl">
                      <div className="font-mono uppercase text-[0.7rem] tracking-caps text-accent mb-1">
                        Q.
                      </div>
                      <p className="font-display italic text-ink text-lg mb-2">
                        {tool.faqs[0].question}
                      </p>
                      <p className="text-ink-soft leading-relaxed">
                        {tool.faqs[0].answer}
                      </p>
                    </div>
                  )}
                  <div className="mt-5">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="font-mono uppercase tracking-caps text-[0.72rem] text-ink link-grow"
                    >
                      Open tool →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function IndexRow({ tool, index }: { tool: ToolMetadata; index: number }) {
  return (
    <li>
      <Link
        href={`/tools/${tool.slug}`}
        className="group grid grid-cols-12 gap-4 md:gap-6 items-baseline py-5 md:py-6 px-1 transition-colors hover:bg-[color:var(--paper-deep)]"
      >
        <span className="col-span-2 md:col-span-1 ordinal">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="col-span-10 md:col-span-6">
          <h3 className="font-display text-xl md:text-2xl font-medium text-ink tracking-tight-display group-hover:text-accent transition-colors">
            {tool.title}
          </h3>
          <p className="mt-1 text-sm text-ink-soft line-clamp-1">
            {tool.description}
          </p>
        </div>
        <span className="col-span-6 md:col-span-3 meta-label">
          {categoryLabels[tool.category] ?? tool.category}
        </span>
        <span
          className="col-span-6 md:col-span-2 justify-self-end font-mono uppercase tracking-caps text-[0.68rem] text-ink-muted group-hover:text-accent transition-colors"
          aria-hidden
        >
          Read →
        </span>
      </Link>
    </li>
  );
}
