export function unixToDate(timestamp: number, isMilliseconds: boolean): Date {
    // If input is suspiciously small (seconds) but labelled ms, it treats as ms (1970).
    // If input is seconds, multiply by 1000.
    const ms = isMilliseconds ? timestamp : timestamp * 1000;
    return new Date(ms);
}

export function dateToUnix(date: Date, toMilliseconds: boolean): number {
    const ms = date.getTime();
    return toMilliseconds ? ms : Math.floor(ms / 1000);
}

export function detectIsMilliseconds(ts: number): boolean {
    // Heuristic: If > 100 billion, it's probably MS (valid until 1973 for seconds, but 2001 for MS? No.)
    // Current seconds: 1.7 Billion. Current MS: 1.7 Trillion.
    // Cutoff: 100 Billion (1e11).
    return Math.abs(ts) > 1e11;
}
