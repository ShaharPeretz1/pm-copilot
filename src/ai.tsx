import { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------------------
// BYOK AI layer (ADR-0003). The key lives in React state only — never
// persisted, never sent anywhere except the model provider itself.
// Provider is inferred from the key prefix: sk-ant-… → Anthropic, else OpenAI.
// Web search (ADR-0005/0007) works on both providers: Anthropic's Messages
// API web_search_20250305 tool, or OpenAI's Responses API web_search tool
// (gpt-4.1-mini — gpt-4o-mini doesn't support the tool).
// ---------------------------------------------------------------------------

export const AiKeyContext = createContext<{
  apiKey: string;
  setApiKey: (k: string) => void;
}>({ apiKey: "", setApiKey: () => {} });

export const useAiKey = () => useContext(AiKeyContext);

export async function callAi(
  apiKey: string,
  prompt: string,
  webSearch = false
): Promise<string> {
  if (apiKey.startsWith("sk-ant-")) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: webSearch ? 4000 : 1500,
        ...(webSearch && {
          tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }],
        }),
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API: ${res.status}`);
    const data = await res.json();
    const text = (data.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("");
    return text || "(empty response)";
  }
  if (webSearch) {
    // Responses API: web_search is only supported on gpt-4.1-family models
    // (not gpt-4o-mini), and makes search opt-in via the tools array —
    // unlike Chat Completions' search-preview models, which always search.
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        max_output_tokens: 4000,
        tools: [{ type: "web_search", search_context_size: "medium" }],
        input: prompt,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API: ${res.status}`);
    const data = await res.json();
    const text = (data.output ?? [])
      .filter((item: { type: string }) => item.type === "message")
      .flatMap((item: { content: { type: string; text: string }[] }) => item.content)
      .filter((c: { type: string }) => c.type === "output_text")
      .map((c: { text: string }) => c.text)
      .join("");
    return text || "(empty response)";
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "(empty response)";
}

// ---- AiAction: one button, two behaviors ------------------------------------
// With a key: runs the prompt and renders the response inline.
// Without: copies the crafted prompt for any chat. Same product, zero setup.

export function AiAction({
  label,
  prompt,
  webSearch = false,
}: {
  label: string;
  prompt: () => string;
  webSearch?: boolean;
}) {
  const { apiKey } = useAiKey();
  const [state, setState] = useState<"idle" | "copied" | "busy" | "error">("idle");
  const [result, setResult] = useState<string | null>(null);

  const run = async () => {
    if (!apiKey) {
      await navigator.clipboard.writeText(prompt());
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
      return;
    }
    setState("busy");
    setResult(null);
    try {
      setResult(await callAi(apiKey, prompt(), webSearch));
      setState("idle");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  };

  const text =
    state === "copied"
      ? "Copied — paste into your AI chat"
      : state === "busy"
        ? "Thinking…"
        : state === "error"
          ? "Failed — check the key"
          : label;

  return (
    <>
      <button
        onClick={run}
        disabled={state === "busy"}
        className="px-3 py-1.5 rounded-md bg-accent text-white font-medium hover:opacity-90 disabled:opacity-60"
        title={apiKey ? "Runs with your API key" : "No key set — copies the prompt instead"}
      >
        {text}
      </button>
      {result && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50" onClick={() => setResult(null)}>
          <div
            className="bg-surface rounded-lg border border-line max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-sm">Colleague's notes</h3>
              <div className="flex gap-3 text-xs text-ink-soft">
                <button onClick={() => navigator.clipboard.writeText(result)} className="hover:text-ink">
                  copy
                </button>
                <button onClick={() => setResult(null)} className="hover:text-ink">
                  close
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{result}</pre>
          </div>
        </div>
      )}
    </>
  );
}

// ---- Key control (header) ----------------------------------------------------

export function KeyControl() {
  const { apiKey, setApiKey } = useAiKey();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={
          "px-3 py-1.5 rounded-md border text-sm " +
          (apiKey
            ? "border-good/40 text-good"
            : "border-line text-ink-soft hover:border-ink-faint")
        }
      >
        {apiKey ? "AI: on" : "AI key"}
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-50 bg-surface border border-line rounded-lg p-4 w-80 shadow-sm">
          <p className="text-xs text-ink-soft mb-2">
            Optional. Paste an Anthropic or OpenAI API key to run AI actions in-app. It stays in
            this tab's memory — never stored, never sent anywhere but the provider. Without a key,
            AI buttons copy an expert prompt for any chat instead.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value.trim())}
            placeholder="sk-ant-… or sk-…"
            className="w-full text-sm border border-line rounded-md px-2 py-1.5 outline-none focus:border-accent bg-transparent"
          />
        </div>
      )}
    </div>
  );
}
