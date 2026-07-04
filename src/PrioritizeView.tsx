import { useState } from "react";
import type { PrioritizationBoard, ScoredItem, ScoringModel, Workspace } from "./types";
import { uid } from "./types";
import { AiAction } from "./ai";
import RadarStrip from "./RadarStrip";

// ---------------------------------------------------------------------------
// Prioritization — scores that survive questioning. Every number carries a
// "based on what?" rationale; the pressure-test prompt attacks weak ones.
// ---------------------------------------------------------------------------

const newBoard = (): PrioritizationBoard => ({
  id: uid(),
  title: "Untitled board",
  updatedAt: new Date().toISOString(),
  model: "RICE",
  items: [],
});

const newItem = (): ScoredItem => ({
  id: uid(),
  title: "",
  reach: null,
  impact: null,
  confidence: null,
  effort: null,
  rationale: "",
});

const score = (it: ScoredItem, model: ScoringModel): number | null => {
  const { reach, impact, confidence, effort } = it;
  if (impact == null || confidence == null || effort == null) return null;
  if (model === "RICE") {
    if (reach == null || effort === 0) return null;
    return (reach * impact * confidence) / effort;
  }
  return impact * confidence * effort; // ICE: effort column = ease
};

const FIELDS: Record<
  ScoringModel,
  { key: keyof ScoredItem; label: string; hint: string }[]
> = {
  RICE: [
    { key: "reach", label: "Reach", hint: "people/quarter — from data, not vibes" },
    { key: "impact", label: "Impact", hint: "3 massive · 2 high · 1 medium · 0.5 low" },
    { key: "confidence", label: "Confidence", hint: "1 / 0.8 / 0.5 — below 0.5, go learn first" },
    { key: "effort", label: "Effort", hint: "person-months, ask the team" },
  ],
  ICE: [
    { key: "impact", label: "Impact", hint: "1–10" },
    { key: "confidence", label: "Confidence", hint: "1–10" },
    { key: "effort", label: "Ease", hint: "1–10 (10 = trivial)" },
  ],
};

const boardToMarkdown = (b: PrioritizationBoard): string => {
  const ranked = [...b.items].sort(
    (a, z) => (score(z, b.model) ?? -1) - (score(a, b.model) ?? -1)
  );
  const cols = FIELDS[b.model].map((f) => f.label);
  return (
    `# ${b.title} (${b.model})\n\n| # | Item | ${cols.join(" | ")} | Score | Rationale |\n` +
    `|---|------|${cols.map(() => "---").join("|")}|-------|-----------|\n` +
    ranked
      .map((it, i) => {
        const vals = FIELDS[b.model].map((f) => it[f.key] ?? "—");
        const s = score(it, b.model);
        return `| ${i + 1} | ${it.title || "—"} | ${vals.join(" | ")} | ${
          s == null ? "—" : s.toFixed(1)
        } | ${it.rationale || "—"} |`;
      })
      .join("\n")
  );
};

const pressureTestPrompt = (b: PrioritizationBoard): string => `You are a sharp senior product colleague reviewing a ${b.model} prioritization. Be terse and specific. For each item:
1. Attack the weakest number — which score has the least evidence behind it, and what data would settle it?
2. Flag rationale that is circular, vague, or missing.
3. Check for effort optimism — which estimates look like best-case?
Then: compare the top 3 items. What trade-off is being made implicitly? Is anything ranked high mainly because its numbers are easiest to inflate? Finish with the one question you'd ask before committing the top item.

Board:
---
${boardToMarkdown(b)}
---`;

// ---- View -------------------------------------------------------------------

interface Props {
  workspace: Workspace;
  setWorkspace: (w: Workspace) => void;
}

