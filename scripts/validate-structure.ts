/**
 * validate-structure.ts
 *
 * Validates the handbook tree against the structural rules in HANDOFF.md §5.
 * Run with: pnpm validate  (tsx scripts/validate-structure.ts)
 *
 * Rules enforced (each failure prints a `path: message` line):
 *   1. Every folder has a README.md.
 *   2. A folder holding only a README.md should be a leaf file instead.
 *   3. Every markdown file has frontmatter with all required keys.
 *   4. `title` frontmatter matches the file's H1.
 *   5. Every file/folder name is kebab-case (README.md excepted).
 *   6. Every relative link resolves to an existing path.
 *   7. Top-level folders are `NN-` prefixed with contiguous, unique numbering.
 */

import { existsSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import {
  DOCS_DIR,
  IGNORED_DIRS,
  REPO_ROOT,
  REQUIRED_KEYS,
  isKebabCase,
  listEntries,
  readDoc,
  readH1,
  slugOf,
  walkDirs,
  walkMarkdown,
} from './lib.ts';

const rel = (path: string): string => relative(REPO_ROOT, path) || '.';

const violations: string[] = [];
const report = (path: string, message: string): void => {
  violations.push(`${rel(path)}: ${message}`);
};

/** Rules 1 & 2: every folder has a README, and no folder is a README-only leaf. */
const checkFolders = (): void => {
  for (const dir of walkDirs(DOCS_DIR)) {
    if (dir === DOCS_DIR) continue; // docs/ is the container; its preface is the root README.md
    const entries = listEntries(dir).filter((e) => !(e.isDir && IGNORED_DIRS.has(e.name)));
    const hasReadme = entries.some((e) => !e.isDir && e.name === 'README.md');
    if (!hasReadme) {
      report(dir, 'folder has no README.md (rule 1)');
      continue;
    }
    const others = entries.filter((e) => !(e.name === 'README.md' && !e.isDir));
    if (others.length === 0) {
      report(dir, 'folder contains only a README.md — make it a leaf .md file instead (rule 2)');
    }
  }
};

/** Rules 3 & 4: frontmatter completeness, and title/H1 agreement. */
const checkFrontmatter = (): void => {
  for (const file of walkMarkdown(DOCS_DIR)) {
    const { hasFrontmatter, data, body } = readDoc(file);
    if (!hasFrontmatter) {
      report(file, 'missing frontmatter block (rule 3)');
      continue;
    }
    const missing = REQUIRED_KEYS.filter((key) => {
      const value = data[key];
      return value === undefined || (typeof value === 'string' && value.trim() === '');
    });
    if (missing.length > 0) {
      report(file, `frontmatter missing required key(s): ${missing.join(', ')} (rule 3)`);
    }
    const title = data.title;
    const h1 = readH1(body);
    if (typeof title === 'string' && title.trim() !== '') {
      if (h1 === null) {
        report(file, 'no H1 heading found to match `title` (rule 4)');
      } else if (h1.trim() !== title.trim()) {
        report(file, `H1 "${h1}" does not match title "${title}" (rule 4)`);
      }
    }
  }
};

/** Rule 5: kebab-case names for every folder and file (README.md excepted). */
const checkNames = (): void => {
  for (const dir of walkDirs(DOCS_DIR)) {
    for (const entry of listEntries(dir)) {
      if (entry.isDir && IGNORED_DIRS.has(entry.name)) continue;
      if (!entry.isDir && entry.name === 'README.md') continue;
      const slug = entry.isDir ? entry.name : slugOf(entry.name);
      if (!entry.isDir && !entry.name.endsWith('.md')) continue;
      if (!isKebabCase(slug)) {
        report(entry.path, `name "${entry.name}" is not kebab-case (rule 5)`);
      }
    }
  }
};

/** Rule 6: every relative markdown link resolves to a file/folder that exists. */
const checkLinks = (): void => {
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
  for (const file of walkMarkdown(DOCS_DIR)) {
    const { body } = readDoc(file);
    const dir = join(file, '..');
    for (const match of body.matchAll(linkPattern)) {
      const raw = match[1].trim().split(/\s+/)[0];
      if (!isRelativeLink(raw)) continue;
      const target = raw.split('#')[0];
      if (target === '') continue;
      const resolved = resolve(dir, decodeURI(target));
      if (!existsSync(resolved)) {
        report(file, `relative link "${raw}" points at a missing path (rule 6)`);
      }
    }
  }
};

const isRelativeLink = (target: string): boolean =>
  target !== '' &&
  !target.startsWith('#') &&
  !target.startsWith('//') &&
  !/^[a-z][a-z0-9+.-]*:/i.test(target);

/** Rule 7: docs/ top-level folders are `NN-` prefixed, numbered 01..N with no gaps or dupes. */
const checkTopLevelNumbering = (): void => {
  const seen = new Map<number, string>();
  for (const entry of listEntries(DOCS_DIR)) {
    if (!entry.isDir || IGNORED_DIRS.has(entry.name)) continue;
    const match = /^(\d+)-[a-z0-9-]+$/.exec(entry.name);
    if (!match) {
      report(entry.path, `top-level folder "${entry.name}" must be NN-prefixed (rule 7)`);
      continue;
    }
    const num = Number(match[1]);
    const existing = seen.get(num);
    if (existing !== undefined) {
      report(entry.path, `duplicate top-level number ${match[1]} (also "${existing}") (rule 7)`);
    } else {
      seen.set(num, entry.name);
    }
  }
  const numbers = [...seen.keys()].sort((a, b) => a - b);
  numbers.forEach((num, index) => {
    const expected = index + 1;
    if (num !== expected) {
      report(DOCS_DIR, `top-level numbering gap: expected ${pad(expected)}, found ${pad(num)} (rule 7)`);
    }
  });
};

const pad = (n: number): string => String(n).padStart(2, '0');

const main = async (): Promise<void> => {
  if (!existsSync(DOCS_DIR) || !statSync(DOCS_DIR).isDirectory()) {
    console.error(`validate-structure: docs directory not found at ${rel(DOCS_DIR)}`);
    process.exit(1);
  }
  checkFolders();
  checkFrontmatter();
  checkNames();
  checkLinks();
  checkTopLevelNumbering();

  if (violations.length > 0) {
    console.error(`✖ validate-structure: ${violations.length} violation(s)\n`);
    for (const v of violations.sort()) console.error(`  ${v}`);
    process.exit(1);
  }
  console.log('✓ validate-structure: all structural rules pass');
};

void main();
