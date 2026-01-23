export interface JsonError {
    message: string;
    line?: number;
}

export function formatJson(input: string, spaces = 2): string {
    if (!input.trim()) return '';
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, spaces);
}

export function minifyJson(input: string): string {
    if (!input.trim()) return '';
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
}

export function validateJson(input: string): JsonError | null {
    if (!input.trim()) return null;
    try {
        JSON.parse(input);
        return null;
    } catch (e: any) {
        // Attempt to extract line number from error message (V8 style)
        // "Unexpected token } in JSON at position 10" or "at line 1 column 2"
        // Standard JSON.parse often just gives position
        return {
            message: e.message || 'Invalid JSON'
        };
    }
}
