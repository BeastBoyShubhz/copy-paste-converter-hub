'use client';

import React, { useState } from 'react';
import { sortLines } from '@/lib/converters/more-utils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function LineSorter() {
    const [input, setInput] = useState('');
    const [dedup, setDedup] = useState(false);
    const { copy, isCopied } = useCopyToClipboard();

    const output = sortLines(input, dedup);

    return (
        <div className="tool-content">
            <div className="controls" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={dedup}
                        onChange={e => setDedup(e.target.checked)}
                    />
                    Remove Duplicates?
                </label>
            </div>

            <div className="split-view">
                <div className="input-group">
                    <label>Input List</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Banana&#10;Apple&#10;Cherry"
                        rows={10}
                        className="code-input"
                    />
                </div>
                <div className="input-group">
                    <label>Sorted Output</label>
                    <div className="output-wrapper">
                        <textarea
                            readOnly
                            value={output}
                            rows={10}
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
