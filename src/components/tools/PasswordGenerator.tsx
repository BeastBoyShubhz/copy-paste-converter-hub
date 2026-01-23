'use client';

import React, { useState } from 'react';
import { generatePassword } from '@/lib/converters/more-utils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function PasswordGenerator() {
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        numbers: true,
        symbols: true
    });
    const [password, setPassword] = useState('');
    const { copy, isCopied } = useCopyToClipboard();

    const handleGenerate = () => {
        setPassword(generatePassword(length, options));
    };

    return (
        <div className="tool-content">
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {password || 'Your Password'}
                    </span>
                    {password && (
                        <button onClick={() => copy(password)} className="btn-primary" style={{ marginLeft: '1rem' }}>
                            {isCopied ? 'Copied' : 'Copy'}
                        </button>
                    )}
                </div>
            </div>

            <div className="controls" style={{ display: 'grid', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                <div>
                    <label>Length: {length}</label>
                    <input
                        type="range"
                        min="8"
                        max="64"
                        value={length}
                        onChange={e => setLength(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>
                <label>
                    <input type="checkbox" checked={options.uppercase} onChange={e => setOptions({ ...options, uppercase: e.target.checked })} /> Uppercase (A-Z)
                </label>
                <label>
                    <input type="checkbox" checked={options.numbers} onChange={e => setOptions({ ...options, numbers: e.target.checked })} /> Numbers (0-9)
                </label>
                <label>
                    <input type="checkbox" checked={options.symbols} onChange={e => setOptions({ ...options, symbols: e.target.checked })} /> Symbols (!@#$)
                </label>

                <button onClick={handleGenerate} className="btn-primary" style={{ marginTop: '1rem' }}>
                    Generate New Password
                </button>
            </div>
        </div>
    );
}
