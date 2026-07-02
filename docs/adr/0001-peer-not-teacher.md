# ADR-0001: Position the tool as a peer contributor, not a teacher

**Status:** Accepted · **Date:** 2026-07-01

## Context
Early drafts framed the tool as a coach for junior PMs, with "why this matters" explanations in every workflow. Two problems emerged: senior PMs would feel patronized and never adopt it, and even junior PMs don't want a tool that signals "you need help" — they want to produce senior-level work.

## Options considered
1. **Teacher mode** — explicit explanations, tutorials, framework education in every flow.
   - *Pro:* clearly valuable to absolute beginners.
   - *Con:* alienates everyone else; makes users' artifacts feel like homework; the "for juniors" label limits shareability and portfolio signal.
2. **Peer mode (chosen)** — the tool contributes like a sharp colleague: structure, suggestions, alternative angles, pointed questions. Best practices are embedded in the structure itself, never lectured.
   - *Pro:* serves juniors and seniors with one experience; juniors absorb good practice by working inside good structure.
   - *Con:* beginners get less hand-holding; mitigated by the companion playbook for those who want depth.
3. **Two modes (toggle junior/senior)** — *Con:* doubles content work in a one-week build; the toggle itself is the patronizing signal we're avoiding.

## Decision
One experience, peer tone everywhere. Guidance appears as inline suggestions and "angles to consider" — never as explanations of what a document or framework is. Deeper reasoning lives in the separate playbook, opt-in.

## Consequences
- All UI copy must pass the test: "would a 10-year PM find this useful rather than condescending?"
- Learning happens through structure and example, which is slower but stickier.
- The playbook becomes the home for pedagogy, keeping the app clean.
