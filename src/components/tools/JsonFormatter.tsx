'use client';

import React, { useState, useEffect } from 'react';
import { formatJson, minifyJson, validateJson } from '@/lib/converters/json';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function JsonFormatter() {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { isCopied, copy } = useCopyToClipboard();

    const handleFormat = (spaces: number) => {
        try {
            const res = formatJson(input, spaces);
            setInput(res);
            setError(null);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleMinify = () => {
        try {
            const res = minifyJson(input);
            setInput(res);
            setError(null);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleChange = (val: string) => {
        setInput(val);
        const err = validateJson(val);
        setError(err ? err.message : null);
    };

    const handleCopy = () => {
        copy(input);
    };

    // Example
    const loadExample = () => {
        setInput('{\n  "name": "Converter Hub",\n  "features": ["Fast", "Secure"]\n}');
        setError(null);
    };

    return (
        <div className="tool-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}>
            <div className="toolbar" style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                <button onClick={() => handleFormat(2)} className="btn">Prettify (2)</button>
                <button onClick={() => handleFormat(4)} className="btn">Prettify (4)</button>
                <button onClick={handleMinify} className="btn">Minify</button>
                <button onClick={loadExample} className="btn secondary">Example</button>
                <div style={{ flex: 1 }}></div>
                <button onClick={handleCopy} className={`btn ${isCopied ? 'success' : 'primary'}`}>
                    {isCopied ? 'Copied' : 'Copy Result'}
                </button>
            </div>

            <style jsx>{`
        .btn {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-weight: 500;
        }
        .btn.primary { background: var(--accent-color); color: white; border: none; }
        .btn.success { background: var(--success-color); color: white; border: none; }
        .btn:hover { opacity: 0.9; }
      `}</style>

            {error && (
                <div style={{
                    padding: 'var(--spacing-sm)',
                    background: '#fef2f2',
                    color: '#ef4444',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-sm)',
                    fontSize: '0.9rem'
                }}>
                    Error: {error}
                </div>
            )}

            <textarea
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Paste JSON here..."
                spellCheck={false}
                style={{
                    flex: 1,
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    border: `1px solid ${error ? 'var(--error-color)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-lg)',
                    resize: 'vertical',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                }}
            />
        </div>
    );
}
