---
title: Twelve-Factor App
summary: The twelve-factor methodology for building deployable, disposable, cloud-native services — and where each factor is governed.
status: draft
owner: <TEAM_OR_ROLE>
last_reviewed: 2026-07-30
applies_to: [backend]
---

# Twelve-Factor App

The [twelve-factor methodology](https://12factor.net/) is our default shape for any
long-running, deployable service. It keeps services portable across environments,
disposable, and horizontally scalable — the properties that make continuous delivery and
safe operations possible. This page states each factor as a rule and points to the section
that owns the detail.

## Rules

A service **should** satisfy all twelve factors. Where it cannot, the gap is a documented
exception (see below), not an oversight.

1. **One codebase, many deploys.** One codebase per service, tracked in version control; the same codebase is deployed to every environment. No shared code by copy-paste — extract a library. See [Repositories](../03-development-standards/repositories/README.md).
2. **Explicitly declare dependencies.** Declare and pin every dependency in a manifest; never rely on system-wide packages. See [Dependency Upgrades](../10-governance/dependency-upgrades.md) and [Library Approval](../10-governance/library-approval.md).
3. **Store config in the environment.** Anything that varies between deploys — credentials, endpoints, toggles — comes from the environment, never from committed code. See [Environments](../08-delivery/environments.md) and [Secrets Management](../05-security/secrets-management.md).
4. **Treat backing services as attached resources.** A database, cache, queue, or third-party API is reached by a config-supplied URL and is swappable without a code change. See [Dependency Rules](dependency-rules.md).
5. **Strictly separate build, release, run.** A build produces an immutable artefact; a release binds it to config; run executes the release. Releases are immutable and uniquely identified; you roll back by running a previous release. See [CI/CD](../08-delivery/ci-cd/README.md).
6. **Execute as stateless processes.** Processes are stateless and share nothing; any state that must persist lives in a backing service. Never trust in-process or local-disk state to survive a restart.
7. **Export services via port binding.** A service is self-contained and exposes itself over a bound port; it does not rely on a runtime-injected web server.
8. **Scale out via the process model.** Scale by running more processes, not by growing one. Work partitions across processes; long-running work uses a queue.
9. **Maximise robustness with fast startup and graceful shutdown.** Processes start fast and shut down cleanly on `SIGTERM`, draining in-flight work. Disposability is what makes rapid scaling and deploys safe. See [Deployment Strategies](../08-delivery/deployment-strategies/README.md).
10. **Keep dev, staging, and prod as similar as possible.** Minimise the gaps in time, personnel, and tooling; use the same backing-service types everywhere. See [Environments](../08-delivery/environments.md).
11. **Treat logs as event streams.** Write logs to stdout/stderr as a stream of events; the platform handles routing, aggregation, and retention. See [Logging](../09-operations/observability/logging.md).
12. **Run admin tasks as one-off processes.** Migrations and scripts run as one-off processes against the same release and config as the app, not by hand on a box. See [Runbooks](../09-operations/runbooks.md).

## Rationale

Each factor removes a hidden assumption that makes a service hard to deploy or operate:
local state that does not survive a restart, config baked into an image, a build that
differs from what runs. Together they make a service something the platform can start,
stop, replicate, and move freely — which is the precondition for zero-downtime deploys,
autoscaling, and painless rollback.

## Examples

### Good

```bash
# Config comes from the environment; the same image runs everywhere.
export DATABASE_URL="postgres://…"
export LOG_LEVEL="info"
./service            # logs to stdout, binds its own port, exits cleanly on SIGTERM
```

### Bad

```bash
# Config baked into the build; state and logs written to the local box.
# A different image per environment, logging to a file that dies with the container.
./service --env=prod --config=/etc/app/prod.conf --logfile=/var/log/app.log
```

## Enforcement

- **Config in environment (III):** CI check — a committed-secrets/hardcoded-config scan blocks the merge. See [Secrets Management](../05-security/secrets-management.md).
- **Declared dependencies (II):** CI fails on an unpinned or lockfile-drifting dependency.
- **Build/release/run separation (V):** the pipeline produces one immutable artefact promoted across environments; environment-specific rebuilds are rejected.
- **Logs as streams (XI), port binding (VII), disposability (IX):** verified at service-review time against the [new-service checklist](../12-checklists/new-service.md).
- Remaining factors are **manual — reviewer judgement** during architecture review.
- > **TODO(owner):** confirm which factors are hard CI gates versus review-checklist items in `<CI_PROVIDER>`.

## Exceptions

Some workloads legitimately break a factor — a stateful datastore is not factor VI,
a batch job is not factor VII. Record the deviation and its reason in the service's
[ADR](decision-records/README.md), and confirm nothing downstream assumes the factor holds.
Exceptions are approved by the [architecture board](../02-people-and-responsibilities/architecture-board.md).
