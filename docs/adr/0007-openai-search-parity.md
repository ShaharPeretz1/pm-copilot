# ADR-0007: OpenAI reaches web-search parity via the Responses API

**Status:** Accepted · **Date:** 2026-07-04

## Context
ADR-0005 shipped live market research for Anthropic keys only and flagged the asymmetry as a
known rough edge: OpenAI-keyed users got the non-search fallback. OpenAI's Chat Completions
endpoint (already used for the non-search OpenAI path) only gets search via dedicated
`*-search-preview` / `-search-api` models that search on *every* call — unsuitable here, since
`callAi` is shared by non-search actions (PRD review, prioritization pressure-test, etc.) where
search would be wasted cost and latency. OpenAI's Responses API supports `web_search` as an
optional tool, matching how the Anthropic branch already makes search opt-in per call.

## Options considered
1. **Switch all OpenAI calls to a search-preview model on Chat Completions** — *Con:* forces every
   OpenAI-backed AI action to search, not just the market-research flow; higher latency/cost for
   no benefit on non-search actions.
2. **Leave OpenAI on the non-search fallback, document the asymmetry (status quo since ADR-0005)**
   — *Con:* leaves the gap ADR-0005 already called out as worth fixing; OpenAI users get a lesser
   market-research experience with no path to parity.
3. **Add an OpenAI Responses API branch, used only when `webSearch` is requested (chosen)** — same
   shape as the Anthropic branch: tool included conditionally, everything else (model, endpoint)
   unchanged for non-search calls.

## Decision
Option 3. When `webSearch` is true and the key isn't Anthropic's, `callAi` calls
`POST /v1/responses` with `model: "gpt-4.1-mini"` and `tools: [{ type: "web_search",
search_context_size: "medium" }]`, and extracts `output_text` content from the `message` item in
the response's `output` array. `gpt-4o-mini` doesn't support the `web_search` tool, so the model
changes only for this path — non-search OpenAI calls are untouched and still use Chat Completions.

## Consequences
- Market research now runs live, sourced search on **either** provider's key — the asymmetry
  ADR-0005 flagged is closed.
- OpenAI search runs on `gpt-4.1-mini` rather than `gpt-4o-mini`; if OpenAI's supported-model list
  for `web_search` changes, this needs revisiting.
- Not yet runtime-verified against a live OpenAI key (type-checked and built clean only) — worth a
  real smoke test with a key before relying on it for a demo.
- `docs/roadmap.md`'s "Later/maybe" item for this is now moved to "Recently shipped."
