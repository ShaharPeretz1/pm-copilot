# ADR-0003: No backend; bring-your-own-key AI with a prompt fallback

**Status:** Accepted · **Date:** 2026-07-01

## Context
AI features need a language-model provider, which normally means a server, API costs, accounts, and data-privacy obligations. This is a free personal project that must stay free to run, be trustworthy enough for strangers to use with real work, and be shareable as a simple link.

## Options considered
1. **Hosted backend with my API key** — *Pro:* zero-setup AI for users. *Con:* I pay for every user's usage forever; requires auth and abuse protection; users' PRD content flows through my server (privacy burden).
2. **BYOK, in-memory only (chosen)** — user pastes their own Claude/OpenAI key; it lives in browser memory for the session and is sent only to the AI provider directly.
   - *Pro:* zero hosting cost, no data ever touches my infrastructure, works indefinitely without maintenance.
   - *Con:* setup friction; some PMs don't have an API key.
3. **No AI at all** — templates only. *Con:* loses the "smart contributor" core of the product.

## Decision
Option 2, softened by a **prompt fallback**: every AI action works without a key by producing the fully-crafted expert prompt to copy into ChatGPT/Claude/any chat the user already pays for. The tool is 100% usable with zero setup; the key just removes the copy-paste step.

## Consequences
- Free forever to host and run; no scaling or security surface.
- The engineered prompts are visible product content — they demonstrate the thinking and are useful standalone.
- Trade-off accepted: the no-key experience has one extra step per AI action.
- All user work stays in the browser (in-memory + JSON export), so there is nothing to breach.
