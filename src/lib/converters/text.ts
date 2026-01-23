export type CaseType = 'camel' | 'snake' | 'kebab' | 'pascal' | 'screaming-snake';

export function convertCase(input: string, type: CaseType): string {
    if (!input) return '';

    // First, normalize to words
    const words = input
        .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
        .replace(/[_-]/g, ' ') // split snake/kebab
        .toLowerCase()
        .trim()
        .split(/\s+/);

    switch (type) {
        case 'camel':
            return words.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('');
        case 'snake':
            return words.join('_');
        case 'kebab':
            return words.join('-');
        case 'screaming-snake':
            return words.join('_').toUpperCase();
        case 'pascal':
            return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
        default:
            return input;
    }
}

export function countDistributions(text: string) {
    const clean = text.replace(/\r/g, '');
    const words = clean.trim() ? clean.trim().split(/\s+/) : [];
    const chars = clean.length;
    const charsNoSpace = clean.replace(/\s/g, '').length;
    const lines = clean ? clean.split('\n').length : 0;

    return {
        words: words.length,
        chars,
        charsNoSpace,
        lines,
        readingTimeMinutes: Math.ceil(words.length / 200) // 200 wpm
    };
}

export function textToSql(text: string, quote = true): string {
    if (!text.trim()) return '()';
    const items = text.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    const formatted = items.map(i => quote ? `'${i}'` : i);
    return `(${formatted.join(', ')})`;
}
