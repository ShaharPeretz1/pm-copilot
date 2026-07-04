---
name: radar-curation
description: Weekly curation of the PM Copilot Radar feed. Use to scan the PM thought-leadership space for new AI tools, capabilities, and practices that working PMs are likely to miss, and update public/radar.json with high-signal, non-obvious items.
---

# Radar Curation — Weekly Review

You are curating a feed whose entire value is filtering. The reader is a working PM who has no time to follow the discourse; the feed's promise is "you will not fall behind." Your job each week: find what they'd regret missing, reject everything else.

## The triviality bar (most important rule)

Reject anything a median PM already knows. "ChatGPT can draft PRDs," "AI meeting notes exist," "try Notion AI" — all fail. An item qualifies only if it passes at least one of:
- **Practice, not product:** a named workflow/technique from a credible practitioner (e.g. context libraries, adversarial agent debates, docs-as-code for PRDs)
- **Capability shift:** something that recently became possible or 10x cheaper (new API capability, new agent pattern, new integration standard)
- **Quiet adoption:** evidence that strong product teams have standardized on something the mainstream hasn't noticed yet
- **Skill migration:** a skill moving into the PM role (e.g. writing evals) that most PMs don't know is now theirs

## Sources to scan (in order of signal)

1. Lenny's Newsletter + Lenny's Podcast — lennysnewsletter.com
2. How I AI (Claire Vo) — chatprd.ai/how-i-ai (episode summaries are dense with named workflows)
3. Aakash Gupta, Product Growth — news.aakashg.com
4. Peter Yang, Creator Economy — creatoreconomy.so
5. Teresa Torres, Product Talk — producttalk.org
6. Secondary sweep: Hacker News + Product Hunt for AI-tool launches with real traction; anthropic.com/news and openai.com/blog for capability shifts

Search patterns: "<source> <current month/year>", "How I AI latest episode workflow", "new AI capability product managers <year>", "PM workflow AI underrated".

## Writing an item

Each item is one JSON entry in `public/radar.json`:
- `title` — the insight, not the brand ("Context libraries: many small files beat one big brief", not "Check out Obsidian")
- `why` — 1–2 sentences: the practice, who's behind it, and why a PM should care this week. Peer tone; no hype words.
- `tag` — `try-now` (worth an hour this week) / `be-aware` (know it before your team mentions it) / `watch` (moving, not ripe)
- `url` — the best single source; prefer the practitioner's own writing over aggregators
- `contexts` — which app workflows it's relevant to: `prd`, `research`, `prioritize`, `radar`
- `addedOn` — today's date; also update the feed's `updatedOn`

## Feed hygiene

- Add 2–4 items per week; never pad to hit a number — a thin honest week beats filler.
- Cap the feed at ~15 items; retire the oldest or least durable first.
- Honest routing applies: if the best recommendation is a competing tool, recommend it.
- Never invent items or attribute practices to people without a source you actually read.
