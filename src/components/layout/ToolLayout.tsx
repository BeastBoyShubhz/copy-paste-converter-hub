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

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    description: tool.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    url: `https://converterhub.dev/tools/${tool.slug}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '120',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://converterhub.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryLabels[tool.category] ?? tool.category,
        item: 'https://converterhub.dev',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.title,
        item: `https://converterhub.dev/tools/${tool.slug}`,
      },
    ],
  };

  const faqJsonLd = tool.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      }
    : null;

  const related = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 6);

  return (
    <article className={cn('tool-page', className)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
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

      {/* ——— Compact header + tool above fold ——— */}
      <section className="border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
        <div className="container py-6 md:py-8">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-[color:var(--text-muted)] mb-3"
          >
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="hover:text-[color:var(--accent)]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/" className="hover:text-[color:var(--accent)]">
                  {categoryLabels[tool.category] ?? tool.category}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-[color:var(--text-soft)]" aria-current="page">
                {tool.title}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div className="max-w-3xl">
              <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--text)] leading-tight">
                {tool.title}
              </h1>
              <p className="mt-2 text-sm md:text-base text-[color:var(--text-soft)] leading-relaxed">
                {tool.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[color:var(--text-muted)] hidden md:inline">
                Runs in your browser
              </span>
              <button
                onClick={handleShare}
                className="btn-secondary"
                aria-label="Copy page URL"
              >
                {isCopied ? 'Copied ✓' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Workspace (above the fold) ——— */}
      <section className="container py-6 md:py-8">
        <div className="tool-workspace-wrapper">{children}</div>
      </section>

      {/* ——— How it works ——— */}
      <section className="container pb-10 md:pb-14">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <h2 className="text-lg md:text-xl font-semibold text-[color:var(--text)]">
              How it works
            </h2>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              A quick explanation of what this tool does, and when it&apos;s useful.
            </p>
          </div>
          <div
            className="md:col-span-8 prose"
            dangerouslySetInnerHTML={{ __html: tool.howItWorks }}
          />
        </div>
      </section>

      {/* ——— FAQ ——— */}
      {tool.faqs.length > 0 && (
        <section className="border-t border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
          <div className="container py-10 md:py-14">
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h2 className="text-lg md:text-xl font-semibold text-[color:var(--text)]">
                  Frequently asked questions
                </h2>
                <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                  Short answers to common questions about {tool.title.toLowerCase()}.
                </p>
              </div>
              <div className="md:col-span-8 divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
                {tool.faqs.map((faq, i) => (
                  <details key={i} className="group py-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-[color:var(--text)]">
                      <span>{faq.question}</span>
                      <span className="text-[color:var(--text-muted)] group-open:rotate-45 transition-transform text-xl leading-none ml-4">
                        +
                      </span>
                    </summary>
                    <p className="mt-2 text-[color:var(--text-soft)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ——— Related tools ——— */}
      {related.length > 0 && (
        <section className="container py-10 md:py-14">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-[color:var(--text)]">
              Related tools
            </h2>
            <Link
              href="/"
              className="text-sm text-[color:var(--accent)] hover:underline"
            >
              All tools →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="tool-card group"
              >
                <div className="tool-card__title group-hover:text-[color:var(--accent)] transition-colors">
                  {t.title}
                </div>
                <div className="tool-card__desc">{t.description}</div>
                <div className="tool-card__cat">
                  {categoryLabels[t.category] ?? t.category}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
