'use client';

import React, { useState } from 'react';
import { textToSql } from '@/lib/converters/text';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function TextToSql() {
    const [input, setInput] = useState('');
    const [quote, setQuote] = useState(true);
    const { copy } = useCopyToClipboard();

    const result = textToSql(input, quote);

    return (
        <div className="tool-content">
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <label>
                    <input type="checkbox" checked={quote} onChange={e => setQuote(e.target.checked)} />
                    {' '}Wrap items in single quotes
                </label>
            </div>

            <div style={{ display: 'grid', gap: 'var(--spacing-lg)', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>Input (Newline or Comma separated)</label>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="a&#10;b&#10;c"
                        style={{ width: '100%', minHeight: '300px', padding: 'var(--spacing-sm)' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>SQL Result</label>
                    <textarea
                        readOnly
                        value={result}
                        style={{ width: '100%', minHeight: '300px', padding: 'var(--spacing-sm)', background: 'var(--bg-secondary)' }}
                    />
                    <button onClick={() => copy(result)} style={{ marginTop: 'var(--spacing-sm)' }}>Copy SQL</button>
                </div>
            </div>
        </div>
    );
}