export default function PrioritizeView({ workspace, setWorkspace }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const board = workspace.boards.find((b) => b.id === openId) ?? null;

  const create = () => {
    const b = newBoard();
    setWorkspace({ ...workspace, boards: [b, ...workspace.boards] });
    setOpenId(b.id);
  };

  const update = (b: PrioritizationBoard) =>
    setWorkspace({
      ...workspace,
      boards: workspace.boards.map((x) =>
        x.id === b.id ? { ...b, updatedAt: new Date().toISOString() } : x
      ),
    });

  const remove = (id: string) => {
    if (!confirm("Delete this board?")) return;
    setWorkspace({ ...workspace, boards: workspace.boards.filter((b) => b.id !== id) });
    if (openId === id) setOpenId(null);
  };

  if (board) return <Editor board={board} update={update} back={() => setOpenId(null)} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Prioritize</h1>
          <p className="text-sm text-ink-soft">
            RICE or ICE, with the reasoning next to the numbers — so the ranking survives the room.
          </p>
        </div>
        <button
          onClick={create}
          className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90"
        >
          New board
        </button>
      </div>
      {workspace.boards.length === 0 ? (
        <p className="text-sm text-ink-faint py-12 text-center">No boards yet.</p>
      ) : (
        <ul className="space-y-2">
          {workspace.boards.map((b) => (
            <li
              key={b.id}
              className="bg-surface border border-line rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <button onClick={() => setOpenId(b.id)} className="font-medium hover:text-accent">
                {b.title}
                <span className="ml-2 text-xs text-ink-faint">
                  {b.model} · {b.items.length} items
                </span>
              </button>
              <button
                onClick={() => remove(b.id)}
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
  board,
  update,
  back,
}: {
  board: PrioritizationBoard;
  update: (b: PrioritizationBoard) => void;
  back: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const fields = FIELDS[board.model];
  const ranked = [...board.items].sort(
    (a, z) => (score(z, board.model) ?? -1) - (score(a, board.model) ?? -1)
  );

  const copy = async (text: string, what: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 1600);
  };

  const setItem = (it: ScoredItem) =>
    update({ ...board, items: board.items.map((x) => (x.id === it.id ? it : x)) });

  return (
    <div>
      <button onClick={back} className="text-sm text-ink-soft hover:text-ink mb-4">
        ← All boards
      </button>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <input
          value={board.title}
          onChange={(e) => update({ ...board, title: e.target.value })}
          className="text-2xl font-semibold tracking-tight bg-transparent outline-none flex-1 min-w-48"
          placeholder="Board title"
        />
        <div className="flex gap-2 items-center text-sm shrink-0">
          <select
            value={board.model}
            onChange={(e) => update({ ...board, model: e.target.value as ScoringModel })}
            className="px-2 py-1.5 rounded-md border border-line bg-surface text-ink-soft"
          >
            <option value="RICE">RICE</option>
            <option value="ICE">ICE</option>
          </select>
          <button
            onClick={() => copy(boardToMarkdown(board), "md")}
            className="px-3 py-1.5 rounded-md border border-line hover:border-ink-faint text-ink-soft"
          >
            {copied === "md" ? "Copied" : "Copy table"}
          </button>
          <AiAction label="Pressure-test" prompt={() => pressureTestPrompt(board)} />
        </div>
      </div>

      <div className="overflow-x-auto bg-surface border border-line rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-faint">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium min-w-44">Item</th>
              {fields.map((f) => (
                <th key={f.key as string} className="px-3 py-2 font-medium" title={f.hint}>
                  {f.label}
                  <span className="block font-normal normal-case">{f.hint}</span>
                </th>
              ))}
              <th className="px-3 py-2 font-medium">Score</th>
              <th className="px-3 py-2 font-medium min-w-52">Based on what?</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {ranked.map((it, i) => {
              const s = score(it, board.model);
              return (
                <tr key={it.id} className="border-b border-line last:border-0 align-top">
                  <td className="px-3 py-2 text-ink-faint">{i + 1}</td>
                  <td className="px-3 py-2">
                    <input
                      value={it.title}
                      onChange={(e) => setItem({ ...it, title: e.target.value })}
                      placeholder="Feature or bet"
                      className="w-full bg-transparent outline-none"
                    />
                  </td>
                  {fields.map((f) => (
                    <td key={f.key as string} className="px-3 py-2">
                      <input
                        type="number"
                        value={(it[f.key] as number | null) ?? ""}
                        onChange={(e) =>
                          setItem({
                            ...it,
                            [f.key]: e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                        className="w-16 bg-transparent outline-none border-b border-line focus:border-accent"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 font-semibold">
                    {s == null ? <span className="text-ink-faint">—</span> : s.toFixed(1)}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={it.rationale}
                      onChange={(e) => setItem({ ...it, rationale: e.target.value })}
                      placeholder="evidence behind the numbers"
                      className="w-full bg-transparent outline-none placeholder:text-ink-faint"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() =>
                        update({ ...board, items: board.items.filter((x) => x.id !== it.id) })
                      }
                      className="text-xs text-ink-faint hover:text-ink-soft"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          onClick={() => update({ ...board, items: [...board.items, newItem()] })}
          className="w-full text-left px-3 py-2.5 text-sm text-ink-soft hover:text-ink hover:bg-paper"
        >
          + Add item
        </button>
      </div>
      <RadarStrip context="prioritize" />
    </div>
  );
}
