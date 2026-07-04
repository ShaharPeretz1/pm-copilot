import { useState } from "react";
import type {
  CompetitorTeardown,
  EvidenceClaim,
  ResearchProject,
  Workspace,
} from "./types";
import { uid } from "./types";
import { AiAction } from "./ai";
import RadarStrip from "./RadarStrip";

// ---------------------------------------------------------------------------
// Research — competitor teardowns with evidence discipline. Claims carry
// source links by structure, not by nagging.
// ---------------------------------------------------------------------------

const newProject = (): ResearchProject => ({
  id: uid(),
  title: "Untitled research",
  updatedAt: new Date().toISOString(),
  question: "",
  competitors: [],
});

const newCompetitor = (): CompetitorTeardown => ({
  id: uid(),
  name: "",
  positioning: "",
  pricing: "",
  targetUser: "",
  strengths: [],
  gaps: [],
  notes: "",
});

const projectToMarkdown = (p: ResearchProject): string => {
  const row = (c: CompetitorTeardown) =>
    `| ${c.name || "—"} | ${c.positioning || "—"} | ${c.pricing || "—"} | ${
      c.targetUser || "—"
    } | ${c.strengths.map((s) => s.text).join("; ") || "—"} | ${
      c.gaps.map((g) => g.text).join("; ") || "—"
    } |`;

  const evidence = (c: CompetitorTeardown) =>
    [...c.strengths, ...c.gaps]
      .filter((e) => e.sourceUrl)
      .map((e) => `- ${e.text} — ${e.sourceUrl}`)
      .join("\n");

  return (
    `# ${p.title}\n\n**Research question:** ${p.question || "—"}\n\n` +
    `| Competitor | Positioning | Pricing | Target user | Strengths | Gaps |\n` +
    `|---|---|---|---|---|---|\n` +
    p.competitors.map(row).join("\n") +
    `\n\n## Evidence\n\n` +
    p.competitors
      .map((c) => (evidence(c) ? `**${c.name}**\n${evidence(c)}` : ""))
      .filter(Boolean)
      .join("\n\n")
  );
};

const researchPlanPrompt = (p: ResearchProject): string => `You are a sharp senior product colleague helping plan competitive research. Be terse and specific.

Research question: ${p.question || "(not yet defined — start by sharpening it)"}
Competitors under review: ${p.competitors.map((c) => c.name).filter(Boolean).join(", ") || "(none yet)"}

Produce:
1. A sharper version of the research question if it's vague, broad, or unfalsifiable.
2. For each competitor: the 3 highest-signal things to investigate and where evidence would live (pricing pages, changelogs, reviews, job posts, earnings calls).
3. Probing questions that would prove or disprove that each competitor is actually winning — not just present.
4. What this research deliberately should NOT cover, to stay decision-relevant.
5. The disconfirming evidence to look for: what finding would change the likely conclusion?

Do not invent facts about these companies. Where a claim is needed, state what to verify and how.`;

// ---- View -------------------------------------------------------------------

interface Props {
  workspace: Workspace;
  setWorkspace: (w: Workspace) => void;
}

