# Roadmap

> What's shipped, what's next, and why — kept short enough to stay current. Update at each
> iteration close-out: move shipped items down, re-rank what's next.

## Now

<!-- Actively in flight. -->
- Nothing in flight. Pick the top of "Next".

## Next

<!-- Queued, roughly prioritized. -->
- **Push the curation backlog — the live Radar is a month stale.** Found 2026-08-04: three radar
  commits (Jul 6, Aug 1, Aug 3) plus the persistence/examples work sat unpushed on local `main`,
  so Pages was still serving the 8-item July 4 feed. The weekly curation ritual has no
  "and deploy it" step, and nothing surfaces the gap — the feed's whole promise is freshness, so
  a stale live feed is the one failure that costs credibility. Worth making curation end in a push,
  and worth a staleness check (feed `updatedOn` older than ~10 days → visible note in the app).
- **Smoke-test the OpenAI web-search path against a live `sk-` key.** Still only type-checked
  (ADR-0007). The `/v1/responses` → `message` → `output_text` parse in `ai.tsx` is easy to get
  subtly wrong; verify a "Run market research" brief renders with sources before any demo relies on it.
- **README screenshot (visual).** The README now shows rendered sample output above the fold
  ("See it before you click"), but no actual UI screenshot — worth one image so the *look* of the
  tool lands, not just the artifacts. Needs a browser session to capture; do it next time the
  Chrome extension is connected.

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
- **2026-07-05** — README "See it before you click": rendered sample output (RICE board + teardown
  evidence) above the fold, generated from the built-in example so it matches real product output.
  Carries the "oh, that's useful" without a click. (Visual UI screenshot still pending — see Next.)
- **2026-07-05** — "Load an example" in every workspace. One click seeds a filled, credible artifact
  (PRD, competitive teardown, RICE board) — all around one coherent scenario (adding AI meeting
  summaries to a team-workspace product) so clicking through the nav tells one story. Kills the
  blank-form first-3-minutes problem. Examples live in `src/examples.ts`.
- **2026-07-05** — Work now persists. The workspace mirrors to `localStorage` (survives refresh /
  tab-close) and AI outputs can be saved onto the PRD/research project — so the flagship
  market-research brief no longer vanishes on modal close, and rides along in JSON export. Footer
  copy flipped from warning to reassurance. Client-only, no infra, key still in-memory-only. See
  [ADR-0008](adr/0008-local-persistence.md).
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
