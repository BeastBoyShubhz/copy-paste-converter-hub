export function decodeJWT(token: string): { header: any; payload: any } | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const decode = (str: string) => {
            const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            const json = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(json);
        };

        return {
            header: decode(parts[0]),
            payload: decode(parts[1]),
        };
    } catch (e) {
        return null;
    }
}
