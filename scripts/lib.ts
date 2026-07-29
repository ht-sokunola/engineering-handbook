/**
 * lib.ts
 *
 * Shared helpers for the handbook tooling (validate-structure, generate-index):
 * a minimal frontmatter parser, tree walkers, and naming/heading utilities.
 * No runtime dependencies — Node built-ins only.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/** Absolute path to the repository root (the parent of scripts/). */
export const REPO_ROOT = dirname(here);

/** Absolute path to the docs/ tree. */
export const DOCS_DIR = join(REPO_ROOT, 'docs');

/** Frontmatter keys every markdown page must declare. */
export const REQUIRED_KEYS = ['title', 'summary', 'status', 'owner', 'last_reviewed'] as const;

/** Directory names under docs/ that are exempt from the structural rules. */
export const IGNORED_DIRS = new Set(['_source', 'assets', 'node_modules']);

/** Markers delimiting the region generate-index rewrites inside a README. */
export const INDEX_START = '<!-- index:start -->';
export const INDEX_END = '<!-- index:end -->';

/** Parsed frontmatter values; array-valued keys (e.g. applies_to) stay arrays. */
export type Frontmatter = Record<string, string | string[]>;

export interface ParsedDoc {
  hasFrontmatter: boolean;
  data: Frontmatter;
  /** Document text with the frontmatter block stripped. */
  body: string;
}

/**
 * Parse a leading `---` fenced YAML-ish frontmatter block. Supports scalar
 * values and single-line flow arrays (`[a, b]`); nested structures are not used
 * by the handbook and are not supported.
 */
export const parseFrontmatter = (content: string): ParsedDoc => {
  const normalised = content.replace(/^﻿/, '');
  if (!normalised.startsWith('---\n') && !normalised.startsWith('---\r\n')) {
    return { hasFrontmatter: false, data: {}, body: normalised };
  }
  const lines = normalised.split(/\r?\n/);
  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i] === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) {
    return { hasFrontmatter: false, data: {}, body: normalised };
  }
  const data: Frontmatter = {};
  for (const line of lines.slice(1, end)) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
    const match = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    data[key] = parseValue(rawValue);
  }
  return { hasFrontmatter: true, data, body: lines.slice(end + 1).join('\n') };
};

const parseValue = (raw: string): string | string[] => {
  const value = raw.trim();
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => stripQuotes(item.trim()))
      .filter((item) => item.length > 0);
  }
  return stripQuotes(value);
};

const stripQuotes = (value: string): string => {
  if (value.length >= 2 && (value.startsWith('"') || value.startsWith("'"))) {
    const quote = value[0];
    if (value.endsWith(quote)) return value.slice(1, -1);
  }
  return value;
};

/** Return the rendered text of the first ATX H1 in a body, or null if there is none. */
export const readH1 = (body: string): string | null => {
  for (const line of body.split(/\r?\n/)) {
    const match = /^#\s+(.+?)\s*$/.exec(line);
    if (match) return unescapeMarkdown(match[1]);
  }
  return null;
};

/** Drop backslash escapes (e.g. `C\#` -> `C#`) so an H1 compares against a clean title. */
const unescapeMarkdown = (text: string): string => text.replace(/\\([\\`*_{}\[\]()#+.!-])/g, '$1');

/** kebab-case: lowercase alphanumerics separated by single hyphens (digits allowed). */
export const isKebabCase = (name: string): boolean => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);

export interface DirEntry {
  name: string;
  path: string;
  isDir: boolean;
}

/** List a directory's visible entries (skips dotfiles), sorted by name. */
export const listEntries = (dir: string): DirEntry[] =>
  readdirSync(dir)
    .filter((name) => !name.startsWith('.'))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const path = join(dir, name);
      return { name, path, isDir: statSync(path).isDirectory() };
    });

/**
 * Recursively yield every content directory under `root`, `root` included,
 * skipping IGNORED_DIRS.
 */
export const walkDirs = function* (root: string): Generator<string> {
  yield root;
  for (const entry of listEntries(root)) {
    if (entry.isDir && !IGNORED_DIRS.has(entry.name)) {
      yield* walkDirs(entry.path);
    }
  }
};

/** Recursively yield every `.md` file under `root`, skipping IGNORED_DIRS. */
export const walkMarkdown = function* (root: string): Generator<string> {
  for (const entry of listEntries(root)) {
    if (entry.isDir) {
      if (!IGNORED_DIRS.has(entry.name)) yield* walkMarkdown(entry.path);
    } else if (entry.name.endsWith('.md')) {
      yield entry.path;
    }
  }
};

/** Read and parse a markdown file's frontmatter and body. */
export const readDoc = (path: string): ParsedDoc => parseFrontmatter(readFileSync(path, 'utf8'));

/**
 * Human-facing label for an index entry: a numeric `NN-` prefix becomes
 * `NN · Title` (matching the root README), otherwise the title stands alone.
 */
export const entryLabel = (slug: string, title: string): string => {
  const match = /^(\d+)-/.exec(slug);
  return match ? `${match[1]} · ${title}` : title;
};

/** The slug (name minus any `.md`) used to sort and prefix an entry. */
export const slugOf = (name: string): string => basename(name, '.md');
