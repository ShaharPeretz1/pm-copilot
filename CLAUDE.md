# CLAUDE.md

> Thin pointer. The real context lives in [`docs/`](docs/). Keep this file short so it never
> goes stale.

## Read first (session-start hydrate)

1. [`docs/SPEC.md`](docs/SPEC.md) — what this is, who it's for, v1 scope
2. [`docs/PLAYBOOK.md`](docs/PLAYBOOK.md) — the product thinking/heuristics behind each workflow
3. [`docs/roadmap.md`](docs/roadmap.md) — what shipped recently and what's next
4. [`docs/adr/`](docs/adr/) — **decisions made, and what was rejected + why.** Treat as binding —
   if a rejected option looks worth reconsidering, say so explicitly and cite the ADR rather than
   silently re-proposing it.

Then confirm your understanding in 2-3 lines before writing code.

## Close-out ritual

When a chunk of work is done: draft a new ADR for any real decision (+ rejected alternatives, in
the style of `docs/adr/0001`–`0006`), move shipped items into `docs/roadmap.md`'s "Recently
shipped" and re-rank "Next", and update the README's Status line if the shipped surface changed.
Keep the draft to what fits a ~2 min human edit pass — don't rewrite existing docs, append/adjust.
