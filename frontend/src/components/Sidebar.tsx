export type View = "graph" | "risk" | "ownership" | "assistant";

const ITEMS: { id: View; label: string; glyph: string }[] = [
  { id: "graph", label: "Architecture", glyph: "◈" },
  { id: "risk", label: "Risk Board", glyph: "▲" },
  { id: "ownership", label: "Ownership", glyph: "◉" },
  { id: "assistant", label: "AI Assistant", glyph: "✦" },
];

export default function Sidebar({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <nav className="flex w-16 shrink-0 flex-col items-center gap-1 border-r border-line bg-panel py-4 md:w-44 md:items-stretch md:px-3">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
            view === item.id
              ? "border border-signal/30 bg-signal/10 text-signal"
              : "border border-transparent text-muted hover:text-slate-200"
          }`}
        >
          <span className="text-base">{item.glyph}</span>
          <span className="hidden md:inline">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
