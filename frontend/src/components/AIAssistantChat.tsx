import { useState } from "react";
import { api } from "../api/client";

interface Turn {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = ["Explain login flow", "What is the riskiest service?", "What happens if payment-service fails?"];

export default function AIAssistantChat() {
  const [turns, setTurns] = useState<Turn[]>([
    { role: "assistant", content: "Ask me anything about the architecture — flows, dependencies, or risk." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (question: string) => {
    if (!question.trim() || busy) return;
    setTurns((t) => [...t, { role: "user", content: question }]);
    setInput("");
    setBusy(true);
    const res = await api.ask(question);
    setTurns((t) => [...t, { role: "assistant", content: res.answer }]);
    setBusy(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {turns.map((t, i) => (
          <div
            key={i}
            className={`max-w-[90%] rounded-md px-3 py-2 text-sm ${
              t.role === "user"
                ? "ml-auto border border-signal/30 bg-signal/10 text-slate-100"
                : "border border-line bg-ink text-slate-300"
            }`}
          >
            {t.content}
          </div>
        ))}
        {busy && <div className="text-xs text-muted">thinking…</div>}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted hover:border-signal hover:text-signal"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the architecture…"
          className="flex-1 rounded-md border border-line bg-ink px-3 py-2 text-sm text-slate-100 outline-none focus:border-signal"
        />
        <button
          type="submit"
          className="rounded-md border border-signal/40 bg-signal/10 px-3 py-2 text-sm font-medium text-signal hover:bg-signal/20"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
