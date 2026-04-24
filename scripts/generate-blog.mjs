#!/usr/bin/env node
/**
 * Daily blog generator — calls Gemini (free tier) and writes a markdown post.
 *
 * Produces long-form (1500-2200 word), keyword-targeted, internally-linked
 * posts with TOC-friendly H2/H3 structure, a required FAQ section (picked up
 * by our FAQPage JSON-LD renderer), and a short TL;DR.
 *
 * Env:
 *   GEMINI_API_KEY — required. Free key at https://aistudio.google.com/apikey
 *   GEMINI_MODEL   — optional, defaults to "gemini-2.0-flash".
 *
 * Usage:
 *   node scripts/generate-blog.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

if (!API_KEY) {
  console.error(
    'GEMINI_API_KEY is not set. Get a free key: https://aistudio.google.com/apikey',
  );
  process.exit(1);
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
fs.mkdirSync(BLOG_DIR, { recursive: true });

/**
 * Topic pool. Each entry drives one post. `primaryKeyword` is the head term
 * we want the post to rank for. `relatedLinks` are tool pages to weave in
 * as contextual internal links. `sourceRefs` are authoritative external URLs
 * the model may cite (RFC, MDN, etc.).
 */
const TOPIC_POOL = [
  {
    topic: 'How to format JSON in 2026: a developer’s practical guide',
    primaryKeyword: 'JSON formatter',
    angle:
      'why developers format JSON (readability, diffs, review), the common indent conventions, how to validate as you format, and when to keep it minified instead.',
    primaryTool: '/tools/json-formatter',
    relatedLinks: ['/tools/json-minifier', '/tools/json-to-csv'],
    sourceRefs: [
      'https://www.rfc-editor.org/rfc/rfc8259',
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify',
    ],
    tags: ['json', 'formatting', 'tooling'],
  },
  {
    topic: 'How to decode a JWT: the safe way in 2026',
    primaryKeyword: 'JWT decoder',
    angle:
      'what a JWT actually is (header.payload.signature), the Base64URL alphabet, why you never paste tokens into random websites, how to verify signatures, and the real attack surface.',
    primaryTool: '/tools/jwt-decoder',
    relatedLinks: ['/tools/base64-encode-decode'],
    sourceRefs: [
      'https://www.rfc-editor.org/rfc/rfc7519',
      'https://datatracker.ietf.org/doc/html/rfc7515',
    ],
    tags: ['jwt', 'security', 'auth'],
  },
  {
    topic: 'Base64 encoding explained for web developers',
    primaryKeyword: 'Base64 encoder',
    angle:
      'what Base64 is and is not (encoding, not encryption), the 64-char alphabet, padding rules, URL-safe variants, the 33% size overhead, and when to use data URIs vs real storage.',
    primaryTool: '/tools/base64-encode-decode',
    relatedLinks: ['/tools/url-encode-decode'],
    sourceRefs: [
      'https://www.rfc-editor.org/rfc/rfc4648',
      'https://developer.mozilla.org/en-US/docs/Glossary/Base64',
    ],
    tags: ['base64', 'encoding'],
  },
  {
    topic: 'Unix timestamp to date: every conversion you’ll ever need',
    primaryKeyword: 'Unix timestamp converter',
    angle:
      'seconds vs milliseconds, UTC vs local, ISO 8601, timezone offsets, and the classic copy-paste mistakes that ship bugs to production.',
    primaryTool: '/tools/timestamp-converter',
    relatedLinks: ['/tools/json-formatter'],
    sourceRefs: [
      'https://www.rfc-editor.org/rfc/rfc3339',
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
    ],
    tags: ['timestamps', 'dates', 'utc'],
  },
  {
    topic: 'UUID v4 vs UUID v7: which one should you use in 2026',
    primaryKeyword: 'UUID generator',
    angle:
      'random v4 vs time-ordered v7, B-tree index behavior in Postgres and MySQL, why ULIDs exist, and concrete recommendations per use case.',
    primaryTool: '/tools/uuid-generator',
    relatedLinks: ['/tools/json-formatter'],
    sourceRefs: [
      'https://datatracker.ietf.org/doc/html/rfc9562',
      'https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID',
    ],
    tags: ['uuid', 'database', 'ids'],
  },
  {
    topic: 'URL encoding: the rules every API consumer gets wrong',
    primaryKeyword: 'URL encoder',
    angle:
      'encodeURI vs encodeURIComponent, what counts as a reserved character, percent-encoded + and %20, double-encoding disasters, and when the server is actually at fault.',
    primaryTool: '/tools/url-encode-decode',
    relatedLinks: ['/tools/base64-encode-decode', '/tools/html-escape-unescape'],
    sourceRefs: [
      'https://url.spec.whatwg.org/',
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent',
    ],
    tags: ['urls', 'api', 'http'],
  },
  {
    topic: 'JSON to CSV: the conversion pitfalls that eat your weekend',
    primaryKeyword: 'JSON to CSV converter',
    angle:
      'nested objects, arrays of arrays, commas inside fields, quoting and escaping rules, BOM and CRLF, Excel vs Sheets behavior, stable column ordering.',
    primaryTool: '/tools/json-to-csv',
    relatedLinks: ['/tools/json-formatter', '/tools/json-minifier'],
    sourceRefs: [
      'https://www.rfc-editor.org/rfc/rfc4180',
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON',
    ],
    tags: ['json', 'csv', 'data'],
  },
  {
    topic: 'HTML escape and unescape: stopping XSS in modern web apps',
    primaryKeyword: 'HTML escape tool',
    angle:
      'what each HTML entity escapes, why context matters (attribute vs text vs URL vs script), CSP as a second layer, and the libraries to trust.',
    primaryTool: '/tools/html-escape-unescape',
    relatedLinks: ['/tools/url-encode-decode'],
    sourceRefs: [
      'https://owasp.org/www-community/attacks/xss/',
      'https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting',
    ],
    tags: ['xss', 'security', 'html'],
  },
  {
    topic: 'Regex patterns every backend engineer ends up writing',
    primaryKeyword: 'regex patterns developer',
    angle:
      'canonical patterns for email, UUID, slug, phone, URL, and when to stop and reach for a real parser instead.',
    primaryTool: '/tools/json-formatter',
    relatedLinks: ['/tools/uuid-generator'],
    sourceRefs: [
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions',
    ],
    tags: ['regex', 'backend', 'validation'],
  },
  {
    topic: 'Password generation: the honest guide for developers',
    primaryKeyword: 'password generator',
    angle:
      'entropy vs length, diceware vs random, why managers beat memorization, and the server-side generation pitfalls that cause breaches.',
    primaryTool: '/tools/password-generator',
    relatedLinks: ['/tools/base64-encode-decode'],
    sourceRefs: [
      'https://pages.nist.gov/800-63-3/',
      'https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues',
    ],
    tags: ['security', 'passwords'],
  },
  {
    topic: 'camelCase, snake_case, kebab-case: a decision tree that actually works',
    primaryKeyword: 'case converter',
    angle:
      'language conventions, API boundaries, URL slugs, CSS, database columns — when each style wins, and why mixing them causes bugs.',
    primaryTool: '/tools/case-converter',
    relatedLinks: ['/tools/word-counter'],
    sourceRefs: [
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types',
    ],
    tags: ['conventions', 'style'],
  },
  {
    topic: 'Hex, binary, and octal: when base conversion matters in real code',
    primaryKeyword: 'number base converter',
    angle:
      'bitmasks, Unix file permissions, color codes, reading hex dumps, and hex literal syntax across languages.',
    primaryTool: '/tools/number-base-converter',
    relatedLinks: ['/tools/base64-encode-decode'],
    sourceRefs: [
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString',
    ],
    tags: ['binary', 'hex', 'low-level'],
  },
  {
    topic: 'Sorting and deduping lines: the underrated developer shortcut',
    primaryKeyword: 'sort lines online',
    angle:
      'log triage, import ordering, diff noise, env files, and why `sort | uniq` solves half the problems that look complicated.',
    primaryTool: '/tools/line-sorter',
    relatedLinks: ['/tools/word-counter'],
    sourceRefs: [
      'https://man7.org/linux/man-pages/man1/sort.1.html',
    ],
    tags: ['cli', 'workflow'],
  },
  {
    topic: 'SQL IN clauses from lists: stop doing it by hand',
    primaryKeyword: 'SQL IN clause',
    angle:
      'common mistakes, string vs number quoting, parameter limits across databases, and alternatives like temp tables and VALUES.',
    primaryTool: '/tools/text-to-sql',
    relatedLinks: ['/tools/line-sorter'],
    sourceRefs: [
      'https://www.postgresql.org/docs/current/functions-comparisons.html',
    ],
    tags: ['sql', 'databases'],
  },
  {
    topic: 'JSON minification: when it matters and when it doesn’t',
    primaryKeyword: 'JSON minifier',
    angle:
      'payload size vs readability, gzip and brotli effects, API responses vs bundled assets, and why minification rarely moves the needle by itself.',
    primaryTool: '/tools/json-minifier',
    relatedLinks: ['/tools/json-formatter'],
    sourceRefs: [
      'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding',
    ],
    tags: ['json', 'performance'],
  },
];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function pickTopic() {
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
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 6000,
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API ${res.status}: ${body}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text)
    throw new Error('No text returned: ' + JSON.stringify(data).slice(0, 500));
  return text;
}

