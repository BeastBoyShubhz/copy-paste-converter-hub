#!/usr/bin/env node
/**
 * Daily blog generator — calls Gemini (free tier) and writes a markdown post.
 *
 * Env:
 *   GEMINI_API_KEY — required. Get a free key at https://aistudio.google.com/apikey
 *   GEMINI_MODEL   — optional, defaults to "gemini-2.0-flash" (free tier friendly).
 *
 * Usage:
 *   node scripts/generate-blog.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set. Get a free key: https://aistudio.google.com/apikey');
  process.exit(1);
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
fs.mkdirSync(BLOG_DIR, { recursive: true });

const TOPIC_POOL = [
  {
    topic: 'Regex patterns every backend engineer ends up writing',
    angle: 'email, UUID, slug, phone, URL — what the canonical patterns are, where they fail, and when to reach for a proper parser instead.',
    linkTool: '/tools/json-formatter',
    tags: ['regex', 'backend', 'validation'],
  },
  {
    topic: 'Base64 is not encryption, and other things people get wrong about encoding',
    angle: 'encoding vs. encryption vs. hashing, why Base64 shows up everywhere, URL-safe variants, padding edge cases.',
    linkTool: '/tools/base64-encode-decode',
    tags: ['base64', 'encoding', 'security'],
  },
  {
    topic: 'URL encoding gotchas that break your API requests',
    angle: 'encodeURI vs encodeURIComponent, percent-encoded +, reserved characters, double-encoding nightmares.',
    linkTool: '/tools/url-encode-decode',
    tags: ['urls', 'http', 'api'],
  },
  {
    topic: 'UUID v4 vs v7: which one should you actually use in 2026',
    angle: 'v4 vs v7 tradeoffs, database index impact, when ULIDs make sense, Postgres vs MySQL behavior.',
    linkTool: '/tools/uuid-generator',
    tags: ['uuid', 'database', 'ids'],
  },
  {
    topic: 'JSON formatting edge cases that bite you in production',
    angle: 'NaN and Infinity, BigInt, trailing commas, JSON5, streaming parsers, common serializer footguns.',
    linkTool: '/tools/json-formatter',
    tags: ['json', 'debugging'],
  },
  {
    topic: 'Why your CSV import is broken (and how to actually fix it)',
    angle: 'commas in fields, quote escaping, BOM bytes, CRLF vs LF, Excel vs Google Sheets behavior.',
    linkTool: '/tools/json-to-csv',
    tags: ['csv', 'data', 'excel'],
  },
  {
    topic: 'Password generation: the honest guide for developers',
    angle: 'entropy vs length, diceware vs random, manager vs manual, server-side generation pitfalls.',
    linkTool: '/tools/password-generator',
    tags: ['security', 'passwords'],
  },
  {
    topic: 'camelCase, snake_case, kebab-case: a practical style decision tree',
    angle: 'language conventions, API boundaries, URL slugs, CSS, database columns — when each wins.',
    linkTool: '/tools/case-converter',
    tags: ['conventions', 'style'],
  },
  {
    topic: 'HTML escaping: what actually stops XSS in 2026',
    angle: 'context-aware escaping, CSP, the pitfalls of regex-based sanitization, modern libraries that do it right.',
    linkTool: '/tools/html-escape-unescape',
    tags: ['security', 'xss', 'html'],
  },
  {
    topic: 'Binary, octal, hex: when base conversion actually matters',
    angle: 'bitmasks, file permissions, color codes, debugging with hex dumps, hex literals across languages.',
    linkTool: '/tools/number-base-converter',
    tags: ['binary', 'hex', 'low-level'],
  },
  {
    topic: 'Sorting lines: the underrated move in every developer workflow',
    angle: 'diffs, logs, import ordering, env files, quick dedupe — why a sort+uniq pipeline solves half your problems.',
    linkTool: '/tools/line-sorter',
    tags: ['cli', 'workflow'],
  },
  {
    topic: 'Writing SQL IN clauses from lists: stop doing it by hand',
    angle: 'common mistakes, quoting strings vs numbers, limits across databases, alternatives like temp tables.',
    linkTool: '/tools/text-to-sql',
    tags: ['sql', 'databases'],
  },
  {
    topic: 'JSON minification: when it matters and when it does not',
    angle: 'payload size vs readability, gzip/brotli effects, API responses vs bundled assets, debugging pain.',
    linkTool: '/tools/json-minifier',
    tags: ['json', 'performance'],
  },
  {
    topic: 'Word counts in technical writing: SEO, social, and beyond',
    angle: 'optimal lengths for blog posts, tweets, metadata, LinkedIn, reading time heuristics, character vs word counts.',
    linkTool: '/tools/word-counter',
    tags: ['writing', 'seo'],
  },
];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function pickTopic() {
  // Skip topics whose slug already exists in the blog dir to avoid duplicates.
  const existing = new Set(
    fs
      .readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '')),
  );
  const fresh = TOPIC_POOL.filter((t) => !existing.has(slugify(t.topic)));
  const pool = fresh.length > 0 ? fresh : TOPIC_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
}

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 2400,
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API ${res.status}: ${body}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No text returned: ' + JSON.stringify(data).slice(0, 500));
  return text;
}

function buildPrompt({ topic, angle, linkTool }) {
  return `You are a senior software engineer writing a short, high-quality blog post for a developer tools website (https://converterhub.dev).

Topic: ${topic}
Angle: ${angle}

Write a practical, no-fluff blog post of about 700–900 words. Follow these rules strictly:

1. Voice: plain, direct, first-person when natural. Sound like an experienced engineer writing in a terminal at 11pm, not a marketing blog. No "In today's fast-paced world" or "Let's dive in" openings. No emojis. No exclamation marks except in rare, earned moments.
2. Structure: an opening paragraph that hooks with a concrete example, then 3–5 short sections with ## headings, then a short TL;DR at the end.
3. Use real code snippets in \`\`\`lang fences where helpful. Keep them short and correct.
4. Include exactly ONE internal link to our free tool at "${linkTool}" using markdown. Use natural anchor text (e.g., "paste it into our [tool name](${linkTool})"). Do NOT link to external tools or competing sites.
5. Do not invent statistics. Do not hedge with "it is important to note". No bullet lists of more than 6 items.
6. Do not include any frontmatter — I will add it. Do not include a top-level # heading — the title will be added separately. Start with the opening paragraph of the post.
7. End with a short "## TL;DR" section of 2–4 sentences.

Output ONLY the markdown body (starting with the opening paragraph). No preamble, no commentary, no code fences around the whole output.`;
}

function writeFrontmatterPost(topicDef, body) {
  const title = topicDef.topic;
  const slug = slugify(title);
  const date = todayIso();
  const filename = `${date}-${slug}.md`;
  const filepath = path.join(BLOG_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.log(`Post already exists for today: ${filename}. Skipping.`);
    return null;
  }

  // Derive a one-line description from the first non-empty paragraph.
  const firstPara = body
    .split('\n\n')
    .map((p) => p.trim())
    .find((p) => p.length > 40 && !p.startsWith('#')) ?? topicDef.angle;
  const description = firstPara
    .replace(/\s+/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .slice(0, 180)
    .trim();

  const tags = topicDef.tags ?? [];
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `date: "${date}"`,
    `author: "Shubham Singla"`,
    `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`,
    '---',
    '',
    body.trim(),
    '',
  ].join('\n');

  fs.writeFileSync(filepath, frontmatter, 'utf-8');
  console.log(`Wrote ${filename}`);
  return filepath;
}

async function main() {
  const topic = pickTopic();
  console.log(`Topic: ${topic.topic}`);
  const prompt = buildPrompt(topic);
  const body = await callGemini(prompt);
  const file = writeFrontmatterPost(topic, body);
  if (!file) process.exit(0);
  console.log(`Done: ${file}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
