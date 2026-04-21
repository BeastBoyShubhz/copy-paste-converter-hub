import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import { Logo } from '@/components/ui/Logo';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Copy-Paste Converter Hub — Free Developer Tools',
    template: '%s | Copy-Paste Converter Hub',
  },
  description:
    'A field manual of free, fast, privacy-first developer tools: JSON formatter, JWT decoder, timestamp converter, Base64, UUID and more. Runs 100% in your browser.',
  metadataBase: new URL('https://converterhub.dev'),
  alternates: { canonical: '/' },
  keywords: [
    'developer tools',
    'json formatter',
    'jwt decoder',
    'base64',
    'timestamp converter',
    'uuid generator',
    'online converter',
    'privacy first',
  ],
  authors: [{ name: 'Shubham Singla', url: 'https://shubhamsingla.tech' }],
  creator: 'Shubham Singla',
  openGraph: {
    type: 'website',
    siteName: 'Copy-Paste Converter Hub',
    title: 'Copy-Paste Converter Hub — Free Developer Tools',
    description:
      'A field manual of free, fast, privacy-first developer tools. No sign-up. No server calls.',
    url: 'https://converterhub.dev',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Copy-Paste Converter Hub',
    description: 'Free, privacy-first developer tools that run in your browser.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();
  const volume = String(currentYear - 2024).padStart(2, '0');

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://www.google-analytics.com; font-src 'self' data: https://fonts.gstatic.com;"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FAF6EE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Copy-Paste Converter Hub',
              url: 'https://converterhub.dev',
              description:
                'A field manual of free, privacy-first developer tools.',
              publisher: {
                '@type': 'Organization',
                name: 'Copy-Paste Converter Hub',
                url: 'https://converterhub.dev',
              },
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H15206J82W"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H15206J82W');
          `}
        </Script>
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          {/* Masthead */}
          <header className="sticky top-0 z-50 bg-[color:var(--paper)]/90 backdrop-blur-sm">
            <div className="container">
              <div className="flex items-center justify-between h-16 md:h-20">
                <Link href="/" aria-label="Home">
                  <Logo />
                </Link>
                <nav className="flex items-center gap-6 md:gap-8">
                  <Link
                    href="/"
                    className="font-mono uppercase tracking-caps text-[0.72rem] text-ink-soft link-grow"
                  >
                    Tools
                  </Link>
                  <Link
                    href="/blog"
                    className="font-mono uppercase tracking-caps text-[0.72rem] text-ink-soft link-grow"
                  >
                    Dispatches
                  </Link>
                  <Link
                    href="/about"
                    className="font-mono uppercase tracking-caps text-[0.72rem] text-ink-soft link-grow"
                  >
                    Colophon
                  </Link>
                </nav>
              </div>
              <div className="rule" />
              {/* Volume strip — editorial kicker */}
              <div className="flex items-center justify-between py-2 text-[0.65rem] font-mono uppercase tracking-caps text-ink-muted">
                <span>Vol. {volume} · est. 2024</span>
                <span className="hidden md:inline">
                  A field manual for developers
                </span>
                <span>No. ∞</span>
              </div>
              <div className="rule" />
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-24 bg-[color:var(--paper-deep)]">
            <div className="container py-14">
              <div className="rule mb-8" />
              <div className="grid gap-10 md:grid-cols-4">
                <div className="md:col-span-2">
                  <div className="font-display text-3xl font-medium text-ink tracking-tight-display">
                    Converter<span className="text-accent">·</span>Hub
                  </div>
                  <p className="mt-3 max-w-md text-sm text-ink-soft leading-relaxed">
                    A free, privacy-first field manual of tools for people who
                    ship software. Everything runs in your browser — no logs,
                    no accounts, no server calls.
                  </p>
                </div>
                <div>
                  <div className="meta-label mb-3">Sections</div>
                  <ul className="space-y-2 text-sm text-ink-soft">
                    <li>
                      <Link href="/" className="link-grow">
                        Tools
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog" className="link-grow">
                        Dispatches
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="link-grow">
                        Colophon
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="link-grow">
                        Privacy
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="meta-label mb-3">Maker</div>
                  <ul className="space-y-2 text-sm text-ink-soft">
                    <li>
                      <a
                        href="https://shubhamsingla.tech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-grow"
                      >
                        Shubham Singla ↗
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/BeastBoyShubhz/copy-paste-converter-hub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-grow"
                      >
                        GitHub ↗
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rule-soft mt-10 mb-4" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-[0.7rem] font-mono uppercase tracking-caps text-ink-muted">
                <span>© {currentYear} · Set in Fraunces &amp; Plex Sans.</span>
                <span>Printed to HTML, bound with CSS.</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
