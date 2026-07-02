import { useEffect, useRef, useState } from "react";
import type { RadarFeed, RadarItem, RadarTag, SectionId, Workspace } from "./types";
import { emptyWorkspace } from "./types";

// ---------------------------------------------------------------------------
// App shell — navigation, workspace state, JSON export/import, Radar landing.
// Workflow views are built out in their own modules as they land (Days 2–5).
// ---------------------------------------------------------------------------

const NAV: { id: SectionId; label: string; blurb: string }[] = [
  { id: "radar", label: "Radar", blurb: "What's new, what's worth your time" },
  { id: "prd", label: "PRD", blurb: "Draft with a sharp colleague" },
  { id: "research", label: "Research", blurb: "Teardowns with evidence discipline" },
  { id: "prioritize", label: "Prioritize", blurb: "Scores that survive questioning" },
];

export default function App() {
  const [section, setSection] = useState<SectionId>("radar");
  const [workspace, setWorkspace] = useState<Workspace>(emptyWorkspace());
  const fileInput = useRef<HTMLInputElement>(null);

  const exportWorkspace = () => {
    const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pm-copilot-workspace-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importWorkspace = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as Workspace;
      if (parsed?.version !== 1) throw new Error("unrecognized file");
      setWorkspace(parsed);
    } catch {
      alert("That file doesn't look like a PM Copilot workspace export.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-semibold tracking-tight">PM Copilot</span>
            <span className="hidden sm:inline text-sm text-ink-soft">
              a smart contributor, not another tool to manage
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => fileInput.current?.click()}
              className="px-3 py-1.5 rounded-md border border-line hover:border-ink-faint text-ink-soft"
            >
              Import
            </button>
            <button
              onClick={exportWorkspace}
              className="px-3 py-1.5 rounded-md border border-line hover:border-ink-faint text-ink-soft"
            >
              Export
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && importWorkspace(e.target.files[0])}
            />
          </div>
        </div>
        {/* Nav */}
        <nav className="mx-auto max-w-5xl px-6 flex gap-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setSection(n.id)}
              className={
                "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors " +
                (section === n.id
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-soft hover:text-ink")
              }
            >
              {n.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Body */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-8">
        {section === "radar" && <RadarView />}
        {section !== "radar" && <ComingSoon section={section} />}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-4 text-xs text-ink-faint flex justify-between">
          <span>Your work stays in this browser tab. Export before you close.</span>
          <a
            href="https://github.com/ShaharPeretz1/pm-copilot"
            className="hover:text-ink-soft"
            target="_blank"
            rel="noreferrer"
          >
            Open source · how it was built
          </a>
        </div>
      </footer>
    </div>
  );
}

// ---- Radar ------------------------------------------------------------------

const TAG_STYLE: Record<RadarTag, { label: string; cls: string }> = {
  "try-now": { label: "Try now", cls: "bg-accent-soft text-accent" },
  "be-aware": { label: "Be aware", cls: "bg-[#fff6e8] text-warn" },
  watch: { label: "Watch", cls: "bg-[#f0f0ee] text-ink-soft" },
};

function RadarView() {
  const [feed, setFeed] = useState<RadarFeed | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("radar.json")
      .then((r) => r.json())
      .then(setFeed)
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <h1 className="text-2xl font-semibold tracking-tight">Radar</h1>
        {feed && <span className="text-xs text-ink-faint">updated {feed.updatedOn}</span>}
      </div>
      <p className="text-sm text-ink-soft mb-6 max-w-xl">
        A hand-curated read on new AI tools and capabilities worth a PM's attention — including
        when the right move is a different tool than this one.
      </p>

      {error && (
        <p className="text-sm text-ink-soft">Couldn't load the feed. Try refreshing.</p>
      )}
      <ul className="space-y-3">
        {feed?.items.map((item) => (
          <RadarCard key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function RadarCard({ item }: { item: RadarItem }) {
  const tag = TAG_STYLE[item.tag];
  return (
    <li className="bg-surface border border-line rounded-lg p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tag.cls}`}>
          {tag.label}
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="font-medium hover:text-accent"
        >
          {item.title}
        </a>
      </div>
      <p className="text-sm text-ink-soft">{item.why}</p>
    </li>
  );
}

// ---- Placeholder for workflows landing Days 2–5 -----------------------------

function ComingSoon({ section }: { section: SectionId }) {
  const meta = NAV.find((n) => n.id === section)!;
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">{meta.label}</h1>
      <p className="text-sm text-ink-soft">{meta.blurb} — landing this week.</p>
    </div>
  );
}
