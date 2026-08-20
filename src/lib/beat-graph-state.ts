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

export type ForeclosureClassification = {
  foreclosedIds: Set<string>;
  hardForeclosedIds: Set<string>;
};

export function computeForeclosureClassification<T extends BeatLike>(
  allBeats: T[],
): ForeclosureClassification {
  const beatById = new Map(allBeats.map((b) => [b.id, b]));
  const classification = new Map<string, "hard" | "soft">();

  function visit(beatId: string, kind: "hard" | "soft") {
    const current = classification.get(beatId);
    if (current === "hard") return; // already worst case, nothing left to do

    const isNewOrUpgraded =
      current === undefined || (current === "soft" && kind === "hard");
    classification.set(beatId, kind === "hard" ? "hard" : (current ?? "soft"));

    if (!isNewOrUpgraded) return;

    const target = beatById.get(beatId);
    if (!target) return;

    for (const next of target.outgoingTransitions) {
      visit(next.toBeatId, kind);
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
      const kind: "hard" | "soft" = sibling.isBranch ? "soft" : "hard";
      visit(sibling.toBeatId, kind);
    }
  }

  const foreclosedIds = new Set<string>();
  const hardForeclosedIds = new Set<string>();

  for (const [id, kind] of classification) {
    const beat = beatById.get(id);
    if (beat?.completedAt !== null) continue;

    foreclosedIds.add(id);
    if (kind === "hard") hardForeclosedIds.add(id);
  }

  return { foreclosedIds, hardForeclosedIds };
}

export function computeForeclosedSet<T extends BeatLike>(
  allBeats: T[],
): Set<string> {
  return computeForeclosureClassification(allBeats).foreclosedIds;
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
