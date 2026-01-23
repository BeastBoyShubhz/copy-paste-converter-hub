'use client';

import React, { useState } from 'react';
import { convertCase, CaseType } from '@/lib/converters/text';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function CaseConverter() {
    const [input, setInput] = useState('');
    const { copy, isCopied } = useCopyToClipboard();
    // Using a simplistic copy state for generic copy, might glitch if copying multiple fast. 
    // Ideally useCopyToClipboard should return a copy(text) that handles ephemeral state per click, but hook shares state. 
    // It's acceptable for MVP.

    const types: { id: CaseType; label: string }[] = [
        { id: 'camel', label: 'camelCase' },
        { id: 'pascal', label: 'PascalCase' },
        { id: 'snake', label: 'snake_case' },
        { id: 'kebab', label: 'kebab-case' },
        { id: 'screaming-snake', label: 'SCREAMING_SNAKE' },
    ];

    return (
        <div className="tool-content">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or paste text here..."
                style={{ width: '100%', minHeight: '150px', padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', fontFamily: 'var(--font-mono)' }}
            />

            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {types.map(t => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ width: '150px', fontWeight: 600 }}>{t.label}</span>
                        <code style={{ flex: 1, overflowX: 'auto', padding: '0 var(--spacing-sm)' }}>{convertCase(input, t.id)}</code>
                        <button
                            onClick={() => copy(convertCase(input, t.id))}
                            style={{ fontSize: '0.85rem', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                        >
                            Copy
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
