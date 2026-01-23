'use client';

import { ToolMetadata } from '@/lib/tools/registry';
import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ToolLayoutProps {
    tool: ToolMetadata;
    children: React.ReactNode;
    className?: string;
}

export function ToolLayout({ tool, children, className }: ToolLayoutProps) {
    const { copy, isCopied } = useCopyToClipboard();
    useAnalytics(tool.slug);

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            copy(window.location.href);
        }
    };

    const handleReset = () => {
        window.location.reload();
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
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": tool.title,
        "description": tool.description,
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any"
    };

    return (
        <article className={cn('tool-page', className)} style={{ width: '100%', maxWidth: '100vw' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* --- SECTION 1: TOOL INTERACTION (The Machine) --- */}
            <div style={{
                position: 'relative',
                background: 'var(--bg-primary)',
                padding: 'var(--spacing-lg) 0 0'
            }}>
                <div className="container">
                    <header style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            marginBottom: '0.5rem',
                            color: 'var(--text-primary)',
                            display: 'inline-block',
                            background: 'var(--brand-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            paddingBottom: '0.1em' /* for descenders */
                        }}>
                            {tool.title}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
                            {tool.description}
                        </p>
                    </header>

                    {/* The Tool UI - Modern Rounded Card */}
                    <div className="tool-workspace-wrapper" style={{
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        boxShadow: 'var(--shadow-lg)',
                        padding: '2rem',
                        marginBottom: '-3rem', /* Overlap section below */
                        position: 'relative',
                        zIndex: 10
                    }}>
                        {children}
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: AUTHORITY CONTENT (The Manual) --- */}
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '6rem 0 4rem',
                marginTop: '0'
            }}>
                <div className="container" style={{ maxWidth: '900px' }}>

                    {/* Feature Grid (Capabilities) */}
                    <section style={{ marginBottom: 'var(--spacing-section)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Capabilities</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {[
                                { title: 'Local Processing', desc: 'Data never matches server' },
                                { title: 'Large Files', desc: 'Optimized for 5MB+ text' },
                                { title: 'Privacy First', desc: 'No logs, no tracking' },
                                { title: 'Standard Compliant', desc: 'Strict RFC adherence' }
                            ].map((feat, i) => (
                                <div key={i} style={{
                                    padding: '1rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--bg-secondary)'
                                }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>✓ {feat.title}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{feat.desc}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Content Flow */}
                    <div className="prose">
                        <h2>How It Works</h2>
                        <div dangerouslySetInnerHTML={{ __html: tool.howItWorks }} />
                    </div>

                    {/* FAQs */}
                    {tool.faqs.length > 0 && (
                        <section style={{ marginTop: 'var(--spacing-section)' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {tool.faqs.map((faq, i) => (
                                    <details key={i} style={{
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden'
                                    }}>
                                        <summary style={{
                                            padding: '1rem',
                                            backgroundColor: 'var(--bg-secondary)',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            color: 'var(--text-primary)'
                                        }}>{faq.question}</summary>
                                        <div style={{ padding: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, backgroundColor: 'white' }}>
                                            {faq.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Related Tools */}
                    <section style={{ marginTop: 'var(--spacing-section)', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>Related Tools</h3>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {tools.filter(t => t.category === tool.category && t.slug !== tool.slug).slice(0, 5).map(t => (
                                <a key={t.slug} href={`/tools/${t.slug}`} style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    textDecoration: 'none'
                                }}>
                                    {t.title}
                                </a>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </article>
    );
}

// Helper to access all tools for linking (imported from registry but needs to be available in component scope)
import { tools } from '@/lib/tools/registry';
