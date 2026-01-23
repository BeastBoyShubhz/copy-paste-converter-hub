'use client';

import React, { useState } from 'react';
import { generateUUID } from '@/lib/converters/dev-utils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function UuidGenerator() {
    const [uuids, setUuids] = useState<string>('');
    const [count, setCount] = useState<number>(1);
    const { copy, isCopied } = useCopyToClipboard();

    // Generate immediately on mount or just wait for user?
    // Let's wait for user to click generate or generate 1 on load.
    // For now, empty or generate 1.

    const handleGenerate = () => {
        const qty = Math.min(Math.max(1, count), 50);
        const newUuids = Array.from({ length: qty }, () => generateUUID());
        setUuids(newUuids.join('\n'));
    };

    return (
        <div className="tool-content">
            <div className="controls" style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label htmlFor="uuid-count" style={{ fontWeight: 500 }}>Quantity:</label>
                    <input
                        id="uuid-count"
                        type="number"
                        min="1"
                        max="50"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                        style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            width: '80px',
                            background: 'var(--bg-secondary)'
                        }}
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    className="btn-primary"
                    style={{
                        fontSize: '1rem',
                        padding: '0.6rem 1.5rem'
                    }}
                >
                    Generate UUIDs
                </button>
            </div>

            <div className="output-group">
                <div className="output-wrapper" style={{ position: 'relative' }}>
                    <textarea
                        readOnly
                        value={uuids}
                        placeholder="Generated UUIDs will appear here..."
                        rows={Math.max(5, Math.min(count, 15))}
                        className="code-output"
                        style={{
                            width: '100%',
                            fontFamily: 'monospace',
                            fontSize: '1rem',
                            lineHeight: '1.6'
                        }}
                    />
                    {uuids && (
                        <button
                            onClick={() => copy(uuids)}
                            className="copy-btn"
                            style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem'
                            }}
                        >
                            {isCopied ? 'Copied!' : 'Copy All'}
                        </button>
                    )}
                </div>
            </div>

            <p style={{
                textAlign: 'center',
                marginTop: '1rem',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
            }}>
                Generated client-side using <code>Crypto.randomUUID()</code>
            </p>
        </div>
    );
}
