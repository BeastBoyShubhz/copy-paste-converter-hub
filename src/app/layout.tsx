import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import { Logo } from '@/components/ui/Logo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans-inter',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-jb',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Free Online Developer Tools — ConverterHub',
    template: '%s | ConverterHub',
  },
  description:
    'Free developer tools that run in your browser. JSON formatter, JWT decoder, Base64 encoder, Unix timestamp converter, UUID generator, URL encoder and more. No sign-up, no tracking, no server calls.',
  metadataBase: new URL('https://converterhub.dev'),
  alternates: { canonical: '/' },
  keywords: [
    'developer tools',
    'online tools',
    'json formatter',
    'json validator',
    'jwt decoder',
    'base64 encoder',
    'base64 decoder',
    'url encoder',
    'timestamp converter',
    'unix timestamp',
    'epoch converter',
    'uuid generator',
    'html escape',
    'json to csv',
    'word counter',
    'free developer tools',
    'privacy first tools',
  ],
  authors: [{ name: 'Shubham Singla', url: 'https://shubhamsingla.tech' }],
  creator: 'Shubham Singla',
  openGraph: {
    type: 'website',
    siteName: 'ConverterHub',
    title: 'Free Online Developer Tools — ConverterHub',
    description:
      'Fast, free, privacy-first developer tools. No sign-up. No server calls.',
    url: 'https://converterhub.dev',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConverterHub — Free Online Developer Tools',
    description: 'Fast, privacy-first developer tools that run in your browser.',
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

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://www.google-analytics.com; font-src 'self' data: https://fonts.gstatic.com;"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FFFFFF" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ConverterHub',
              url: 'https://converterhub.dev',
              description:
                'Free, privacy-first developer tools that run in your browser.',
              potentialAction: {
                '@type': 'SearchAction',
                target:
                  'https://converterhub.dev/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'ConverterHub',
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
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[color:var(--border)]">
            <div className="container">
              <div className="flex items-center justify-between h-14">
                <Link href="/" aria-label="ConverterHub home">
                  <Logo />
                </Link>
                <nav className="flex items-center gap-5 text-sm">
                  <Link
                    href="/"
                    className="text-[color:var(--text-soft)] hover:text-[color:var(--accent)] transition-colors"
                  >
                    Tools
                  </Link>
                  <Link
                    href="/blog"
                    className="text-[color:var(--text-soft)] hover:text-[color:var(--accent)] transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/about"
                    className="text-[color:var(--text-soft)] hover:text-[color:var(--accent)] transition-colors"
                  >
                    About
                  </Link>
                  <a
                    href="https://github.com/BeastBoyShubhz/copy-paste-converter-hub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--text-soft)] hover:text-[color:var(--accent)] transition-colors hidden sm:inline"
                  >
                    GitHub
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-16 border-t border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
            <div className="container py-10">
              <div className="grid gap-8 md:grid-cols-4">
                <div className="md:col-span-2">
                  <Logo />
                  <p className="mt-3 max-w-md text-sm text-[color:var(--text-muted)] leading-relaxed">
                    Free, privacy-first developer tools. Everything runs in your browser — no logs, no accounts, no server calls.
                  </p>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
                    Site
                  </div>
                  <ul className="space-y-2 text-sm text-[color:var(--text-soft)]">
                    <li><Link href="/" className="hover:text-[color:var(--accent)]">All tools</Link></li>
                    <li><Link href="/blog" className="hover:text-[color:var(--accent)]">Blog</Link></li>
                    <li><Link href="/about" className="hover:text-[color:var(--accent)]">About</Link></li>
                    <li><Link href="/privacy" className="hover:text-[color:var(--accent)]">Privacy</Link></li>
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
                    Maker
                  </div>
                  <ul className="space-y-2 text-sm text-[color:var(--text-soft)]">
                    <li>
                      <a
                        href="https://shubhamsingla.tech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[color:var(--accent)]"
                      >
                        Shubham Singla ↗
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/BeastBoyShubhz/copy-paste-converter-hub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[color:var(--accent)]"
                      >
                        GitHub ↗
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-[color:var(--border)] text-xs text-[color:var(--text-muted)] flex flex-col md:flex-row justify-between gap-2">
                <span>© {currentYear} ConverterHub. All tools are free and client-side.</span>
                <span>Made for developers who ship.</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
