import { useState } from "react";
import type { PrdDoc, PrdSection, Workspace } from "./types";
import { newPrd, prdToMarkdown, reviewPrompt } from "./prdTemplate";

interface Props {
  workspace: Workspace;
  setWorkspace: (w: Workspace) => void;
}

export default function PrdView({ workspace, setWorkspace }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const doc = workspace.prds.find((p) => p.id === openId) ?? null;

  const create = () => {
    const d = newPrd();
    setWorkspace({ ...workspace, prds: [d, ...workspace.prds] });
    setOpenId(d.id);
  };

  const update = (d: PrdDoc) =>
    setWorkspace({
      ...workspace,
      prds: workspace.prds.map((p) =>
        p.id === d.id ? { ...d, updatedAt: new Date().toISOString() } : p
      ),
    });

  const remove = (id: string) => {
    if (!confirm("Delete this PRD?")) return;
    setWorkspace({ ...workspace, prds: workspace.prds.filter((p) => p.id !== id) });
    if (openId === id) setOpenId(null);
  };

  if (doc) return <Editor doc={doc} update={update} back={() => setOpenId(null)} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">PRDs</h1>
          <p className="text-sm text-ink-soft">
            Structure plus a colleague's eye — angles you didn't consider, review before it ships.
          </p>
        </div>
        <button
          onClick={create}
          className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90"
        >
          New PRD
        </button>
      </div>
      {workspace.prds.length === 0 ? (
        <p className="text-sm text-ink-faint py-12 text-center">
          No documents yet. Start one — the structure carries you.
        </p>
      ) : (
        <ul className="space-y-2">
          {workspace.prds.map((p) => (
            <li
              key={p.id}
              className="bg-surface border border-line rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <button onClick={() => setOpenId(p.id)} className="font-medium hover:text-accent">
                {p.title}
              </button>
              <div className="flex items-center gap-3 text-xs text-ink-faint">
                <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                <button onClick={() => remove(p.id)} className="hover:text-ink-soft">
                  delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---- Editor -----------------------------------------------------------------

function Editor({
  doc,
  update,
  back,
}: {
  doc: PrdDoc;
  update: (d: PrdDoc) => void;
  back: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, what: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 1600);
  };

  const setSection = (s: PrdSection) =>
    update({ ...doc, sections: doc.sections.map((x) => (x.id === s.id ? s : x)) });

  return (
    <div>
      <button onClick={back} className="text-sm text-ink-soft hover:text-ink mb-4">
        ← All PRDs
      </button>
      <div className="flex items-center justify-between gap-4 mb-6">
        <input
          value={doc.title}
          onChange={(e) => update({ ...doc, title: e.target.value })}
          className="text-2xl font-semibold tracking-tight bg-transparent outline-none flex-1 min-w-0"
          placeholder="PRD title"
        />
        <div className="flex gap-2 shrink-0 text-sm">
          <button
            onClick={() => copy(prdToMarkdown(doc), "md")}
            className="px-3 py-1.5 rounded-md border border-line hover:border-ink-faint text-ink-soft"
          >
            {copied === "md" ? "Copied" : "Copy markdown"}
          </button>
          <button
            onClick={() => copy(reviewPrompt(doc), "review")}
            className="px-3 py-1.5 rounded-md bg-accent text-white font-medium hover:opacity-90"
            title="Copies a review prompt — paste into Claude/ChatGPT for a senior-level pass"
          >
            {copied === "review" ? "Copied — paste into your AI chat" : "Get a review"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {doc.sections.map((s) => (
          <Section key={s.id} section={s} onChange={setSection} />
        ))}
      </div>
    </div>
  );
}

function Section({
  section,
  onChange,
}: {
  section: PrdSection;
  onChange: (s: PrdSection) => void;
}) {
  const [showAngles, setShowAngles] = useState(false);

  return (
    <section className="bg-surface border border-line rounded-lg p-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">{section.title}</h2>
        <button
          onClick={() => setShowAngles(!showAngles)}
          className={
            "text-xs px-2.5 py-1 rounded-full border " +
            (showAngles
              ? "border-accent text-accent bg-accent-soft"
              : "border-line text-ink-soft hover:border-ink-faint")
          }
        >
          Angles
        </button>
      </div>

      <ul className="text-xs text-ink-faint mb-3 space-y-0.5">
        {section.hints.map((h, i) => (
          <li key={i}>· {h}</li>
        ))}
      </ul>

      {showAngles && (
        <ul className="text-xs text-accent bg-accent-soft rounded-md p-3 mb-3 space-y-1">
          {section.angles.map((a, i) => (
            <li key={i}>→ {a}</li>
          ))}
        </ul>
      )}

      <textarea
        value={section.content}
        onChange={(e) => onChange({ ...section, content: e.target.value })}
        rows={Math.max(4, section.content.split("\n").length + 1)}
        placeholder="Write here…"
        className="w-full resize-y bg-transparent outline-none text-sm leading-relaxed placeholder:text-ink-faint"
      />
    </section>
  );
}
