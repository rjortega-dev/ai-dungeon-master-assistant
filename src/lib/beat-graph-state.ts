import type { BeatState } from "@/app/types/graph";

export type TransitionLike = {
  id: string;
  fromBeatId: string;
  toBeatId: string;
  isBranch: boolean;
  takenAt: string | null;
};

export type BeatLike = {
  id: string;
  completedAt: string | null;
  incomingTransitions: TransitionLike[];
  outgoingTransitions: TransitionLike[];
};

export function computeForeclosedSet<T extends BeatLike>(
  allBeats: T[],
): Set<string> {
  const foreclosed = new Set<string>();
  const visited = new Set<string>();
  const beatById = new Map(allBeats.map((b) => [b.id, b]));

  function cascade(beatId: string) {
    if (visited.has(beatId)) return;
    visited.add(beatId);

    const target = beatById.get(beatId);
    if (!target) return;

    if (target.completedAt === null) {
      foreclosed.add(beatId);
    }

    for (const next of target.outgoingTransitions) {
      cascade(next.toBeatId);
    }
  }

  for (const beat of allBeats) {
    if (beat.completedAt === null) continue;

    const takenExclusive = beat.outgoingTransitions.find(
      (t) => !t.isBranch && t.takenAt !== null,
    );
    if (!takenExclusive) continue;

    for (const sibling of beat.outgoingTransitions) {
      if (sibling.id === takenExclusive.id) continue;
      cascade(sibling.toBeatId);
    }
  }

  return foreclosed;
}

export function computeBeatState<T extends BeatLike>(
  beat: T,
  allBeats: T[],
  activeBeatId: string | null,
  foreclosedIds: Set<string>,
): BeatState {
  if (beat.completedAt !== null) return "completed";
  if (beat.id === activeBeatId) return "active";
  if (foreclosedIds.has(beat.id)) return "foreclosed";

  if (beat.incomingTransitions.length === 0) return "available";

  const anyIncomingCompleted = beat.incomingTransitions.some((transition) => {
    const fromBeat = allBeats.find((b) => b.id === transition.fromBeatId);
    return fromBeat?.completedAt !== null;
  });

  return anyIncomingCompleted ? "available" : "default";
}
