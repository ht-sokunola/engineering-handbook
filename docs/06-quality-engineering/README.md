---
title: Quality Engineering
summary: Testing, regression, performance testing, and accessibility.
status: draft
owner: <TEAM_OR_ROLE>
last_reviewed: 2026-07-30
---

# Quality Engineering

## What this covers

How we know the software works and keeps working: the testing pyramid, regression
protection for critical journeys, performance testing, and accessibility.

## Why it matters

Tests are how we change code quickly without fear. Where quality coverage is thin, the
gaps resurface as production incidents, slow and nervous releases, and eroded confidence
in the codebase.

## How to use this section

Write tests at the right level — mostly [unit](testing/unit.md), fewer as you climb the
pyramid. Protect [critical user journeys](regression/critical-user-journeys.md) from
regression. Meet the [accessibility](accessibility/README.md) bar for anything a user
touches.

## Contents

<!-- index:start -->

- [Accessibility](accessibility/README.md) — Overview of accessibility: what it covers and what lives inside it.
- [Performance Testing](performance-testing.md) — Standards and guidance for performance testing.
- [Regression](regression/README.md) — Overview of regression: what it covers and what lives inside it.
- [Testing](testing/README.md) — Overview of testing: what it covers and what lives inside it.

<!-- index:end -->
