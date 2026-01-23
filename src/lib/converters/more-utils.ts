export function sortLines(text: string, dedup: boolean): string {
    let lines = text.split(/\r?\n/);
    if (dedup) {
        lines = Array.from(new Set(lines));
    }
    return lines.sort().join('\n');
}

export function convertBase(value: string, fromBase: number, toBase: number): string {
    const num = parseInt(value, fromBase);
    if (isNaN(num)) return 'Invalid Input';
    return num.toString(toBase).toUpperCase();
}

export function generatePassword(length: number, options: { uppercase: boolean; numbers: boolean; symbols: boolean }): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let charset = lowercase;
    if (options.uppercase) charset += uppercase;
    if (options.numbers) charset += numbers;
    if (options.symbols) charset += symbols;

    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
