# ADR-0006: Radar curation becomes a written skill with an explicit triviality bar

**Status:** Accepted · **Date:** 2026-07-04

## Context
ADR-0004 established the Radar as a hand-curated `radar.json`, updated weekly, and named the value
as "curated by a PM who filtered the noise for you" — but never wrote down *how* to filter. That
left the actual quality bar as tacit judgment, redone from scratch each week, with no way for
anyone (including an AI assistant) to run the curation consistently.

## Options considered
1. **Keep curating ad hoc, no written bar (status quo)** — *Con:* quality depends entirely on
   whoever curates that week remembering the standard; nothing to check a candidate item against;
   not reproducible.
2. **Automated aggregation (RSS/scraping/LLM summaries)** — already rejected in ADR-0004 for the
   same reason: noisy and unvetted, and the filtering *is* the value being sold.
3. **Codify curation as a repeatable skill with a written triviality bar (chosen)** — a fixed,
   signal-ranked source list (Lenny's Newsletter, How I AI, Aakash Gupta, Teresa Torres, plus a
   secondary HN/Product Hunt/Anthropic-OpenAI-blog sweep) and four qualifying tests (practice-not-
   product, capability shift, quiet adoption, skill migration) that a candidate item must pass at
   least one of.

## Decision
Option 3, shipped as `skills/radar-curation/SKILL.md`. First application replaced the original
seed feed with 8 items sourced from the ranked list, each tagged and mapped to app contexts
(`prd`/`research`/`prioritize`/`radar`). Feed hygiene rules travel with it: 2–4 new items/week
(never padded to hit a count), cap ~15 items, retire the oldest or least durable first.

## Consequences
- Curation is now reproducible by anyone — or any AI — reading the skill, not knowledge that lives
  only in the founder's head.
- The triviality bar is the main defense of the Radar's core promise from ADR-0004 ("you will not
  fall behind" only holds if every item clears a real bar). If the feed ever drifts toward generic
  tips, tighten this bar rather than relax it.
- The skill hard-codes today's leading PM-thought-leadership sources; revisit the source list if any
  go quiet or a new one becomes clearly higher-signal.
