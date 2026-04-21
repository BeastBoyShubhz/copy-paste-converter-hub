import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import { Logo } from '@/components/ui/Logo';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    default: 'Copy-Paste Converter Hub — Free Developer Tools',
    template: '%s | Copy-Paste Converter Hub',
  },
  description:
    'Free, fast, privacy-first developer tools: JSON formatter, JWT decoder, timestamp converter, Base64, UUID, case converter and more. Runs 100% in your browser — no sign-up, no ads.',
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
      'JSON formatter, JWT decoder, timestamp converter, Base64, UUID & more. 100% client-side, no sign-up.',
    url: 'https://converterhub.dev',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Copy-Paste Converter Hub',
    description:
      'Free, privacy-first developer tools that run in your browser.',
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
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://www.google-analytics.com;" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Copy-Paste Converter Hub',
              url: 'https://converterhub.dev',
              description:
                'Free, privacy-first developer tools: JSON formatter, JWT decoder, timestamp converter, Base64, UUID and more.',
              publisher: {
                '@type': 'Organization',
                name: 'Copy-Paste Converter Hub',
                url: 'https://converterhub.dev',
              },
            }),
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
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
        <div className="min-h-screen flex flex-col font-sans">

          {/* Header - Glass & Logo */}
          <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-glass)] backdrop-blur-md transition-all duration-300">
            <div className="container h-16 flex items-center justify-between">
              <Link href="/" aria-label="Home" className="relative z-50">
                <Logo />
              </Link>
              <nav className="flex items-center gap-5 text-sm font-medium">
                <Link
                  href="/blog"
                  className="text-[var(--text-secondary)] hover:text-indigo-500 transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/about"
                  className="text-[var(--text-secondary)] hover:text-indigo-500 transition-colors"
                >
                  About
                </Link>
              </nav>
            </div>
          </header>

          {/* Main Content - Padded for Fixed Header */}
          <main className="flex-1 pt-16">
            {children}
          </main>

          <footer style={{
            borderTop: '1px solid var(--border-color)',
            padding: '4rem 0',
            marginTop: 'auto',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            background: 'var(--bg-secondary)',
            position: 'relative',
            zIndex: 10
          }}>
            <div className="container">
              <p className="mb-2">Developed and owned by <a href="https://shubhamsingla.tech" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-indigo-500 transition-colors">shubhamsingla.tech</a></p>
              <p className="mb-4 text-xs uppercase tracking-wider opacity-70">🔒 No data leaves your browser.</p>
              <div className="flex justify-center gap-6 text-sm font-medium">
                <Link href="/" className="hover:text-indigo-500 transition-colors">Tools</Link>
                <Link href="/blog" className="hover:text-indigo-500 transition-colors">Blog</Link>
                <Link href="/about" className="hover:text-indigo-500 transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-indigo-500 transition-colors">Privacy</Link>
                <a href="https://github.com/shubhamsingla" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">GitHub</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
