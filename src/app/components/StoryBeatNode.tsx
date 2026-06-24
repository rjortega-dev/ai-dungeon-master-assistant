import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { BeatState } from "@/app/types/graph";

export type StoryBeatNodeData = {
  title: string;
  beatType: string;
  state: BeatState;
  hasError: boolean;
  isSelected: boolean;
};

const stateStyles: Record<BeatState, string> = {
  completed: "border-green-500/60 bg-green-500/10 text-green-400",
  current: "border-accent bg-card text-foreground shadow-[0_0_12px_rgba(0,0,0,0.1)]",
  default: "border-foreground/15 bg-card/50 text-muted",
};

export function StoryBeatNode({
  data,
}: NodeProps & { data: StoryBeatNodeData }) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 min-w-45 text-sm transition-colors cursor-pointer hover:opacity-90 ${stateStyles[data.state]} ${data.hasError ? "ring-2 ring-red-500" : ""} ${data.isSelected ? "ring-2 ring-white/40" : ""}`}
    >
      <Handle type="target" position={Position.Top} />
      <p className="font-semibold leading-tight">{data.title}</p>
      <p className="text-xs uppercase tracking-wide opacity-60 mt-1">
        {data.beatType}
      </p>
      {data.hasError && (
        <p className="text-xs text-red-400 mt-1">Failed to update — try again</p>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}