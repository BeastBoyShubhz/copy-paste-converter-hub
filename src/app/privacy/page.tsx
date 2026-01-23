export const metadata = {
    title: 'Privacy Policy | Copy-Paste Converter Hub',
};

export default function PrivacyPage() {
    return (
        <main className="container" style={{ maxWidth: '800px', padding: 'var(--spacing-xl) var(--spacing-md)' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-lg)' }}>Privacy Policy</h1>

            <section style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-sm)' }}>1. No Data Collection</h2>
                <p>
                    At Copy-Paste Converter Hub, we take "privacy-first" literally.
                    **We do not collect, store, or transmit your input data.**
                </p>
                <p>
                    All conversions (JSON formatting, timestamp parsing, etc.) happen client-side in your browser using JavaScript. No input data is ever sent to our servers.
                </p>

                <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-sm)' }}>2. Cookies</h2>
                <p>
                    We use local storage (on your device) to remember your preferences, such as:
                    <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
                        <li>Dark/Light mode theme</li>
                        <li>Recently used tools</li>
                    </ul>
                    These are never transmitted to us. We do not use tracking cookies.
                </p>

                <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-sm)' }}>3. Analytics</h2>
                <p>
                    We may use a basic, privacy-preserving counter to see which pages are visited most often (e.g. "JSON Formatter received 100 views"). This data is aggregate and anonymous. It does not track your IP address or personal identity.
                </p>

                <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-sm)' }}>Contact</h2>
                <p>
                    If you have questions, please open an issue on our GitHub repository.
                </p>
            </section>
        </main>
    );
}
