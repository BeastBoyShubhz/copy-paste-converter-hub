import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  cover?: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  html: string;
  readingMinutes: number;
  toc: TocItem[];
  faqs: Faq[];
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts a `## FAQ` (or "Frequently asked questions") section from the markdown
 * body. Expects the section to contain `### Question` subheadings followed by
 * answer paragraphs. Returns [] if none found.
 */
function extractFaqs(markdown: string): Faq[] {
  const faqHeaderRegex =
    /^##\s+(FAQ|Frequently asked questions|Common questions)\s*$/im;
  const match = markdown.match(faqHeaderRegex);
  if (!match || match.index === undefined) return [];

  const afterHeader = markdown.slice(match.index + match[0].length);
  // Take until the next h2 (##) or end of doc.
  const nextH2 = afterHeader.search(/^##\s+/m);
  const block = nextH2 === -1 ? afterHeader : afterHeader.slice(0, nextH2);

  const questions: Faq[] = [];
  const qSplit = block.split(/^###\s+/m).slice(1);
  for (const q of qSplit) {
    const firstLineEnd = q.indexOf('\n');
    const question = stripMarkdown(
      firstLineEnd === -1 ? q : q.slice(0, firstLineEnd),
    );
    const answerRaw = firstLineEnd === -1 ? '' : q.slice(firstLineEnd + 1);
    const answer = stripMarkdown(answerRaw);
    if (question && answer) questions.push({ question, answer });
  }
  return questions;
}

/**
 * Extracts a table of contents from h2/h3 headings (excluding the FAQ header
 * itself so the TOC stays focused on article structure).
 */
function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split('\n');
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m2 = line.match(/^##\s+(.+)$/);
    if (m2) {
      const text = stripMarkdown(m2[1]).trim();
      if (/^(FAQ|Frequently asked questions|Common questions|TL;DR)$/i.test(text)) continue;
      items.push({ id: slugifyHeading(text), text, level: 2 });
      continue;
    }
    const m3 = line.match(/^###\s+(.+)$/);
    if (m3) {
      const text = stripMarkdown(m3[1]).trim();
      items.push({ id: slugifyHeading(text), text, level: 3 });
    }
  }
  return items;
}

function buildRenderer() {
  const renderer = new marked.Renderer();
  renderer.heading = function ({ text, tokens, depth }: any) {
    const content = tokens
      ? this.parser.parseInline(tokens)
      : text;
    const plain = stripMarkdown(text ?? '');
    const id = slugifyHeading(plain);
    if (depth === 2 || depth === 3) {
      return `<h${depth} id="${id}"><a class="heading-anchor" href="#${id}" aria-label="Link to ${plain}">#</a>${content}</h${depth}>\n`;
    }
    return `<h${depth}>${content}</h${depth}>\n`;
  };
  return renderer;
}

function parseFile(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as BlogFrontmatter;
  const renderer = buildRenderer();
  const html = marked.parse(content, { async: false, renderer }) as string;
  const minutes = Math.max(1, Math.round(wordCount(content) / 200));
  const toc = extractToc(content);
  const faqs = extractFaqs(content);
  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    author: fm.author ?? 'Shubham Singla',
    tags: fm.tags ?? [],
    cover: fm.cover,
    html,
    readingMinutes: minutes,
    toc,
    faqs,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'));
  return files
    .map(parseFile)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const file = `${slug}.md`;
  const full = path.join(BLOG_DIR, file);
  if (!fs.existsSync(full)) return null;
  return parseFile(file);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/**
 * Returns posts related to `current` scored by tag overlap.
 * Falls back to most-recent when there is no overlap.
 */
export function getRelatedPosts(current: BlogPost, limit = 3): BlogPost[] {
  const all = getAllPosts().filter((p) => p.slug !== current.slug);
  const currentTags = new Set(current.tags ?? []);
  if (currentTags.size === 0) return all.slice(0, limit);
  const scored = all
    .map((p) => {
      const overlap = (p.tags ?? []).filter((t) => currentTags.has(t)).length;
      return { post: p, score: overlap };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.post.date < b.post.date ? 1 : -1;
    });
  return scored.slice(0, limit).map((s) => s.post);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
