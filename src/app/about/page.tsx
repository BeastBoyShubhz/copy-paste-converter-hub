export const metadata = {
    title: 'About | Copy-Paste Converter Hub',
};

export default function AboutPage() {
    return (
        <main className="container" style={{ maxWidth: '800px', padding: 'var(--spacing-xl) var(--spacing-md)' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-lg)' }}>About Us</h1>

            <section style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    Copy-Paste Converter Hub is a collection of essential developer tools designed to be <strong>fast, private, and ad-free</strong>.
                </p>

                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                    We grew tired of searching for simple tools like "JSON formatter" or "Timestamp converter" only to be bombarded with slow-loading sites, intrusive popups, and privacy concerns.
                </p>

                <p style={{ marginBottom: 'var(--spacing-md)' }}>
                    <strong>Our Mission:</strong>
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: 'var(--spacing-xl)' }}>
                    <li>🚀 <strong>Instant:</strong> No server round-trips. Everything loads instantly.</li>
                    <li>🔒 <strong>Private:</strong> Your data never leaves your browser. Logic runs client-side.</li>
                    <li>🎯 <strong>Focused:</strong> No ads, no newsletters, no fluff. Just the tool you need.</li>
                </ul>

                <h2 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>The Developer</h2>
                <p>
                    This project is developed and maintained by <a href="https://shubhamsingla.tech" target="_blank" style={{ textDecoration: 'underline', color: 'var(--accent-color)' }}>Shubham Singla</a>.
                    It is open-source and built for the community.
                </p>
            </section>
        </main>
    );
}
