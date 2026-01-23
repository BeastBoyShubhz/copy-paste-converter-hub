'use client';

import React, { useState } from 'react';
import { countDistributions } from '@/lib/converters/text';

export default function WordCounter() {
    const [input, setInput] = useState('');
    const stats = countDistributions(input);

    return (
        <div className="tool-content">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <StatBox label="Words" value={stats.words} />
                <StatBox label="Characters" value={stats.chars} />
                <StatBox label="Chars (no space)" value={stats.charsNoSpace} />
                <StatBox label="Lines" value={stats.lines} />
                <StatBox label="Read Time" value={`~${stats.readingTimeMinutes} min`} />
            </div>

            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Start typing..."
                style={{ width: '100%', minHeight: '300px', padding: 'var(--spacing-md)', fontFamily: 'var(--font-mono)' }}
            />
        </div>
    );
}

function StatBox({ label, value }: { label: string, value: number | string }) {
    return (
        <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-color)' }}>{value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</div>
        </div>
    );
}
