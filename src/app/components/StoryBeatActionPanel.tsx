import type { BeatForGraph } from "@/app/types/graph";

type StoryBeatActionPanelProps = {
  beat: BeatForGraph;
  onToggleComplete: (beatId: string) => void;
  onClose: () => void;
  isUpdating: boolean;
};

export function StoryBeatActionPanel({
  beat,
  onToggleComplete,
  onClose,
  isUpdating,
}: StoryBeatActionPanelProps) {
  const isComplete = beat.completedAt !== null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-accent/30 bg-card px-4 py-3">
      <div>
        <p className="font-semibold text-foreground text-sm">{beat.title}</p>
        <p className="text-xs text-muted">{beat.beatType}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleComplete(beat.id)}
          disabled={isUpdating}
          className="rounded-md border border-accent/40 px-3 py-1.5 text-sm text-accent-text hover:bg-accent/10 transition-colors disabled:opacity-50"
        >
          {isUpdating
            ? "Updating..."
            : isComplete
              ? "Mark Incomplete"
              : "Mark Complete"}
        </button>

        <button
          onClick={onClose}
          className="rounded-md px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}