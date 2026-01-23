export function jsonToCsv(jsonInput: string): string {
    if (!jsonInput.trim()) return '';
    let data;
    try {
        data = JSON.parse(jsonInput);
    } catch (e) {
        throw new Error('Invalid JSON');
    }

    if (!Array.isArray(data)) {
        throw new Error('JSON must be an array of objects');
    }
    if (data.length === 0) return '';

    // Collect all unique keys from all objects (in case of inconsistent schema)
    const keys = new Set<string>();
    data.forEach(item => {
        if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(k => keys.add(k));
        }
    });

    const header = Array.from(keys);
    const rows = [header.join(',')];

    data.forEach(item => {
        const row = header.map(key => {
            let val = (item as any)[key];
            if (val === undefined || val === null) return '';
            val = String(val);
            // Escape quotes and wrap in quotes if contains comma or quote
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        });
        rows.push(row.join(','));
    });

    return rows.join('\n');
}

export function csvToJson(csvInput: string): string {
    if (!csvInput.trim()) return '[]';

    const lines = csvInput.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return '[]';

    const headerLine = lines[0];
    // Simple split by comma (doesn't handle quoted commas in header for MVP simplicity, assume simple keys)
    const headers = headerLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));

    const result = [];

    // Basic CSV parser that respects quotes? 
    // For MVP "Simple Only": just split by comma if no quotes detected, else warn?
    // Let's do a simple regex for splitting that handles quotes
    const parseRow = (row: string) => {
        const values = [];
        let inQuote = false;
        let current = '';
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
                if (inQuote && row[i + 1] === '"') {
                    current += '"';
                    i++; // skip escaped quote
                } else {
                    inQuote = !inQuote;
                }
            } else if (char === ',' && !inQuote) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        return values;
    };

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i];
        const values = parseRow(row);
        const obj: any = {};
        headers.forEach((h, index) => {
            // Clean value (remove wrapping quotes if not handled by parseRow logic fully?)
            // Our parseRow keeps content raw inside quotes.
            // But standard CSV usually expects we strip outer quotes.
            // The parseRow above builds 'current' which includes valid chars.
            // Actually standard parseRow logic usually implies stripping the enclosing quotes.
            // Let's just use the values as is for now or do a quick trim.
            if (index < values.length) {
                obj[h] = values[index];
            }
        });
        result.push(obj);
    }

    return JSON.stringify(result, null, 2);
}
