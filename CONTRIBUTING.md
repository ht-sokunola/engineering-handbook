# Contributing to the Engineering Handbook

This handbook is a living document owned by all of engineering. This page covers
how to propose a change, the conventions every page follows, and which changes
are lightweight versus which need an RFC.

## The structural rule

Read it once and keep it: a topic **with sub-topics is a folder** containing a
`README.md` preface; a topic **with no sub-topics is a single markdown file**.
The preface introduces the area in prose and ends with a generated index of its
children. Nesting is unbounded and follows the same rule at every level.

- If a leaf page grows sub-topics, promote it to a folder with a `README.md` and
  move the sub-topics in as children.
- If a folder only holds one real page, collapse it back into a leaf file.

## File conventions

- **Naming:** `kebab-case` for every file and folder. Never spaces, never
  `PascalCase`. Top-level sections are `NN-` numbered to fix ordering; nested
  folders are alphabetical unless a sequence is meaningful (then number them too).
- **One `README.md` per folder.** No `index.md`, no `_index.md`.
- **Frontmatter** starts every markdown file, including prefaces:

  ```yaml
  ---
  title: Commit Standards
  summary: How we write commit messages and what the tooling enforces.
  status: draft            # draft | review | adopted
  owner: <TEAM_OR_ROLE>
  last_reviewed: 2026-07-28
  applies_to: [backend, frontend]   # omit if universal
  ---
  ```

- **One `#` H1 per file**, matching `title` exactly (the validator checks this).
- **Relative links only**, always including the `.md` extension. Link to a folder
  through its `README.md`.
- **Code fences carry a language tag** (`ts`, `go`, `csharp`, `bash`, `yaml`,
  `sql`, `json`, `mermaid`). Diagrams are Mermaid in fenced blocks.
- Prefer tables for rule/rationale pairs and bullets for enumerations. Avoid
  walls of prose longer than ~5 sentences.

### Page shapes

Leaf pages use: H1 → one-line statement → `Rules` → `Rationale` → `Examples`
(Good/Bad) → `Enforcement` → `Exceptions`. Not every page needs every section,
but **`Rules` and `Enforcement` are mandatory** for any page under
`03-development-standards/`, `04-architecture/`, or `05-security/`.

Prefaces use: H1 → `What this covers` → `Why it matters` → `How to use this
section` → `Contents` (generated between the `<!-- index:start -->` /
`<!-- index:end -->` markers — do not hand-edit).

## Don't invent company facts

Never guess team names, SLAs, tool choices, coverage numbers, escalation paths,
or licence allowlists. Where a real value is required, emit a placeholder and a
TODO:

```md
> **TODO(owner):** confirm the review SLA. Placeholder: `<REVIEW_SLA>`.
```

Use these placeholders consistently: `<COMPANY>`, `<COMPANY_DOMAIN>`, `<ENG_ORG>`,
`<DEFAULT_BRANCH>`, `<CI_PROVIDER>`, `<CLOUD_PROVIDER>`.

## Proposing a change

1. **Open an issue** using the *Handbook change* template, or go straight to a PR
   for small fixes.
2. **Make the change on a branch**, keeping frontmatter complete and `title` in
   sync with the H1.
3. **Run the tooling locally** before pushing:

   ```bash
   pnpm lint:md && pnpm lint:links && pnpm validate && pnpm index --check
   ```

   If you added or renamed pages, run `pnpm index` to regenerate the affected
   indexes and commit the result.
4. **Open a PR** using the template. CI runs the same checks.
5. **Get review** from the owning team (see [`CODEOWNERS`](CODEOWNERS)).

Use [Conventional Commits](https://www.conventionalcommits.org/): `docs:` for
content, `chore:` for tooling and config, `feat:` for new scripts.

## Which review path?

| Change | Path | Approval |
| --- | --- | --- |
| Typo, formatting, broken link | Fast path — single reviewer | Any handbook maintainer |
| Clarifying existing wording without changing intent | Standard PR | Owning team (CODEOWNERS) |
| New standard, or a change to what a standard *requires* | **RFC first**, then PR | Owning team + affected teams |

### When an RFC is required

A handbook change needs an RFC before the PR when it:

- introduces a new rule engineers must follow, or removes/weakens an existing one;
- changes an enforced threshold (coverage target, complexity limit, SLA);
- affects more than one discipline (e.g. a rule touching both backend and frontend); or
- has a rollout or migration cost for existing repositories.

Draft the RFC from [`docs/11-templates/rfc.md`](docs/11-templates/rfc.md) and
follow the process in
[`docs/08-delivery/change-management/rfc-process.md`](docs/08-delivery/change-management/rfc-process.md).

> **TODO(owner):** confirm where RFCs live and who forms the approving group
> (architecture board? engineering leadership?). Placeholders: `<ENG_ORG>`.
