import type { PrdDoc, PrdSection } from "./types";
import { uid } from "./types";

// Peer-level guidance: suggestions and directions, never lessons.

const S = (title: string, hints: string[], angles: string[]): PrdSection => ({
  id: uid(),
  title,
  hints,
  angles,
  content: "",
});

export const newPrd = (title = "Untitled PRD"): PrdDoc => ({
  id: uid(),
  title,
  updatedAt: new Date().toISOString(),
  sections: [
    S(
      "Problem",
      [
        "State it from the user's side — what breaks, for whom, how often.",
        "One sentence of evidence beats three of narrative.",
        "If you can't say who feels this weekly, flag it as an assumption.",
      ],
      [
        "Invert it: what happens if nobody solves this for a year?",
        "Segment check: is this the same problem for your biggest and smallest customers?",
        "Is this a problem users *say* they have or one their behavior shows?",
      ]
    ),
    S(
      "Users & context",
      [
        "Primary user first; buyers, admins and bystanders after.",
        "Note the moment of use — what did they just do, what happens next.",
      ],
      [
        "Who is explicitly *not* served by v1? Saying it now saves scope fights later.",
        "Map one real user you've spoken to onto this — does it still hold?",
      ]
    ),
    S(
      "Success metrics",
      [
        "One primary metric with a target and a timeframe.",
        "Pair it with a guardrail metric that would catch collateral damage.",
      ],
      [
        "Leading vs. lagging: what would move within two weeks of launch?",
        "Counter-metric: what would look *good* here while the product gets worse?",
        "What number would make you kill this feature post-launch?",
      ]
    ),
    S(
      "Solution & scope",
      [
        "Describe behavior, not implementation.",
        "Cut-line format works well: In / Out / Later, each with one reason.",
      ],
      [
        "What's the cheapest version that tests the same hypothesis?",
        "Which piece would you drop first under a deadline — and does that change v1?",
      ]
    ),
    S(
      "Risks & open questions",
      [
        "Riskiest assumption first, with how you'd test it cheaply.",
        "Open questions with an owner and a date beat a parking lot.",
      ],
      [
        "Pre-mortem: it's six months later and this flopped — what's the most likely reason?",
        "Which dependency outside your team can silently kill the timeline?",
      ]
    ),
    S(
      "Rollout",
      [
        "Phases with entry/exit criteria, not just dates.",
        "Name what you'll watch in the first 48 hours.",
      ],
      [
        "What would trigger a rollback, and who decides?",
        "Is there a segment where launching first is nearly free?",
      ]
    ),
  ],
});

export const prdToMarkdown = (doc: PrdDoc): string =>
  `# ${doc.title}\n\n` +
  doc.sections
    .map((s) => `## ${s.title}\n\n${s.content.trim() || "_(not written yet)_"}\n`)
    .join("\n");

// The review prompt IS product content (ADR-0003 fallback path).
export const reviewPrompt = (doc: PrdDoc): string => `You are a sharp, senior product colleague reviewing a PRD draft. Be terse and specific — bullet notes, no praise padding, no explanations of PM concepts.

Review for:
1. Problem: is it evidenced, or asserted? Whose problem, how often?
2. Metrics: is there one primary metric with target + timeframe? A guardrail? What could look good while the product gets worse?
3. Scope: what's in that doesn't serve the stated problem? What's missing that does?
4. Assumptions: list the riskiest untested assumptions, each with the cheapest test.
5. Edge cases and failure modes the draft is silent on.
6. The one question you'd ask before approving this.

Draft:
---
${prdToMarkdown(doc)}
---`;