export default function ResearchView({ workspace, setWorkspace }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const project = workspace.research.find((r) => r.id === openId) ?? null;

  const create = () => {
    const p = newProject();
    setWorkspace({ ...workspace, research: [p, ...workspace.research] });
    setOpenId(p.id);
  };

  const update = (p: ResearchProject) =>
    setWorkspace({
      ...workspace,
      research: workspace.research.map((x) =>
        x.id === p.id ? { ...p, updatedAt: new Date().toISOString() } : x
      ),
    });

  const remove = (id: string) => {
    if (!confirm("Delete this research project?")) return;
    setWorkspace({ ...workspace, research: workspace.research.filter((r) => r.id !== id) });
    if (openId === id) setOpenId(null);
  };

  if (project) return <Editor project={project} update={update} back={() => setOpenId(null)} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Research</h1>
          <p className="text-sm text-ink-soft">
            Teardowns where claims carry sources — so conclusions survive scrutiny.
          </p>
        </div>
        <button
          onClick={create}
          className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90"
        >
          New research
        </button>
      </div>
      {workspace.research.length === 0 ? (
        <p className="text-sm text-ink-faint py-12 text-center">No research projects yet.</p>
      ) : (
        <ul className="space-y-2">
          {workspace.research.map((r) => (
            <li
              key={r.id}
              className="bg-surface border border-line rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <button onClick={() => setOpenId(r.id)} className="font-medium hover:text-accent">
                {r.title}
                <span className="ml-2 text-xs text-ink-faint">
                  {r.competitors.length} competitors
                </span>
              </button>
              <button
                onClick={() => remove(r.id)}
                className="text-xs text-ink-faint hover:text-ink-soft"
              >
                delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Editor({
  project,
  update,
  back,
}: {
  project: ResearchProject;
  update: (p: ResearchProject) => void;
  back: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, what: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 1600);
  };

  const setCompetitor = (c: CompetitorTeardown) =>
    update({
      ...project,
      competitors: project.competitors.map((x) => (x.id === c.id ? c : x)),
    });

  return (
    <div>
      <button onClick={back} className="text-sm text-ink-soft hover:text-ink mb-4">
        ← All research
      </button>
      <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
        <input
          value={project.title}
          onChange={(e) => update({ ...project, title: e.target.value })}
          className="text-2xl font-semibold tracking-tight bg-transparent outline-none flex-1 min-w-48"
          placeholder="Research title"
        />
        <div className="flex gap-2 text-sm shrink-0">
          <button
            onClick={() => copy(projectToMarkdown(project), "md")}
            className="px-3 py-1.5 rounded-md border border-line hover:border-ink-faint text-ink-soft"
          >
            {copied === "md" ? "Copied" : "Copy brief"}
          </button>
          <AiAction label="Plan the research" prompt={() => researchPlanPrompt(project)} />
        </div>
      </div>

      <input
        value={project.question}
        onChange={(e) => update({ ...project, question: e.target.value })}
        placeholder="Research question — what decision does this research serve?"
        className="w-full bg-transparent outline-none text-sm text-ink-soft border-b border-line focus:border-accent pb-2 mb-6"
      />

      <div className="space-y-4">
        {project.competitors.map((c) => (
          <Teardown key={c.id} c={c} onChange={setCompetitor} onRemove={() =>
            update({
              ...project,
              competitors: project.competitors.filter((x) => x.id !== c.id),
            })
          } />
        ))}
      </div>

      <button
        onClick={() =>
          update({ ...project, competitors: [...project.competitors, newCompetitor()] })
        }
        className="mt-4 px-4 py-2 rounded-md border border-line text-sm text-ink-soft hover:border-ink-faint"
      >
        + Add competitor
      </button>
      <RadarStrip context="research" />
    </div>
  );
}

function Teardown({
  c,
  onChange,
  onRemove,
}: {
  c: CompetitorTeardown;
  onChange: (c: CompetitorTeardown) => void;
  onRemove: () => void;
}) {
  const field = (
    label: string,
    key: "positioning" | "pricing" | "targetUser",
    placeholder: string
  ) => (
    <label className="block">
      <span className="text-xs text-ink-faint">{label}</span>
      <input
        value={c[key]}
        onChange={(e) => onChange({ ...c, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-sm border-b border-line focus:border-accent pb-1"
      />
    </label>
  );

  return (
    <section className="bg-surface border border-line rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <input
          value={c.name}
          onChange={(e) => onChange({ ...c, name: e.target.value })}
          placeholder="Competitor name"
          className="font-semibold bg-transparent outline-none flex-1"
        />
        <button onClick={onRemove} className="text-xs text-ink-faint hover:text-ink-soft">
          ✕
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        {field("Positioning", "positioning", "how they describe themselves")}
        {field("Pricing", "pricing", "model + entry price")}
        {field("Target user", "targetUser", "who they're really built for")}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-3">
        <Claims
          label="Strengths"
          items={c.strengths}
          onChange={(strengths) => onChange({ ...c, strengths })}
        />
        <Claims label="Gaps" items={c.gaps} onChange={(gaps) => onChange({ ...c, gaps })} />
      </div>

      <textarea
        value={c.notes}
        onChange={(e) => onChange({ ...c, notes: e.target.value })}
        placeholder="Notes — what would prove they're winning, not just present?"
        rows={2}
        className="w-full resize-y bg-transparent outline-none text-sm placeholder:text-ink-faint"
      />
    </section>
  );
}

function Claims({
  label,
  items,
  onChange,
}: {
  label: string;
  items: EvidenceClaim[];
  onChange: (items: EvidenceClaim[]) => void;
}) {
  const set = (i: number, patch: Partial<EvidenceClaim>) =>
    onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <div>
      <span className="text-xs text-ink-faint">{label}</span>
      <ul className="mt-1 space-y-2">
        {items.map((claim, i) => (
          <li key={i} className="flex gap-2 items-start">
            <div className="flex-1 min-w-0">
              <input
                value={claim.text}
                onChange={(e) => set(i, { text: e.target.value })}
                placeholder="claim"
                className="w-full bg-transparent outline-none text-sm border-b border-line focus:border-accent pb-0.5"
              />
              <input
                value={claim.sourceUrl}
                onChange={(e) => set(i, { sourceUrl: e.target.value })}
                placeholder="source URL — a claim without one is a hypothesis"
                className={
                  "w-full bg-transparent outline-none text-xs pb-0.5 mt-1 border-b " +
                  (claim.text && !claim.sourceUrl
                    ? "border-warn/40 placeholder:text-warn/70"
                    : "border-transparent placeholder:text-ink-faint text-ink-soft")
                }
              />
            </div>
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-xs text-ink-faint hover:text-ink-soft mt-1"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onChange([...items, { text: "", sourceUrl: "" }])}
        className="text-xs text-ink-soft hover:text-ink mt-2"
      >
        + add
      </button>
    </div>
  );
}
