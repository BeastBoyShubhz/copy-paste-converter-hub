import Link from 'next/link';

export const metadata = {
  title: 'Colophon',
  description:
    'A note on what this site is, how it is built, and who makes it.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <article>
      <header className="container pt-14 md:pt-20 pb-12">
        <div className="grid md:grid-cols-12 gap-10 items-end rise rise-1">
          <div className="md:col-span-9">
            <div className="flex items-center gap-3 mb-6">
              <span className="meta-label meta-label--accent">Colophon</span>
              <span className="h-px w-10 bg-accent" />
              <span className="meta-label">Notes from the maker</span>
            </div>
            <h1 className="font-display text-[12vw] md:text-[7rem] leading-[0.9] tracking-tight-display text-ink">
              A note
              <br />
              <span className="font-italic-serif">on the work.</span>
            </h1>
          </div>
        </div>
        <div className="rule mt-12" />
      </header>

      <section className="container pb-16">
        <div className="grid md:grid-cols-12 gap-10">
          <aside className="md:col-span-4 order-2 md:order-1">
            <div className="sticky top-32 border border-ink bg-paper-card">
              <div className="px-4 py-2 border-b border-ink meta-label meta-label--ink">
                Particulars
              </div>
              <dl className="px-4 py-4 text-sm space-y-3">
                <div className="flex justify-between">
                  <dt className="meta-label">Founded</dt>
                  <dd className="font-mono text-ink">2024</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="meta-label">Editor</dt>
                  <dd className="font-mono text-ink">S. Singla</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="meta-label">Display</dt>
                  <dd className="font-mono text-ink">Fraunces</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="meta-label">Body</dt>
                  <dd className="font-mono text-ink">Plex Sans</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="meta-label">Mono</dt>
                  <dd className="font-mono text-ink">JB Mono</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="meta-label">Engine</dt>
                  <dd className="font-mono text-ink">Next.js</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="meta-label">Press</dt>
                  <dd className="font-mono text-ink">Vercel</dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="md:col-span-8 order-1 md:order-2 blog-content max-w-none">
            <p>
              Copy-Paste Converter Hub is a field manual of small, sharp tools
              for people who ship software. A JSON formatter that actually
              formats. A JWT decoder that will never ask for your secret. A
              timestamp converter that knows the difference between seconds and
              milliseconds without a toggle.
            </p>
            <h2>Why it exists</h2>
            <p>
              Most online developer tools are a race to the bottom of ads,
              cookie banners, and server round-trips that leak your data to
              four different SaaS platforms before the result comes back. This
              project is a counter-argument: everything client-side, nothing
              tracked, typeset like a document you would want to keep.
            </p>
            <h2>Notes on craft</h2>
            <p>
              Every conversion runs locally in your browser using standard Web
              APIs. The site is a static export of a Next.js build — which
              means the whole thing is a handful of HTML, CSS, and JS files.
              There is no backend holding your inputs.
            </p>
            <p>
              Where a specification exists (RFC 3339 for timestamps, RFC 7519
              for JWTs, RFC 4648 for Base64) we follow it. Where a
              specification is ambiguous, we follow the most common correct
              interpretation and say so in the tool&apos;s documentation.
            </p>
            <h2>The maker</h2>
            <p>
              This is maintained by{' '}
              <Link href="https://shubhamsingla.tech" className="link-underline">
                Shubham Singla
              </Link>
              . If a tool is wrong, slow, or missing a feature you would use,
              please open an issue on GitHub — it is the fastest way to make
              the site better for everyone.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
