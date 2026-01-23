import { tools, getToolBySlug } from '@/lib/tools/registry';
import { notFound } from 'next/navigation';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { Metadata } from 'next';

import TimestampConverter from '@/components/tools/TimestampConverter';
import JsonFormatter from '@/components/tools/JsonFormatter';
import JsonToCsv from '@/components/tools/JsonToCsv';
import TextToSql from '@/components/tools/TextToSql';
import CaseConverter from '@/components/tools/CaseConverter';
import WordCounter from '@/components/tools/WordCounter';
import EncoderDecoder from '@/components/tools/EncoderDecoder';
import JwtDecoder from '@/components/tools/JwtDecoder';
import HtmlEscaper from '@/components/tools/HtmlEscaper';
import UuidGenerator from '@/components/tools/UuidGenerator';
import JsonMinifier from '@/components/tools/JsonMinifier';
import LineSorter from '@/components/tools/LineSorter';
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import BaseConverter from '@/components/tools/BaseConverter';

const ToolComponents: Record<string, React.ComponentType> = {
    'timestamp-converter': TimestampConverter,
    'json-formatter': JsonFormatter,
    'json-to-csv': JsonToCsv,
    'text-to-sql': TextToSql,
    'case-converter': CaseConverter,
    'word-counter': WordCounter,
    'base64-encode-decode': () => <EncoderDecoder mode="base64" />,
    'url-encode-decode': () => <EncoderDecoder mode="url" />,
    'jwt-decoder': JwtDecoder,
    'html-escape-unescape': HtmlEscaper,
    'uuid-generator': UuidGenerator,
    'json-minifier': JsonMinifier,
    'line-sorter': LineSorter,
    'password-generator': PasswordGenerator,
    'number-base-converter': BaseConverter,
};

export async function generateStaticParams() {
    return tools.map((tool) => ({
        tool: tool.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
    const { tool: slug } = await params;
    const tool = getToolBySlug(slug);
    if (!tool) return {};

    return {
        title: `${tool.title} | Copy-Paste Converter Hub`,
        description: tool.description,
        keywords: tool.keywords,
        alternates: {
            canonical: `/tools/${tool.slug}`,
        },
    };
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
    const { tool: slug } = await params;
    const tool = getToolBySlug(slug);

    if (!tool) {
        notFound();
    }

    const Component = ToolComponents[tool.slug] || (() => (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            🚧 Tool implementation coming soon.
        </div>
    ));

    return (
        <ToolLayout tool={tool}>
            <Component />
        </ToolLayout>
    );
}
