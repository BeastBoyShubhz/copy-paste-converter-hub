'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const JsonFormatter = dynamic(() => import('@/components/tools/JsonFormatter'), { ssr: false });
const JwtDecoder = dynamic(() => import('@/components/tools/JwtDecoder'), { ssr: false });
const EncoderDecoder = dynamic(() => import('@/components/tools/EncoderDecoder'), { ssr: false });
const TimestampConverter = dynamic(() => import('@/components/tools/TimestampConverter'), { ssr: false });

type TabKey = 'json' | 'jwt' | 'base64' | 'timestamp';

const TABS: { key: TabKey; label: string; slug: string }[] = [
  { key: 'json', label: 'JSON Formatter', slug: 'json-formatter' },
  { key: 'jwt', label: 'JWT Decoder', slug: 'jwt-decoder' },
  { key: 'base64', label: 'Base64', slug: 'base64-encode-decode' },
  { key: 'timestamp', label: 'Timestamp', slug: 'timestamp-converter' },
];

export function HeroTool() {
  const [active, setActive] = useState<TabKey>('json');
  const activeTab = TABS.find((t) => t.key === active)!;

  return (
    <div className="tool-workspace-wrapper">
      <div
        role="tablist"
        aria-label="Featured tool"
        className="flex items-center gap-1 mb-4 overflow-x-auto -mx-1 px-1 border-b border-[color:var(--border)]"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={`relative px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              active === tab.key
                ? 'text-[color:var(--accent)]'
                : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
            }`}
          >
            {tab.label}
            {active === tab.key && (
              <span
                aria-hidden
                className="absolute inset-x-3 -bottom-px h-0.5 bg-[color:var(--accent)]"
              />
            )}
          </button>
        ))}
        <div className="flex-1" />
        <Link
          href={`/tools/${activeTab.slug}`}
          className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--accent)] whitespace-nowrap px-2"
        >
          Open full page →
        </Link>
      </div>

      <div role="tabpanel" className="min-h-[340px]">
        {active === 'json' && <JsonFormatter />}
        {active === 'jwt' && <JwtDecoder />}
        {active === 'base64' && <EncoderDecoder mode="base64" />}
        {active === 'timestamp' && <TimestampConverter />}
      </div>
    </div>
  );
}
