# ADR-0004: The Radar is the centerpiece, delivered as a repo-hosted feed

**Status:** Accepted · **Date:** 2026-07-01

## Context
The single most valuable promise this tool can make is: *the PM using it stays productive and never falls behind* — on new AI tools, new model capabilities, and what the PM community is adopting. Document generation is commoditized; a trustworthy currency layer is not. This also has to work with no backend (ADR-0003) and give people a reason to return weekly.

## Options considered
1. **Static tips baked into the app** — *Con:* stale within a month; staleness destroys the exact trust the feature exists to create.
2. **Automated aggregation (RSS/scraping/LLM summaries)** — *Pro:* low ongoing effort. *Con:* noisy and unvetted; "curated by a PM who filtered the noise for you" is the value; automation is a later enhancement, not a foundation.
3. **Hand-curated JSON feed in the repo, fetched at runtime (chosen)** — a `radar.json` file updated weekly with tagged items (`try now` / `be aware` / `watch`), each with a one-line "why it matters to a PM".
   - *Pro:* content updates without redeploying; the public commit history proves the feed is alive; zero infrastructure.
   - *Con:* weekly manual effort (~1 hour) — accepted; it doubles as the author's own staying-current practice and public evidence of it.

## Decision
Option 3. Additionally, the Radar practices **honest routing**: when another tool does a job better than PM Copilot, the feed says so and links out. Trust is the asset; recommending competitors when warranted is what earns it. Radar items also surface contextually inside workflows where relevant.

## Consequences
- The project has a weekly heartbeat, visible in the commit history — valuable for both users and the portfolio narrative.
- If curation stops, the feature visibly decays; a "last updated" stamp keeps this honest rather than hidden.
- The feed format is simple enough that others could contribute via pull request later.
