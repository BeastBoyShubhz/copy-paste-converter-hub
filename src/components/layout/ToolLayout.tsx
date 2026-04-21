'use client';

import { ToolMetadata, tools } from '@/lib/tools/registry';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ToolLayoutProps {
  tool: ToolMetadata;
  children: React.ReactNode;
  className?: string;
}

const categoryLabels: Record<string, string> = {
  converters: 'Converters',
  formatters: 'Formatters',
  encoders: 'Encoders',
  text: 'Text',
  'dev-utils': 'Dev Utilities',
};

export function ToolLayout({ tool, children, className }: ToolLayoutProps) {
  const { copy, isCopied } = useCopyToClipboard();
  useAnalytics(tool.slug);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      copy(window.location.href);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'c') {
        e.preventDefault();
        handleShare();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [copy]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
  };

  const related = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 5);

  return (
    <article className={cn('tool-page', className)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ——— Header ——— */}
      <header className="container pt-10 md:pt-14 pb-10">
        <nav className="flex items-center gap-3 mb-8 meta-label">
          <Link href="/" className="link-grow">
            Tools
          </Link>
          <span>·</span>
          <span className="meta-label--ink">
            {categoryLabels[tool.category] ?? tool.category}
          </span>
        </nav>

        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8 rise rise-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="meta-label meta-label--accent">Tool</span>
              <span className="h-px w-10 bg-accent" />
              <span className="meta-label">No. {tool.slug}</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight-display text-ink font-normal">
              {tool.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-ink-soft leading-relaxed">
              {tool.description}
            </p>
          </div>

          <div className="md:col-span-4 rise rise-2 md:justify-self-end">
            <button
              onClick={handleShare}
              className="btn-secondary"
              aria-label="Copy page URL"
            >
              {isCopied ? 'Copied ✓' : 'Share URL'}
            </button>
          </div>
        </div>
        <div className="rule mt-10" />
      </header>

      {/* ——— Workspace ——— */}
      <section className="container pb-14">
        <div className="flex items-center justify-between mb-4">
          <span className="meta-label">Workspace</span>
          <span className="meta-label">Runs in your browser</span>
        </div>
        <div className="tool-workspace-wrapper">{children}</div>
      </section>

      {/* ——— Capabilities ——— */}
      <section className="bg-[color:var(--paper-deep)] border-y border-ink">
        <div className="container py-14">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <div className="meta-label mb-2">§ Capabilities</div>
              <h2 className="font-display text-3xl font-medium text-ink">
                What you can expect
              </h2>
            </div>
            <dl className="md:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-6">
              {[
                {
                  k: 'Local processing',
                  v: 'Data never leaves the browser.',
                },
                {
                  k: 'Large inputs',
                  v: 'Optimised for 5MB+ of text.',
                },
                {
                  k: 'No tracking',
                  v: 'No logs, no analytics on the inputs.',
                },
                {
                  k: 'Standards-first',
                  v: 'Matches the relevant RFC where one exists.',
                },
              ].map((item) => (
                <div
                  key={item.k}
                  className="border-t border-[color:var(--rule-soft)] pt-3"
                >
                  <dt className="meta-label meta-label--ink">{item.k}</dt>
                  <dd className="mt-1 text-ink-soft">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ——— How it works ——— */}
      <section className="container py-16">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="meta-label mb-2">§ How it works</div>
            <h2 className="font-display text-3xl font-medium text-ink">
              Under the hood
            </h2>
          </div>
          <div
            className="md:col-span-8 prose"
            dangerouslySetInnerHTML={{ __html: tool.howItWorks }}
          />
        </div>
      </section>

      {/* ——— FAQ ——— */}
      {tool.faqs.length > 0 && (
        <section className="bg-[color:var(--paper-deep)] border-y border-ink">
          <div className="container py-16">
            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-4">
                <div className="meta-label mb-2">§ Questions</div>
                <h2 className="font-display text-3xl font-medium text-ink">
                  Frequently <span className="font-italic-serif">asked</span>
                </h2>
              </div>
              <div className="md:col-span-8 divide-y divide-[color:var(--ink)]/20 border-y border-ink">
                {tool.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group py-5 px-1 transition-colors open:bg-paper"
                  >
                    <summary className="flex items-start gap-4 cursor-pointer list-none">
                      <span className="ordinal mt-1">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 font-display text-xl text-ink leading-snug">
                        {faq.question}
                      </span>
                      <span className="mt-1 font-mono text-ink-muted group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <p className="pl-10 pr-4 mt-3 text-ink-soft leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ——— Related ——— */}
      {related.length > 0 && (
        <section className="container py-14">
          <div className="rule mb-8" />
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="meta-label mb-1">§ Continue reading</div>
              <h3 className="font-display text-2xl text-ink">Related tools</h3>
            </div>
            <Link
              href="/"
              className="font-mono uppercase tracking-caps text-[0.72rem] text-ink link-grow"
            >
              All tools →
            </Link>
          </div>
          <ol className="divide-y divide-[color:var(--rule-soft)] border-y border-[color:var(--rule-soft)]">
            {related.map((t, i) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="group grid grid-cols-12 gap-4 items-baseline py-4 hover:bg-[color:var(--paper-deep)] px-1"
                >
                  <span className="col-span-2 md:col-span-1 ordinal">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="col-span-8 md:col-span-9 font-display text-lg text-ink group-hover:text-accent transition-colors">
                    {t.title}
                  </span>
                  <span className="col-span-2 font-mono text-[0.7rem] uppercase tracking-caps text-ink-muted group-hover:text-accent text-right transition-colors">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  );
}
