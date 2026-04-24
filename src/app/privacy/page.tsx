export const metadata = {
  title: 'Privacy Policy',
  description: 'What we collect (nothing) and how we handle your data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  const lastRevised = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });

  return (
    <>
      <section className="border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
        <div className="container py-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--text)] leading-tight">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-[color:var(--text-muted)]">
              Last revised {lastRevised}
            </p>
            <div className="mt-4 callout">
              <strong>TL;DR</strong>
              Your inputs never leave the browser. We don&apos;t know what you pasted, and we don&apos;t want to.
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <div className="prose">
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
            If you have questions, open an issue on GitHub — that&apos;s the fastest way to get a response.
          </p>
        </div>
      </section>
    </>
  );
}
