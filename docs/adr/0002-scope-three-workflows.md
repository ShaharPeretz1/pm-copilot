# ADR-0002: Ship three workflows plus the Radar; cut everything else

**Status:** Accepted · **Date:** 2026-07-01

## Context
The original vision was an all-in-one PM platform (docs, research, prioritization, feedback, roadmaps, integrations). Competitive research (see `docs/research/competitive-review.md`) showed the market's all-in-one attempts feel bloated, and the build budget is one week.

## Options considered
1. **Broad and shallow** — a dozen thin workflows. *Con:* nothing memorable; every feature loses to a dedicated competitor.
2. **Three deep workflows + Radar (chosen)** — PRD Workspace, Market/Competitor Research, Prioritization, plus the staying-current Radar as connective tissue.
   - *Pro:* each flow can carry a visible point of view; buildable in a week; matches the gaps competitors leave (thinking support, evidence discipline, currency).
   - *Con:* users must go elsewhere for feedback management, roadmapping, delivery — accepted, and the Radar deliberately routes them to the right tools.
3. **Single killer flow** — deepest possible PRD tool. *Con:* PRD generation is the most commoditized segment (ChatPRD et al.); insufficient differentiation alone.

## Decision
v1 = PRD Workspace + Research Teardown + Prioritization + Radar. Explicit non-goals: accounts, backend, feedback ingestion, roadmaps, integrations, multi-user.

## Consequences
- The tool is a companion, not a system of record — that's a feature: nothing to migrate, nothing to maintain.
- Cut features are candidates for later versions only if real usage asks for them.
- Scoping rationale is public, demonstrating the prioritization discipline the tool itself promotes.
