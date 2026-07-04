import { useEffect, useState } from "react";
import type { RadarFeed, SectionId } from "./types";

// Contextual Radar surfacing (ADR-0004): while you work, quietly show what's
// relevant to this workflow. One line each, dismissible, never modal.

export default function RadarStrip({ context }: { context: SectionId }) {
  const [feed, setFeed] = useState<RadarFeed | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    fetch("radar.json").then((r) => r.json()).then(setFeed).catch(() => {});
  }, []);

  const items = feed?.items.filter((i) => i.contexts.includes(context)).slice(0, 2) ?? [];
  if (hidden || items.length === 0) return null;

  return (
    <aside className="mt-8 border-t border-line pt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wide text-ink-faint">
          From the Radar
        </span>
        <button
          onClick={() => setHidden(true)}
          className="text-xs text-ink-faint hover:text-ink-soft"
        >
          hide
        </button>
      </div>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i.id} className="text-xs text-ink-soft">
            <a href={i.url} target="_blank" rel="noreferrer" className="font-medium hover:text-accent">
              {i.title}
            </a>{" "}
            — {i.why}
          </li>
        ))}
      </ul>
    </aside>
  );
}
