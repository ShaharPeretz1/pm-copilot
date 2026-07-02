# PM Copilot — Product Spec (v2)
*Personal project by Shahar Peretz · target: ship v1 in ~1 week*

## Purpose
A free tool that makes PMs — junior or senior — more productive, and quietly makes them better. It's a smart contributor sitting next to you: it structures your work, offers ideas and directions you might not have considered, and covers your back on staying current with the AI tools and practices the best PMs are using.

Two audiences, one build: PMs who use it in their daily work, and hiring teams who see how its creator thinks about the PM role.

## Core belief
The scarcest PM resource is attention. Every feature exists to answer one question: **does this let the PM produce better work in less time?** Not teaching, not lecturing — contributing.

## Tone principle (applies everywhere)
Peer, not professor. The tool never explains what a PRD is. It assumes competence and adds leverage: structure, suggestions, alternative angles, sharper questions. A senior PM should feel accelerated; a junior PM should feel like they're working the way seniors work — and absorb better practices by osmosis, not lessons.

## Features

### 1. The Radar (centerpiece)
The promise: *"You will not fall behind. This tool covers you."*

- **Curated feed** of new AI tools, model capabilities, and what the PM community is talking about — hand-maintained, updated weekly, each item tagged: `try now` / `be aware` / `watch`.
- **Honest routing:** when another tool does a job better, the Radar says so and links it. Credibility comes from pushing people *away* when warranted.
- **Contextual surfacing:** while you work a flow, relevant items appear ("prototyping this? v0/Lovable now generate working UIs from PRDs").
- **"The current PM stack"** — a living snapshot of what strong PM teams actually use across research, docs, analytics, prototyping.
- Feed ships as JSON fetched from this repo's raw URL — content updates weekly without redeploying the app.

### 2. PRD Workspace
- Generates the document structure; each section carries inline **suggestions on what to cover and directions to explore** — prompts for thinking, not explanations.
- "Angles" button per section: alternative framings, adjacent ideas, inspiration (e.g., for Success Metrics: leading vs. lagging options, counter-metrics, guardrails).
- AI pass reviews the full draft as a sharp colleague: gaps, untested assumptions, missing edge cases. Terse, actionable notes — no lectures.
- Markdown export.

### 3. Market & Competitor Research
- Structured teardown canvas: positioning, pricing, target user, strengths/gaps, evidence.
- AI contributes research directions and probing questions; claim fields ask for a source link — discipline through structure, not nagging.
- Output: comparison matrix + summary brief.

### 4. Prioritization Workspace
- RICE/ICE scoring, clean ranked table with reasoning captured inline.
- AI pressure-tests scores and surfaces trade-offs between top items — a colleague asking "what's Reach based on?", not a tutorial on RICE.
- Export ranked table.

## Architecture
- Single-page React app, Tailwind, no backend. Free hosting (Vercel/GitHub Pages).
- **BYOK AI layer:** paste your Claude/OpenAI key (memory only, never stored/sent anywhere else). Without a key, every AI action produces the crafted expert prompt to copy into any chat — the tool is fully usable with zero setup.
- All work in-memory + JSON export/import. No accounts, no data liability.
- Radar feed: `radar.json` in this repo, fetched at runtime.

## Documentation standard
Everything decided about this project is recorded as ADRs in `docs/adr/`, written to be understood by non-technical readers: context, options considered, trade-offs, decision, consequences. The repo itself demonstrates PM-grade decision hygiene.

## Week plan
| Day | Deliverable |
|---|---|
| 1 | Skeleton, navigation, design system, data model, ADRs |
| 2–3 | PRD Workspace (deepest flow) |
| 4 | Prioritization Workspace |
| 5 | Research teardown |
| 6 | Radar (feed + contextual surfacing), BYOK layer, export, polish |
| 7 | Playbook, deploy, LinkedIn post |

## Out of scope (v1)
Accounts, backend, feedback ingestion, roadmaps, integrations, multi-user. Deliberate cuts, documented in ADR-0002.

## Success criteria
- A PM with zero setup gets value in the first 3 minutes.
- The Radar alone is a reason to return weekly.
- Demo-able in under 3 minutes; every decision traceable in the ADRs.
