'use client';

import React, { useState } from 'react';
import { jsonToCsv, csvToJson } from '@/lib/converters/csv';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function JsonToCsv() {
    const [json, setJson] = useState('');
    const [csv, setCsv] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { copy: copyJson } = useCopyToClipboard();
    const { copy: copyCsv } = useCopyToClipboard();

    const handleToCsv = () => {
        try {
            setError(null);
            setCsv(jsonToCsv(json));
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleToJson = () => {
        try {
            setError(null);
            setJson(csvToJson(csv));
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="tool-content" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {error && <div style={{ color: 'var(--error-color)', padding: 'var(--spacing-sm)', border: '1px solid var(--error-color)', borderRadius: 'var(--radius-md)' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>JSON</label>
                    <textarea
                        value={json}
                        onChange={e => setJson(e.target.value)}
                        placeholder='[{"name": "Alice", "age": 30}]'
                        style={{ flex: 1, minHeight: '300px', padding: 'var(--spacing-sm)', fontFamily: 'var(--font-mono)' }}
                    />
                    <button onClick={() => copyJson(json)} style={{ marginTop: 'var(--spacing-sm)' }}>Copy JSON</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
                    <button onClick={handleToCsv} style={{ padding: 'var(--spacing-md)', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)' }}>JSON &rarr; CSV</button>
                    <button onClick={handleToJson} style={{ padding: 'var(--spacing-md)', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)' }}>CSV &rarr; JSON</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>CSV</label>
                    <textarea
                        value={csv}
                        onChange={e => setCsv(e.target.value)}
                        placeholder='name,age'
                        style={{ flex: 1, minHeight: '300px', padding: 'var(--spacing-sm)', fontFamily: 'var(--font-mono)' }}
                    />
                    <button onClick={() => copyCsv(csv)} style={{ marginTop: 'var(--spacing-sm)' }}>Copy CSV</button>
                </div>
            </div>
        </div>
    );
}
