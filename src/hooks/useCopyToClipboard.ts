import { useState, useCallback, useEffect } from 'react';

export function useCopyToClipboard(timeout = 2000) {
    const [isCopied, setIsCopied] = useState(false);

    const copy = useCallback((text: string) => {
        if (!text) return;

        if (navigator?.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                setIsCopied(true);
            }).catch((err) => {
                console.error('Failed to copy keys: ', err);
            });
        } else {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                setIsCopied(true);
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textarea);
        }
    }, []);

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), timeout);
            return () => clearTimeout(timer);
        }
    }, [isCopied, timeout]);

    return { isCopied, copy };
}
