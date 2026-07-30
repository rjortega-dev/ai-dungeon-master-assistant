const LEGEND_ITEMS = [
  { label: "Success", color: "var(--edge-success)" },
  { label: "Failure", color: "var(--edge-failure)" },
  { label: "Optional", color: "var(--edge-optional)" },
  { label: "Secret", color: "var(--edge-secret)", dashed: true },
  { label: "Combat Win", color: "var(--edge-combat-win)" },
  { label: "Combat Loss", color: "var(--edge-combat-loss)" },
  { label: "Accept", color: "var(--edge-accept)" },
  { label: "Reject", color: "var(--edge-reject)" },
];

const NODE_LEGEND_ITEMS = [
  { label: "Current", className: "border-accent bg-card text-foreground" },
  {
    label: "Completed",
    className: "border-green-500/60 bg-green-500/10 text-green-400",
  },
  { label: "Locked", className: "border-foreground/15 bg-card/50 text-muted" },
];

export function GraphLegend() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 rounded-lg border border-accent/20 bg-card px-4 py-3 text-xs">
      <div className="space-y-1.5">
        <p className="text-muted uppercase tracking-wider font-semibold text-[10px]">
          Transitions
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {LEGEND_ITEMS.map(({ label, color, dashed }) => (
            <div key={label} className="flex items-center gap-1.5">
              <svg width="24" height="10">
                <line
                  x1="0"
                  y1="5"
                  x2="24"
                  y2="5"
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray={dashed ? "4 3" : undefined}
                />
              </svg>
              <span className="text-foreground/70">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-muted uppercase tracking-wider font-semibold text-[10px]">
          Nodes
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {NODE_LEGEND_ITEMS.map(({ label, className }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className={`rounded border px-1.5 py-0.5 text-[10px] ${className}`}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
