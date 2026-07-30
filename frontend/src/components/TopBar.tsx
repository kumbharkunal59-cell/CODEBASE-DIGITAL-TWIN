export default function TopBar({ nodeCount, edgeCount }: { nodeCount: number; edgeCount: number }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-panel px-5">
      <div className="flex items-center gap-2.5">
        <span className="inline-block h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_2px_rgba(94,230,198,0.6)]" />
        <span className="font-mono text-sm font-semibold tracking-tight text-slate-100 text-glow">
          CODEBASE DIGITAL TWIN
        </span>
        <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">v0.1</span>
      </div>
      <div className="flex items-center gap-5 font-mono text-xs text-muted">
        <span>{nodeCount} nodes</span>
        <span>{edgeCount} relationships</span>
        <span className="flex items-center gap-1.5 text-signal">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" /> live
        </span>
      </div>
    </header>
  );
}
