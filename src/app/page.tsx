'use client';

import { tools, ToolMetadata } from '@/lib/tools/registry';
import { useState, useEffect, useRef } from 'react';

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

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(query.toLowerCase()) ||
    tool.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())) ||
    tool.category.includes(query.toLowerCase())
  );

  // Alphabetical sort for the dense view
  const allTools = [...tools].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="pb-12 overflow-x-hidden min-h-screen">
      {/* 1. COMPACT HERO */}
      <section className="relative pt-8 pb-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Left: Title & Tagline */}
            <div className="text-left w-full md:w-auto">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-[var(--text-primary)] flex items-center gap-2">
                Developer Tools <span className="text-base font-medium text-[var(--brand-primary)] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30">Supercharged</span>
              </h1>
            </div>

            {/* Right: Search */}
            <div className="w-full md:flex-1 max-w-sm">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-600 rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search tools (Cmd+K)..."
                    className="input-glass w-full py-2.5 px-10 text-sm rounded-lg border border-[var(--border-color)] focus:border-[var(--brand-primary)] bg-[var(--tool-input-bg)] outline-none transition-all shadow-sm"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base opacity-60 pointer-events-none">🔍</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DENSE TOOL GRID (Immediate Access) */}
      <div className="container px-4 pt-6">

        {query ? (
          <div className="animate-popup">
            <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
            </div>
          </div>
        ) : (
          <>
            {/* Unified Grid - Dense Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {allTools.map(tool => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>

            {/* Footer Caps */}
            <div className="mt-12 text-center opacity-60 scale-90">
              <div className="inline-flex flex-wrap justify-center gap-3">
                {['🔒 Client-Side Only', '⚡ Offline Capable', '🛡️ Zero Logs'].map(cap => (
                  <span key={cap} className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-semibold select-none">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {/* 3. SEO DEFINITIONS & CONTENT (Below Fold) */}
      <section className="container px-4 py-16 border-t border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-[var(--text-primary)] tracking-tight">
            Web Utilities for Modern Developers
          </h2>
          <div className="space-y-12">
            {allTools.map(tool => (
              <article key={tool.slug} className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  {tool.title}
                  <span className="text-xs font-normal text-[var(--text-secondary)] px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full">
                    {tool.category.replace('-', ' ')}
                  </span>
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  {tool.description}
                </p>

                {/* Keywords / Tags for SEO */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.keywords.map(kw => (
                    <span key={kw} className="text-xs text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-1 rounded border border-[var(--border-color)]">
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* Mini FAQ Snippet (First item only for density) */}
                {tool.faqs.length > 0 && (
                  <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)] text-sm">
                    <p className="font-semibold text-[var(--text-primary)] mb-1">
                      Q: {tool.faqs[0].question}
                    </p>
                    <p className="text-[var(--text-secondary)]">
                      {tool.faqs[0].answer}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

function ToolCard({ tool }: { tool: ToolMetadata }) {
  return (
    <a href={`/tools/${tool.slug}`} className="block relative group h-full">
      <div className="h-full p-6 md:p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-indigo-500 hover:shadow-xl transition-all duration-300 tool-card-hover group-hover:-translate-y-2 flex flex-col min-h-[160px]">
        <h3 className="text-lg md:text-xl font-bold group-hover:text-indigo-600 transition-colors text-[var(--text-primary)] mb-3 leading-tight">
          {tool.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
          {tool.description}
        </p>

        {/* Subtle arrow helper */}
        <div className="mt-auto pt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-indigo-500 font-medium text-sm">Open Tool &rarr;</span>
        </div>
      </div>
    </a>
  )
}
