/**
 * generate-index.ts
 *
 * Walks docs/ and, for each README.md, rewrites the region between
 * `<!-- index:start -->` and `<!-- index:end -->` with a linked list of that
 * folder's children (using each child's `title` and `summary` frontmatter).
 * Also regenerates the master index in the root README.md.
 *
 * Run with: pnpm index            (rewrite in place)
 *           pnpm index --check    (exit non-zero if regeneration would change anything)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import {
  DOCS_DIR,
  IGNORED_DIRS,
  INDEX_END,
  INDEX_START,
  REPO_ROOT,
  entryLabel,
  listEntries,
  readDoc,
  slugOf,
  walkDirs,
} from './lib.ts';

const rel = (path: string): string => relative(REPO_ROOT, path) || '.';

interface IndexTarget {
  /** The README file whose index region is rewritten. */
  file: string;
  /** The folder whose children are indexed. */
  dir: string;
  /** Path prefix prepended to each child link (docs/ for the root README). */
  linkPrefix: string;
}

interface ChildEntry {
  slug: string;
  label: string;
  link: string;
  summary: string;
}

const collectTargets = (): IndexTarget[] => {
  const targets: IndexTarget[] = [
    { file: join(REPO_ROOT, 'README.md'), dir: DOCS_DIR, linkPrefix: 'docs/' },
  ];
  for (const dir of walkDirs(DOCS_DIR)) {
    if (dir === DOCS_DIR) continue; // the docs/ container is indexed by the root README above
    targets.push({ file: join(dir, 'README.md'), dir, linkPrefix: '' });
  }
  return targets;
};

/** Build the sorted child entries for a folder's generated index. */
const collectChildren = (dir: string, linkPrefix: string): ChildEntry[] => {
  const entries: ChildEntry[] = [];
  for (const entry of listEntries(dir)) {
    if (entry.isDir) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const readme = join(entry.path, 'README.md');
      const { title, summary } = docMeta(readme, entry.name);
      entries.push({
        slug: entry.name,
        label: entryLabel(entry.name, title),
        link: `${linkPrefix}${entry.name}/README.md`,
        summary,
      });
    } else {
      if (entry.name === 'README.md' || !entry.name.endsWith('.md')) continue;
      const slug = slugOf(entry.name);
      const { title, summary } = docMeta(entry.path, slug);
      entries.push({
        slug,
        label: entryLabel(slug, title),
        link: `${linkPrefix}${entry.name}`,
        summary,
      });
    }
  }
  return entries.sort((a, b) => a.slug.localeCompare(b.slug));
};

const docMeta = (file: string, fallback: string): { title: string; summary: string } => {
  const { data } = readDoc(file);
  const title = typeof data.title === 'string' && data.title.trim() !== '' ? data.title.trim() : fallback;
  const summary = typeof data.summary === 'string' ? data.summary.trim() : '';
  return { title, summary };
};

const renderList = (entries: ChildEntry[]): string => {
  if (entries.length === 0) return '_No pages yet._';
  return entries
    .map((e) => (e.summary ? `- [${e.label}](${e.link}) — ${e.summary}` : `- [${e.label}](${e.link})`))
    .join('\n');
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Splice a freshly rendered list into a README's index region; null if no markers. */
const rewriteRegion = (content: string, list: string): string | null => {
  const region = new RegExp(`${escapeRegExp(INDEX_START)}[\\s\\S]*?${escapeRegExp(INDEX_END)}`);
  if (!region.test(content)) return null;
  return content.replace(region, `${INDEX_START}\n\n${list}\n\n${INDEX_END}`);
};

const main = async (): Promise<void> => {
  const check = process.argv.includes('--check');
  const changed: string[] = [];
  const skipped: string[] = [];

  for (const target of collectTargets()) {
    let current: string;
    try {
      current = readFileSync(target.file, 'utf8');
    } catch {
      skipped.push(`${rel(target.file)} (no README.md)`);
      continue;
    }
    const list = renderList(collectChildren(target.dir, target.linkPrefix));
    const next = rewriteRegion(current, list);
    if (next === null) {
      skipped.push(`${rel(target.file)} (no index markers)`);
      continue;
    }
    if (next !== current) {
      changed.push(rel(target.file));
      if (!check) writeFileSync(target.file, next);
    }
  }

  if (skipped.length > 0) {
    console.error(`generate-index: skipped ${skipped.length} target(s):`);
    for (const s of skipped) console.error(`  ${s}`);
  }

  if (check) {
    if (changed.length > 0) {
      console.error(`✖ generate-index --check: ${changed.length} index(es) out of date:`);
      for (const c of changed) console.error(`  ${c}`);
      console.error('\nRun `pnpm index` to regenerate.');
      process.exit(1);
    }
    console.log('✓ generate-index --check: all indexes current');
    return;
  }

  console.log(
    changed.length > 0
      ? `✓ generate-index: rewrote ${changed.length} index(es)`
      : '✓ generate-index: no changes needed',
  );
};

void main();
