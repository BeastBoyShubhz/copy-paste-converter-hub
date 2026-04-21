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

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  html: string;
  readingMinutes: number;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function parseFile(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as BlogFrontmatter;
  const html = marked.parse(content, { async: false }) as string;
  const minutes = Math.max(1, Math.round(wordCount(content) / 200));
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
