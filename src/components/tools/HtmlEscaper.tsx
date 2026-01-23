'use client';

import React, { useState } from 'react';
import { escapeHTML, unescapeHTML } from '@/lib/converters/dev-utils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function HtmlEscaper() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
    const { copy, isCopied } = useCopyToClipboard();

    const output = mode === 'escape' ? escapeHTML(input) : unescapeHTML(input);

    return (
        <div className="tool-content">
            <div className="controls" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => setMode('escape')}
                    className={mode === 'escape' ? 'btn-primary' : 'btn-secondary'}
                >
                    Escape
                </button>
                <button
                    onClick={() => setMode('unescape')}
                    className={mode === 'unescape' ? 'btn-primary' : 'btn-secondary'}
                >
                    Unescape
                </button>
            </div>

            <div className="split-view">
                <div className="input-group">
                    <label>Input</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === 'escape' ? '<div class="foo">' : '&lt;div class=&quot;foo&quot;&gt;'}
                        rows={8}
                        className="code-input"
                    />
                </div>
                <div className="input-group">
                    <label>Output</label>
                    <div className="output-wrapper">
                        <textarea
                            readOnly
                            value={output}
                            rows={8}
                            className="code-output"
                        />
                        <button onClick={() => copy(output)} className="copy-btn">
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
