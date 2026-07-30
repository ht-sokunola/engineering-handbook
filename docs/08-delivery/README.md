---
title: Delivery
summary: CI/CD, environments, deployment strategies, backward compatibility, change and release management.
status: draft
owner: <TEAM_OR_ROLE>
last_reviewed: 2026-07-30
---

# Delivery

## What this covers

How code gets from a merge to production safely: CI/CD pipelines, the environment path,
deployment strategies, backward compatibility, change management, and release management.

## Why it matters

Delivery is where quality either reaches users or fails to. Safe, frequent, reversible
releases are the difference between shipping calmly and firefighting — the same change is
low-risk or high-risk depending almost entirely on how it is delivered.

## How to use this section

Know the [pipeline stages](ci-cd/README.md) and the environment path a change travels.
Pick a [deployment strategy](deployment-strategies/README.md) that matches the risk. Keep
changes [backward compatible](backward-compatibility/README.md) and reversible, and follow
the [change-management](change-management/README.md) process for anything significant.

## Contents

<!-- index:start -->

- [Backward Compatibility](backward-compatibility/README.md) — Overview of backward compatibility: what it covers and what lives inside it.
- [Change Management](change-management/README.md) — Overview of change management: what it covers and what lives inside it.
- [CI CD](ci-cd/README.md) — Overview of ci cd: what it covers and what lives inside it.
- [Deployment Strategies](deployment-strategies/README.md) — Overview of deployment strategies: what it covers and what lives inside it.
- [Environments](environments.md) — Standards and guidance for environments.
- [Release Management](release-management/README.md) — Overview of release management: what it covers and what lives inside it.

<!-- index:end -->
