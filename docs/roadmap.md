# Roadmap

> What's shipped, what's next, and why — kept short enough to stay current. Update at each
> iteration close-out: move shipped items down, re-rank what's next.

## Now

<!-- Fill in what you're actively working on next. Nothing captured yet as of this close-out —
this file didn't exist before 2026-07-04, so "Now" is genuinely open. -->
-

## Next

<!-- Queued, roughly prioritized. -->
-

## Later / maybe

<!-- Deliberately deferred, not forgotten. Pulled from docs/SPEC.md "Out of scope (v1)" and
docs/PLAYBOOK.md "What was deliberately cut" — revisit only if the reasons in ADR-0002 change. -->
- Accounts / auth
- Backend / server-side persistence
- Feedback ingestion
- Roadmaps feature (product-facing, i.e. a roadmap tool *inside* PM Copilot)
- Third-party integrations
- Multi-user / team features

## Recently shipped

<!-- Newest first. -->
- **2026-07-04** — OpenAI reaches web-search parity with Anthropic for market research, via the
  Responses API `web_search` tool (`gpt-4.1-mini`). Closes the asymmetry ADR-0005 flagged. See
  [ADR-0007](adr/0007-openai-search-parity.md). Not yet smoke-tested against a live OpenAI key.
- **2026-07-04** — Radar curation formalized as a weekly skill (`skills/radar-curation/SKILL.md`)
  with an explicit triviality bar; seed feed replaced with 8 practitioner-sourced items. See
  [ADR-0006](adr/0006-radar-curation-skill.md).
- **2026-07-04** — Live market research via Anthropic web search, in-app, when an Anthropic key is
  present; methodology also published as `skills/market-research/SKILL.md`. See
  [ADR-0005](adr/0005-live-search-stays-byok.md).
- **2026-07-01 to 2026-07-04** — v1 shipped: Day-1 skeleton, PRD Workspace, Prioritization
  Workspace, Research teardowns, Radar (seed feed + contextual surfacing), BYOK AI layer, Playbook,
  GitHub Pages deploy. See [SPEC.md](SPEC.md) and [ADRs 0001–0004](adr/).
