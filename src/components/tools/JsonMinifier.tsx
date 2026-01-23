'use client';

import React, { useState } from 'react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function JsonMinifier() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const { copy, isCopied } = useCopyToClipboard();

    const handleMinify = () => {
        try {
            const minified = JSON.stringify(JSON.parse(input));
            setOutput(minified);
            setError('');
        } catch (e) {
            setError('Invalid JSON');
            setOutput('');
        }
    };

    return (
        <div className="tool-content">
            <div className="input-group">
                <label>JSON Input</label>
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder='{"key": "value"}'
                    rows={8}
                    className="code-input"
                />
                {error && <span className="error-msg">{error}</span>}
            </div>

            <div style={{ margin: '1rem 0' }}>
                <button onClick={handleMinify} className="btn-primary">Minify JSON</button>
            </div>

            <div className="input-group">
                <label>Minified Output</label>
                <div className="output-wrapper">
                    <textarea
                        readOnly
                        value={output}
                        rows={5}
                        className="code-output"
                    />
                    <button onClick={() => copy(output)} className="copy-btn">
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    );
}
