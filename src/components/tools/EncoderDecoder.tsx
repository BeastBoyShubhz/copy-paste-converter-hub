'use client';

import React, { useState } from 'react';
import { toBase64, fromBase64, toUrl, fromUrl } from '@/lib/converters/encoders';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface Props {
    mode: 'base64' | 'url';
}

export default function EncoderDecoder({ mode }: Props) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const { copy } = useCopyToClipboard();

    const handleEncode = () => {
        if (mode === 'base64') setOutput(toBase64(input));
        else setOutput(toUrl(input));
    };

    const handleDecode = () => {
        if (mode === 'base64') setOutput(fromBase64(input));
        else setOutput(fromUrl(input));
    };

    return (
        <div className="tool-content">
            <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Enter text to ${mode} encode/decode...`}
                style={{ width: '100%', minHeight: '200px', marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-sm)' }}
            />

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                <button onClick={handleEncode} style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: 'var(--spacing-sm) var(--spacing-lg)', borderRadius: 'var(--radius-md)' }}>Encode</button>
                <button onClick={handleDecode} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: 'var(--spacing-sm) var(--spacing-lg)', borderRadius: 'var(--radius-md)' }}>Decode</button>
            </div>

            <textarea
                value={output}
                readOnly
                placeholder="Result will appear here..."
                style={{ width: '100%', minHeight: '200px', background: 'var(--bg-secondary)', padding: 'var(--spacing-sm)' }}
            />
            <button onClick={() => copy(output)} style={{ marginTop: 'var(--spacing-sm)' }}>Copy Result</button>
        </div>
    );
}
