'use client';

import React, { useState } from 'react';
import { convertBase } from '@/lib/converters/more-utils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export default function BaseConverter() {
    const [dec, setDec] = useState('');
    const [hex, setHex] = useState('');
    const [bin, setBin] = useState('');

    const update = (val: string, type: 'dec' | 'hex' | 'bin') => {
        let decimalValue = NaN;
        if (type === 'dec') {
            setDec(val);
            decimalValue = parseInt(val, 10);
        } else if (type === 'hex') {
            setHex(val);
            decimalValue = parseInt(val, 16);
        } else if (type === 'bin') {
            setBin(val);
            decimalValue = parseInt(val, 2);
        }

        if (!isNaN(decimalValue)) {
            if (type !== 'dec') setDec(decimalValue.toString(10));
            if (type !== 'hex') setHex(decimalValue.toString(16).toUpperCase());
            if (type !== 'bin') setBin(decimalValue.toString(2));
        } else if (val === '') {
            setDec('');
            setHex('');
            setBin('');
        }
    };

    return (
        <div className="tool-content">
            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
                <div className="input-group">
                    <label>Decimal (10)</label>
                    <input type="text" value={dec} onChange={e => update(e.target.value, 'dec')} className="code-input" placeholder="255" />
                </div>
                <div className="input-group">
                    <label>Hexadecimal (16)</label>
                    <input type="text" value={hex} onChange={e => update(e.target.value, 'hex')} className="code-input" placeholder="FF" />
                </div>
                <div className="input-group">
                    <label>Binary (2)</label>
                    <input type="text" value={bin} onChange={e => update(e.target.value, 'bin')} className="code-input" placeholder="11111111" />
                </div>
            </div>
        </div>
    );
}
