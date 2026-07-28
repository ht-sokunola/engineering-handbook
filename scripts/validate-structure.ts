/**
 * validate-structure.ts
 *
 * Validates the handbook tree against the structural rules in HANDOFF.md §5.
 * Run with: pnpm validate  (tsx scripts/validate-structure.ts)
 *
 * TODO(owner): implement the checks below. This is a scaffold stub — it currently
 * exits 0 without validating. Each rule must fail with a clear per-violation message.
 *
 * Rules to enforce:
 *   1. A folder has no README.md.
 *   2. A folder contains only a README.md and no other children (make it a leaf file).
 *   3. A markdown file is missing frontmatter, or missing a required key.
 *   4. `title` frontmatter does not match the file's H1.
 *   5. A file or folder name is not kebab-case.
 *   6. A relative link points at a non-existent path.
 *   7. A top-level folder is not `NN-` prefixed, or numbering has gaps or duplicates.
 */

const main = async (): Promise<void> => {
  console.error('validate-structure: not yet implemented (scaffold stub)');
  process.exit(0);
};

void main();
