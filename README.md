# PM Copilot

**A smart contributor for product managers — structure your work, sharpen your thinking, never fall behind.**

PM Copilot is a free, no-signup tool for PMs at any level. It doesn't teach you product management — it works alongside you:

- **The Radar** — a hand-curated, weekly-updated feed of new AI tools, model capabilities, and what the PM community is adopting. Tagged `try now` / `be aware` / `watch`, with honest routing: when another tool does the job better, the Radar says so.
- **PRD Workspace** — document structure with inline suggestions and alternative angles per section, plus an AI review pass that reads your draft like a sharp colleague.
- **Market & Competitor Research** — structured teardown canvas with evidence discipline built in. With an Anthropic API key, "Run market research" performs live web-searched, source-cited research in-app; the same methodology ships as a reusable [Claude skill](skills/market-research/SKILL.md).
- **Prioritization Workspace** — RICE/ICE scoring where the AI pressure-tests your numbers instead of accepting them.

## Principles

1. **Peer, not professor.** No lectures. Guidance is structure, suggestions, and better questions.
2. **Your attention is the product's north star.** Every feature must produce better work in less time.
3. **Honest routing.** Trust is earned by pointing you elsewhere when elsewhere is better.
4. **Nothing to lose.** No accounts, no backend, no stored data. Your work lives in your browser; export as JSON/markdown.

## How the AI works

Bring your own Claude/OpenAI API key (kept in memory only, sent only to the provider) — or use no key at all: every AI action can output its fully-crafted expert prompt for you to paste into whatever chat you already use.

## Project documentation

This project is built spec-first, with every significant decision recorded as an ADR written for non-technical readers:

- [Playbook](docs/PLAYBOOK.md) — the product thinking behind every feature
- [Product Spec](docs/SPEC.md)
- [ADR-0001: Peer, not teacher](docs/adr/0001-peer-not-teacher.md)
- [ADR-0002: Three workflows, everything else cut](docs/adr/0002-scope-three-workflows.md)
- [ADR-0003: No backend, BYOK AI](docs/adr/0003-no-backend-byok.md)
- [ADR-0004: The Radar as centerpiece](docs/adr/0004-radar-as-centerpiece.md)
- [Competitive research](docs/research/competitive-review.md) — the market analysis this project's positioning is based on

## Try it

**Live app:** https://shaharperetz1.github.io/pm-copilot/ — no signup, nothing stored.

Run locally: `npm install && npm run dev`

## Status

v1 shipped — built in one week, spec-first. See the [Playbook](docs/PLAYBOOK.md) for the product thinking, and the [spec](docs/SPEC.md) for how it was scoped.

---

Built by [Shahar Peretz](https://github.com/ShaharPeretz1) as a working demonstration of product thinking — researched, scoped, documented, and shipped like a real product.
