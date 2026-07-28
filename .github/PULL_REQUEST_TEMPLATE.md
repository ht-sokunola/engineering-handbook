<!-- Pull request template for changes to the Engineering Handbook. -->

## What does this change?

<!-- One or two sentences. Which page(s) or section(s)? -->

## Type of change

- [ ] Typo / formatting / broken link (fast path)
- [ ] Clarification of an existing standard
- [ ] New or materially changed standard (requires an RFC — link it below)
- [ ] Tooling / CI

## Related

- RFC / issue: <!-- link, or "n/a" -->

## Checklist

- [ ] `pnpm lint:md` passes
- [ ] `pnpm lint:links` passes
- [ ] `pnpm validate` passes
- [ ] `pnpm index --check` passes (indexes regenerated if I added/renamed pages)
- [ ] Frontmatter is complete and `title` matches the H1
- [ ] Every new fabricated-value risk is a `<PLACEHOLDER>` plus a TODO, not a guess