function buildPrompt(topicDef) {
  const {
    topic,
    primaryKeyword,
    angle,
    primaryTool,
    relatedLinks,
    sourceRefs,
  } = topicDef;
  const internalLinkList = [primaryTool, ...(relatedLinks ?? [])]
    .map((l) => `- https://converterhub.dev${l}`)
    .join('\n');
  const externalLinkList = (sourceRefs ?? []).map((l) => `- ${l}`).join('\n');

  return `You are a senior software engineer and tech writer producing a long-form, SEO-optimized blog post for ConverterHub (https://converterhub.dev), a free developer tools site. The audience is working developers who ship code.

TOPIC: ${topic}
PRIMARY KEYWORD: ${primaryKeyword}
ANGLE: ${angle}

INTERNAL LINKS (weave naturally — include the primary tool link once, others where they fit):
${internalLinkList}

AUTHORITATIVE EXTERNAL SOURCES (cite at least one as a markdown link in the body):
${externalLinkList}

WRITING RULES — follow all of them:

1. Voice: plain, direct, example-driven. Sound like an experienced engineer, not a marketing blog. No "In today's fast-paced world", no "dive in", no "unlock", no "game-changer", no emojis, no exclamation marks. First person ("I", "we") is fine where natural.
2. Length: 1500 to 2200 words of body content. Aim for the upper end.
3. Structure — in this exact order:
   a. Opening paragraph (3–5 sentences). Start with a concrete problem or example, not a definition. DO NOT include a top-level "#" title — the site adds it.
   b. A short "## TL;DR" with 3–5 bullets summarizing the whole post.
   c. 4 to 6 body sections, each with a "## " heading. Use the PRIMARY KEYWORD in at least 2 of those H2s in natural form (not shoe-horned). Include code examples in \`\`\`language fences where they earn their space. Use "### " subheadings inside sections when useful.
   d. A "## Common mistakes" section with a bulleted list of 4–6 concrete mistakes and how to avoid them.
   e. A "## FAQ" section (this exact heading, singular). Under it, 4–6 "### " subheadings, each a full natural-language question (e.g. "### Is Base64 encryption?"). Under each question, 1–3 sentences of answer. These will be picked up by our FAQPage schema, so keep them self-contained and informative.
   f. A brief "## Wrapping up" closing paragraph (NOT another TL;DR).
4. Links:
   a. Include the primary internal tool link EXACTLY ONCE with natural anchor text, e.g. "paste it into our [JSON formatter](${primaryTool})". Use the path, not the full URL.
   b. Include 1–2 of the other internal links where they fit naturally, using the path.
   c. Include AT LEAST ONE external citation link to one of the authoritative sources above, using the full URL.
5. Do not invent statistics or benchmarks. Do not promise what the tool doesn't do. Do not mention competing tool sites by name. Do not add a generic disclaimer paragraph.
6. Code blocks should be short, correct, and copy-pasteable. If you show wrong code, show the fix immediately after.
7. Do NOT include any frontmatter, no top-level "#" heading, no wrapping code fences. Start with the opening paragraph. End with the final sentence of the "## Wrapping up" section — no sign-off.

Output ONLY the markdown body. Nothing before the first paragraph. Nothing after the last paragraph.`;
}

function deriveDescription(body, topicDef) {
  const firstPara =
    body
      .split('\n\n')
      .map((p) => p.trim())
      .find((p) => p.length > 40 && !p.startsWith('#') && !p.startsWith('-')) ??
    topicDef.angle;
  return firstPara
    .replace(/\s+/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .slice(0, 180)
    .trim();
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

  const description = deriveDescription(body, topicDef);
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
