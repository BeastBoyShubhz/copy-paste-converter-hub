import Link from 'next/link';

export const metadata = {
  title: 'About',
  description:
    'About ConverterHub: free, privacy-first developer tools that run entirely in your browser.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
        <div className="container py-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--text)] leading-tight">
              About ConverterHub
            </h1>
            <p className="mt-3 text-base md:text-lg text-[color:var(--text-soft)] leading-relaxed">
              A small, free collection of developer tools that run entirely in your browser. No sign-ups, no ads, no server round-trips.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <div className="prose">
          <h2>Why it exists</h2>
          <p>
            Most online developer tools are a race to the bottom: ad-heavy pages that send your input through four analytics platforms before returning a result. ConverterHub is a counter-argument. Every conversion — JSON, JWT, Base64, timestamps, UUID — runs locally using standard Web APIs. There is no backend. Your inputs never leave your browser.
          </p>

          <h2>How it&apos;s built</h2>
          <p>
            The site is a static export of a Next.js build. It is a handful of HTML, CSS, and JS files served from a CDN. Fast to load, resilient on weak connections, and cheap to host.
          </p>
          <p>
            Where a specification exists — RFC 3339 for timestamps, RFC 7519 for JWTs, RFC 4648 for Base64, WHATWG for URL encoding — we follow it. Where a spec is ambiguous, we pick the most common correct interpretation and document it on the tool&apos;s page.
          </p>

          <h2>Who makes it</h2>
          <p>
            Maintained by{' '}
            <Link href="https://shubhamsingla.tech">Shubham Singla</Link>. If a tool is wrong, slow, or missing a feature you&apos;d use, please{' '}
            <a
              href="https://github.com/BeastBoyShubhz/copy-paste-converter-hub/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              open an issue on GitHub
            </a>
            .
          </p>

          <h2>Principles</h2>
          <ul>
            <li><strong>Privacy by default.</strong> Nothing you paste is transmitted.</li>
            <li><strong>Free, forever.</strong> No paywall, no &ldquo;pro&rdquo; tier.</li>
            <li><strong>Fast.</strong> Static pages, minimal JavaScript.</li>
            <li><strong>Standards-first.</strong> When a spec exists, follow it.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
