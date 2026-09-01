import type { BeatForGraph } from "@/app/types/graph";

type StoryBeatActionPanelProps = {
  beat: BeatForGraph;
  allBeats: BeatForGraph[];
  onComplete: (beatId: string, transitionId?: string) => void;
  onUncomplete: (beatId: string) => void;
  onSetActive: (beatId: string) => void;
  onClose: () => void;
  isUpdating: boolean;
  actionError: string | null;
};

const ERROR_MESSAGES: Record<string, string> = {
  DOWNSTREAM_COMPLETED:
    "Can't undo this — a later beat has already been completed. Undo that first.",
  HARD_FORECLOSED:
    "This path was permanently closed by an earlier choice and can't be revisited.",
  TRANSITION_REQUIRED: "Pick which path was taken to complete this beat.",
  INVALID_TRANSITION: "That transition doesn't belong to this beat.",
  ALREADY_COMPLETED: "This beat is already completed.",
  NOT_COMPLETED: "This beat isn't completed yet.",
  CAMPAIGN_MISMATCH: "That beat doesn't belong to this campaign.",
  NOT_FOUND: "Couldn't find that beat.",
};

export function StoryBeatActionPanel({
  beat,
  allBeats,
  onComplete,
  onUncomplete,
  onSetActive,
  onClose,
  isUpdating,
  actionError,
}: StoryBeatActionPanelProps) {
  const beatById = new Map(allBeats.map((b) => [b.id, b]));

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-accent/30 bg-card px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-foreground text-sm">{beat.title}</p>
          <p className="text-xs text-muted">
            {beat.beatType} · {beat.state}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          Close
        </button>
      </div>

      {actionError && (
        <p className="text-xs text-red-400">
          {ERROR_MESSAGES[actionError] ?? actionError}
        </p>
      )}

      {beat.state === "completed" && (
        <button
          onClick={() => onUncomplete(beat.id)}
          disabled={isUpdating}
          className="self-start rounded-md border border-accent/40 px-3 py-1.5 text-sm text-accent-text hover:bg-accent/10 transition-colors disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Mark Incomplete"}
        </button>
      )}

      {beat.state === "active" && beat.outgoingTransitions.length === 0 && (
        <button
          onClick={() => onComplete(beat.id)}
          disabled={isUpdating}
          className="self-start rounded-md border border-accent/40 px-3 py-1.5 text-sm text-accent-text hover:bg-accent/10 transition-colors disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Mark Complete"}
        </button>
      )}

      {beat.state === "active" && beat.outgoingTransitions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-muted uppercase tracking-wider font-semibold">
            Complete via
          </p>
          {beat.outgoingTransitions.map((t) => {
            const toBeat = beatById.get(t.toBeatId);
            return (
              <button
                key={t.id}
                onClick={() => onComplete(beat.id, t.id)}
                disabled={isUpdating}
                className="text-left rounded-md border border-accent/40 px-3 py-1.5 text-sm text-accent-text hover:bg-accent/10 transition-colors disabled:opacity-50"
              >
                {t.isHidden ? "??? " : `${t.transitionType} `}
                {toBeat ? `→ ${toBeat.title}` : ""}
              </button>
            );
          })}
        </div>
      )}

      {(beat.state === "available" || beat.state === "foreclosed") && (
        <button
          onClick={() => onSetActive(beat.id)}
          disabled={isUpdating}
          className="self-start rounded-md border border-accent/40 px-3 py-1.5 text-sm text-accent-text hover:bg-accent/10 transition-colors disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Set as Active Beat"}
        </button>
      )}

      {beat.state === "default" &&
        (() => {
          const activeBeat = allBeats.find((b) => b.state === "active");
          const incomingFromActive = activeBeat?.outgoingTransitions.find(
            (t) => t.toBeatId === beat.id,
          );

          if (!activeBeat || !incomingFromActive) {
            return <p className="text-xs text-muted">Not yet reachable.</p>;
          }

          return (
            <button
              onClick={() => onComplete(activeBeat.id, incomingFromActive.id)}
              disabled={isUpdating}
              className="self-start rounded-md border border-accent/40 px-3 py-1.5 text-sm text-accent-text hover:bg-accent/10 transition-colors disabled:opacity-50"
            >
              {isUpdating
                ? "Updating..."
                : `Take this path from "${activeBeat.title}"`}
            </button>
          );
        })()}
    </div>
  );
}
