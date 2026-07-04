# ADR-0005: Live market research stays BYOK — client-side Anthropic web search, no proxy

**Status:** Accepted · **Date:** 2026-07-04

## Context
The `market-research` skill's operating rules require every claim to carry a source and a
disconfirmation pass — that's not achievable from a text-only AI call with no live web access, so
"Run market research" could previously only produce the prompt-copy fallback (ADR-0003), not an
actual sourced brief in-app. Getting real search results requires either a server the user doesn't
own, or a capability tied to a specific provider's key.

## Options considered
1. **Server-side search proxy (shared or project key)** — *Pro:* works regardless of which AI
   provider the user's key is for. *Con:* reintroduces exactly the backend, cost, and data-liability
   surface ADR-0003 ruled out; user research content would transit infrastructure I run.
2. **Ship the methodology only as a standalone Claude skill, no in-app live search** — *Pro:* zero
   app complexity. *Con:* loses the one-click in-app flow; defeats the point of a "Run market
   research" button.
3. **Client-side call to Anthropic's web-search tool, using the user's own Anthropic key (chosen)** —
   when the pasted key is Anthropic's (`sk-ant-…`), the same in-browser API call already used for
   text generation also issues sourced web searches; any other key (e.g. OpenAI) falls back to the
   existing non-search path.

## Decision
Option 3. The methodology is also published standalone as `skills/market-research/SKILL.md` so it's
usable with or without the app, per ADR-0003's "prompts are the product" principle.

## Consequences
- Live, sourced research only works with an **Anthropic** key — OpenAI-keyed users still get an AI
  draft, but without live web search or dated sources. This asymmetry isn't currently called out in
  `docs/SPEC.md` or the README; worth a line there if users hit it as a surprise.
- Search cost is borne entirely by the user's own key, consistent with the zero-hosting-cost
  guarantee in ADR-0003.
- No new infrastructure or data-liability surface was added.

**Update 2026-07-04:** the Anthropic-only asymmetry above is closed — see
[ADR-0007](0007-openai-search-parity.md).
