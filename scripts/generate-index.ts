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
 *
 * TODO(owner): implement. This is a scaffold stub — it currently exits 0 and does nothing.
 */

const main = async (): Promise<void> => {
  const check = process.argv.includes('--check');
  console.error(`generate-index: not yet implemented (scaffold stub, check=${check})`);
  process.exit(0);
};

void main();
