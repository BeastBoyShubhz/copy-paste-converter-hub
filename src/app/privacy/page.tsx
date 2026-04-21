export const metadata = {
  title: 'Privacy Policy',
  description: 'What we collect (nothing) and how we handle your data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <article>
      <header className="container pt-14 md:pt-20 pb-10">
        <div className="rise rise-1 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="meta-label meta-label--accent">Policy</span>
            <span className="h-px w-10 bg-accent" />
            <span className="meta-label">
              Last revised {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight-display text-ink">
            On <span className="font-italic-serif">privacy</span>.
          </h1>
        </div>
        <div className="rule mt-12" />
      </header>

      <section className="container pb-16">
        <div className="grid md:grid-cols-12 gap-10">
          <aside className="md:col-span-3 order-2 md:order-1">
            <div className="sticky top-32 meta-label meta-label--ink">
              TL;DR
              <p className="mt-2 font-display italic text-ink text-lg leading-snug normal-case tracking-normal">
                Your inputs never leave the browser. We do not know what you pasted. We do not want to.
              </p>
            </div>
          </aside>
          <div className="md:col-span-9 order-1 md:order-2 blog-content max-w-none">
            <h2>No input data collection</h2>
            <p>
              Every conversion — JSON formatting, timestamp parsing, JWT decoding, Base64 encoding, everything — runs entirely in your browser using JavaScript that ships with the page. Your input is never transmitted to our servers, because there is nothing on our side to receive it.
            </p>

            <h2>Local storage</h2>
            <p>
              Some tools remember non-sensitive preferences on your device (theme, recently used tool, UI state). These stay in your browser&apos;s <code>localStorage</code> and are never sent anywhere. Clearing your site data removes them.
            </p>

            <h2>Analytics</h2>
            <p>
              We use Google Analytics to count page views and understand which tools are useful enough to keep building. Analytics sees the URL you visited and the usual technical metadata a browser exposes. It never sees the content of your inputs or outputs. If you want to opt out, a content blocker will take care of it.
            </p>

            <h2>Contact</h2>
            <p>
              If you have questions, open an issue on GitHub — that is the fastest way to get a response.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
