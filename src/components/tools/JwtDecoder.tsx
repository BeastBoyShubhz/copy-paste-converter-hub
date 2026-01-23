'use client';

import React, { useState } from 'react';
import { decodeJWT } from '@/lib/converters/jwt';

export default function JwtDecoder() {
    const [input, setInput] = useState('');
    const [decoded, setDecoded] = useState<{ header: any; payload: any } | null>(null);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value.trim();
        setInput(val);
        setError('');

        if (!val) {
            setDecoded(null);
            return;
        }

        const result = decodeJWT(val);
        if (result) {
            setDecoded(result);
        } else {
            setDecoded(null);
            setError('Invalid JWT format');
        }
    };

    return (
        <div className="tool-content">
            <div className="input-group">
                <label>Encoded Token</label>
                <textarea
                    value={input}
                    onChange={handleChange}
                    placeholder="eyJh..."
                    rows={4}
                    className="code-input"
                />
                {error && <span className="error-msg">{error}</span>}
            </div>

            {decoded && (
                <div className="output-group" style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                    <div>
                        <label>Header</label>
                        <pre className="code-output">{JSON.stringify(decoded.header, null, 2)}</pre>
                    </div>
                    <div>
                        <label>Payload</label>
                        <pre className="code-output">{JSON.stringify(decoded.payload, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}
