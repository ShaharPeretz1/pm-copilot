# The PM Copilot Playbook

*The product thinking behind the tool — for anyone who wants the reasoning, not just the features.*

## Why this exists

PM Copilot started from a simple observation: the market for AI-PM tools splits into document generators that know nothing about your market, and feedback platforms that can't help you think. (The full analysis is in [competitive-review.md](research/competitive-review.md).) Meanwhile the most common anxiety among working PMs isn't writing documents — it's keeping up: with AI tools, with new capabilities, with what strong product teams are quietly adopting.

So this tool makes a different promise: **you stay productive and you don't fall behind.** Everything else follows from that.

## The heuristics encoded in each workflow

The tool never lectures — but every structure carries opinions. Here they are, stated plainly.

**PRD.** A problem statement is evidence plus frequency plus a name, not a narrative. One primary metric with a target and timeframe, always paired with a guardrail — because every metric can look good while the product gets worse. Scope is a cut-line (In / Out / Later), each with one reason, because scope defined by enthusiasm gets renegotiated weekly. The riskiest assumption gets named first, with its cheapest test. The "Angles" in each section are the questions strong reviewers actually ask: *what number would make you kill this post-launch? Who is explicitly not served by v1?*

**Research.** A teardown starts with the decision the research serves — research without a decision attached is a hobby. Every claim carries a source URL; the interface flags unsourced claims as hypotheses rather than blocking them, because discipline should be visible, not bureaucratic. The research-plan prompt always asks for disconfirming evidence — what finding would change the conclusion — because research that can only confirm is advocacy.

**Prioritization.** Scores are only as good as their weakest input, so every row has a "based on what?" field sitting next to the numbers. The scale hints bake in the classic failure modes: confidence below 0.5 means go learn, not go build; reach comes from data, not vibes; effort estimates are asked of the team, not guessed. The pressure-test prompt attacks the number with the least evidence first — the same thing a good VP does in the room.

**Radar.** Hand-curated, not scraped, because the value is the filtering. Three tags only: *try now* (worth an hour this week), *be aware* (know it exists, your team will mention it), *watch* (moving, not ripe). It routes honestly — when another tool does a job better, it says so, because a recommendation engine that never points away from itself is an ad.

## How the AI is designed

Three decisions shaped the AI layer, all documented as ADRs:

1. **The AI is a colleague, not an oracle** ([ADR-0001](adr/0001-peer-not-teacher.md)). Every prompt instructs: terse, specific, no praise padding, no explaining PM concepts. The review prompts end with "the one question you'd ask" — because a colleague's judgment shows in what they'd ask, not what they'd list.
2. **The prompts are the product** ([ADR-0003](adr/0003-no-backend-byok.md)). With no API key, every AI button copies its full prompt for use in any chat. The prompt engineering is visible, inspectable, and useful standalone — nothing is hidden behind a server.
3. **The AI is forbidden from inventing facts.** The research prompt states it explicitly: where a claim is needed, say what to verify and how. Confident hallucination is the most-reported failure of AI PM tools; the mitigation is instruction plus structure (source-URL fields), not hope.

## What was deliberately cut

No accounts, no backend, no data storage, no feedback ingestion, no roadmaps, no integrations ([ADR-0002](adr/0002-scope-three-workflows.md)). Partly for the one-week build budget, mostly on principle: the market's all-in-one tools are its most resented ones. This tool is a companion, not a system of record — there is nothing to migrate into it and nothing trapped inside it.

## Using it well

Start with the Radar once a week — that's its cadence. Use the PRD workspace when the doc matters and open the Angles when a section feels finished (that's when they're most useful). Run the pressure-test before the prioritization meeting, not after. And export your workspace when you close the tab — the tool keeps nothing, by design.
