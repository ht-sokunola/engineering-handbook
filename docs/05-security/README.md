---
title: Security
summary: Secure coding, secrets, auth, encryption, scanning, and threat modelling.
status: draft
owner: <TEAM_OR_ROLE>
last_reviewed: 2026-07-30
---

# Security

## What this covers

How we keep systems and data safe: secure coding, secrets handling, authentication and
authorisation, encryption, dependency and container scanning, threat modelling, and
vulnerability management.

## Why it matters

A single security failure can cost more than every efficiency gain combined — breached
data, downtime, regulatory penalty, and trust that does not come back. Security is a
property you design in from the start, not a layer you add before launch.

## How to use this section

Apply the [secure-coding](secure-coding.md) rules as you write. Never commit secrets —
use [managed secrets](secrets-management.md). [Threat-model](threat-modelling.md) anything
that handles sensitive data or is exposed to the internet. Treat scanner findings as work
to schedule, not noise to mute.

## Contents

<!-- index:start -->

- [Authentication](authentication/README.md) — Overview of authentication: what it covers and what lives inside it.
- [Authorisation and RBAC](authorisation-and-rbac.md) — Standards and guidance for authorisation and rbac.
- [Dependency and Container Scanning](dependency-and-container-scanning.md) — Standards and guidance for dependency and container scanning.
- [Encryption](encryption.md) — Standards and guidance for encryption.
- [OWASP](owasp.md) — Standards and guidance for owasp.
- [Secrets Management](secrets-management.md) — Standards and guidance for secrets management.
- [Secure Coding](secure-coding.md) — Standards and guidance for secure coding.
- [Threat Modelling](threat-modelling.md) — Standards and guidance for threat modelling.
- [Vulnerability Management](vulnerability-management.md) — Standards and guidance for vulnerability management.

<!-- index:end -->
