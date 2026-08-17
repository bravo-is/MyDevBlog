#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';
import { marked } from 'marked';

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts');
const EXPORT_DIR = path.join(process.cwd(), 'substack-export');
const SITE_URL = 'https://israelbravo.com';

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const normalizePostId = (input) => input.replace(/\.md$/i, '').replace(/^\/+|\/+$/g, '');

const findPostFile = (postId) => {
  const normalized = normalizePostId(postId);
  const directPath = path.join(POSTS_DIR, `${normalized}.md`);

  if (fs.existsSync(directPath)) {
    return { filePath: directPath, slug: normalized };
  }

  const match = fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .find((entry) => path.basename(entry.name, '.md') === normalized);

  if (!match) {
    throw new Error(`No post found for "${postId}" in ${POSTS_DIR}.`);
  }

  return {
    filePath: path.join(POSTS_DIR, match.name),
    slug: path.basename(match.name, '.md'),
  };
};

const formatDate = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10);
};

const renderSubstackHtml = ({ data, content, slug }) => {
  const title = data.title || slug;
  const description = data.description || '';
  const canonicalUrl = `${SITE_URL}/posts/${slug}/`;
  const bodyHtml = marked.parse(content, { async: false });

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    ${description ? `<p><em>${escapeHtml(description)}</em></p>` : ''}
    <p><small>Originally published at <a href="${escapeHtml(canonicalUrl)}">${escapeHtml(canonicalUrl)}</a>${data.pubDate ? ` on ${escapeHtml(formatDate(data.pubDate))}` : ''}.</small></p>
${bodyHtml}
  </body>
</html>
`;
};

const main = () => {
  const postId = process.argv[2];

  if (!postId) {
    console.error('Usage: npm run export:substack -- <post-id>');
    console.error('Example: npm run export:substack -- post-1');
    process.exit(1);
  }

  const { filePath, slug } = findPostFile(postId);
  const source = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(source);

  if (!parsed.data.title) {
    throw new Error(`Missing required frontmatter field "title" in ${filePath}.`);
  }

  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  const outputPath = path.join(EXPORT_DIR, `${slug}.html`);
  fs.writeFileSync(outputPath, renderSubstackHtml({ ...parsed, slug }), 'utf8');

  console.log(`Exported Substack HTML: ${outputPath}`);
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
