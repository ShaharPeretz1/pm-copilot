// ---- Core data model ------------------------------------------------------
// All state lives in memory and can be exported/imported as a single JSON
// file (see ADR-0003: no backend, nothing stored anywhere).

export type SectionId = "radar" | "prd" | "research" | "prioritize";

// ---- PRD Workspace ---------------------------------------------------------

export interface PrdSection {
  id: string;
  title: string;
  /** Peer-level hints on what to cover — suggestions, not lessons. */
  hints: string[];
  /** Alternative framings / directions, revealed on demand ("Angles"). */
  angles: string[];
  content: string;
}

export interface PrdDoc {
  id: string;
  title: string;
  updatedAt: string; // ISO
  sections: PrdSection[];
}

// ---- Market & Competitor Research -----------------------------------------

export interface EvidenceClaim {
  text: string;
  sourceUrl: string; // discipline through structure: claims carry sources
}

export interface CompetitorTeardown {
  id: string;
  name: string;
  positioning: string;
  pricing: string;
  targetUser: string;
  strengths: EvidenceClaim[];
  gaps: EvidenceClaim[];
  notes: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  updatedAt: string;
  question: string; // what are we trying to learn?
  competitors: CompetitorTeardown[];
}

// ---- Prioritization --------------------------------------------------------

export type ScoringModel = "RICE" | "ICE";

export interface ScoredItem {
  id: string;
  title: string;
  /** RICE: reach, impact, confidence, effort · ICE: impact, confidence, ease */
  reach: number | null;
  impact: number | null;
  confidence: number | null;
  effort: number | null; // doubles as "ease" inverse for ICE
  /** The "based on what?" field — reasoning captured next to the number. */
  rationale: string;
}

export interface PrioritizationBoard {
  id: string;
  title: string;
  updatedAt: string;
  model: ScoringModel;
  items: ScoredItem[];
}

// ---- Radar ------------------------------------------------------------------

export type RadarTag = "try-now" | "be-aware" | "watch";

export interface RadarItem {
  id: string;
  title: string;
  url: string;
  tag: RadarTag;
  /** One line: why this matters to a PM. */
  why: string;
  /** Which workflows this is relevant to, for contextual surfacing. */
  contexts: SectionId[];
  addedOn: string; // ISO date
}

export interface RadarFeed {
  updatedOn: string;
  items: RadarItem[];
}

// ---- App state & persistence ------------------------------------------------

export interface Workspace {
  version: 1;
  prds: PrdDoc[];
  research: ResearchProject[];
  boards: PrioritizationBoard[];
}

export const emptyWorkspace = (): Workspace => ({
  version: 1,
  prds: [],
  research: [],
  boards: [],
});

export const uid = (): string =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
