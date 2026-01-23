export function toBase64(text: string): string {
    try {
        return btoa(text);
    } catch (e) {
        // Handle unicode
        return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode(parseInt(p1, 16));
            }));
    }
}

export function fromBase64(text: string): string {
    try {
        const str = atob(text);
        // Handle unicode
        return decodeURIComponent(str.split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } catch (e) {
        return atob(text); // Fallback to raw if decodeURIComponent fails (binary data?)
    }
}

export function toUrl(text: string): string {
    return encodeURIComponent(text);
}

export function fromUrl(text: string): string {
    try {
        return decodeURIComponent(text);
    } catch (e) {
        return text; // Partial decode or error
    }
}
