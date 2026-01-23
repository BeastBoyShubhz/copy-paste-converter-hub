'use client';

import React, { useState, useEffect } from 'react';
import { unixToDate, dateToUnix, detectIsMilliseconds } from '@/lib/converters/timestamp';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function TimestampConverter() {
    const [input, setInput] = useState<string>('');
    const [isMs, setIsMs] = useState<boolean>(false);
    const [outputDate, setOutputDate] = useState<Date | null>(null);
    const { isCopied, copy } = useCopyToClipboard();

    // Initialize with "Now"
    useEffect(() => {
        const now = new Date();
        const ts = Math.floor(now.getTime() / 1000);
        setInput(ts.toString());
        setIsMs(false);
    }, []);

    useEffect(() => {
        if (!input) {
            setOutputDate(null);
            return;
        }

        const ts = parseInt(input, 10);
        if (isNaN(ts)) {
            setOutputDate(null);
            return;
        }

        // Auto-detect if user changed magnitude
        // Only auto-switch if the input size strongly suggests it and user hasn't explicitly locked it?
        // For now, let's just use the checkbox as source of truth, but maybe auto-set checkbox on first paste
        if (detectIsMilliseconds(ts) && !isMs) {
            setIsMs(true);
        }

        setOutputDate(unixToDate(ts, isMs));
    }, [input, isMs]);

    const handleNow = () => {
        const now = new Date();
        const ts = dateToUnix(now, isMs);
        setInput(ts.toString());
    };

    const handleFormatCopy = (format: string) => {
        if (!outputDate) return;
        let text = '';
        if (format === 'iso') text = outputDate.toISOString();
        else if (format === 'utc') text = outputDate.toUTCString();
        else if (format === 'local') text = outputDate.toLocaleString();
        copy(text);
    };

    return (
        <div className="tool-content">
            <div className="input-group" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                    <label htmlFor="ts-input" style={{ fontWeight: 600 }}>Timestamp</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <label style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={isMs}
                                onChange={e => setIsMs(e.target.checked)}
                                style={{ marginRight: 'var(--spacing-xs)' }}
                            />
                            Milliseconds
                        </label>
                        <button onClick={handleNow} style={{ fontSize: '0.8rem', padding: '0 var(--spacing-sm)', textDecoration: 'underline', background: 'none', border: 'none', color: 'var(--accent-color)' }}>
                            Set to Now
                        </button>
                    </div>
                </div>
                <input
                    id="ts-input"
                    type="number"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="e.g. 1672531200"
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        fontFamily: 'var(--font-mono)'
                    }}
                />
            </div>

            <div className="output-group" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {outputDate ? (
                    <>
                        <ResultRow label="UTC" value={outputDate.toUTCString()} onCopy={() => handleFormatCopy('utc')} />
                        <ResultRow label="ISO 8601" value={outputDate.toISOString()} onCopy={() => handleFormatCopy('iso')} />
                        <ResultRow label="Local" value={outputDate.toLocaleString()} onCopy={() => handleFormatCopy('local')} />
                    </>
                ) : (
                    <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        Enter a valid timestamp to see results
                    </div>
                )}
            </div>
        </div>
    );
}

function ResultRow({ label, value, onCopy }: { label: string, value: string, onCopy: () => void }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-md)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }}>
            <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{value}</span>
            </div>
            <button
                onClick={handleCopy}
                style={{
                    marginLeft: 'var(--spacing-md)',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: copied ? 'var(--success-color)' : 'var(--bg-secondary)',
                    color: copied ? 'white' : 'inherit',
                    transition: 'background-color 0.2s'
                }}
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
}
