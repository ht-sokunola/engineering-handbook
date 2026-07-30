---
title: Architecture
summary: Architectural styles, dependency rules, decision records, diagrams, API and database standards.
status: draft
owner: <TEAM_OR_ROLE>
last_reviewed: 2026-07-30
---

# Architecture

## What this covers

How we shape systems: the architectural styles and when each one fits, the dependency
rules that keep layers pointing the right way, decision records, diagramming conventions,
and the standards for the APIs and databases that others integrate with.

## Why it matters

Architecture is the set of decisions that are expensive to reverse. Getting boundaries,
dependencies, and contracts right early is what avoids the rewrite later — and a bad
contract, once other teams depend on it, is far harder to change than the code behind it.

## How to use this section

Choose a [style](styles/README.md) deliberately rather than by default. Keep
[dependencies](dependency-rules.md) pointing inward. Record significant or hard-to-reverse
choices as [ADRs](decision-records/README.md). Follow the
[API](api-standards/README.md) and [database](database-standards/README.md) standards for
anything with consumers beyond your own service.

## Contents

<!-- index:start -->

- [API Standards](api-standards/README.md) — Overview of api standards: what it covers and what lives inside it.
- [Database Standards](database-standards/README.md) — Overview of database standards: what it covers and what lives inside it.
- [Decision Records](decision-records/README.md) — Overview of decision records: what it covers and what lives inside it.
- [Dependency Rules](dependency-rules.md) — Standards and guidance for dependency rules.
- [Diagrams](diagrams/README.md) — Overview of diagrams: what it covers and what lives inside it.
- [Styles](styles/README.md) — Overview of styles: what it covers and what lives inside it.

<!-- index:end -->
