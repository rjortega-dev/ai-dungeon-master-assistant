import { prisma } from "@/lib/prisma/prisma";
import { BeatForGraph } from "@/app/types/graph";
import {
  computeBeatState,
  computeForeclosedSet,
  type BeatLike,
} from "@/lib/beat-graph-state";

export async function getCampaignBeats(
  campaignId: string,
): Promise<BeatForGraph[] | null> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { id: true },
  });

  if (!campaign) return null;

  const [beats, activeCampaign] = await Promise.all([
    prisma.storyBeat.findMany({
      where: { campaignId },
      orderBy: { sequenceOrder: "asc" },
      include: {
        outgoingTransitions: true,
        incomingTransitions: true,
      },
    }),
    prisma.activeCampaign.findUnique({
      where: { campaignID: campaignId },
      select: { activeBeatId: true },
    }),
  ]);

  const activeBeatId = activeCampaign?.activeBeatId ?? null;

  // Serialize once, up front — the shared state functions work on
  // string dates so the exact same logic runs client-side too.
  const serialized: BeatLike[] = beats.map((beat) => ({
    id: beat.id,
    completedAt: beat.completedAt?.toISOString() ?? null,
    outgoingTransitions: beat.outgoingTransitions.map((t) => ({
      id: t.id,
      fromBeatId: t.fromBeatId,
      toBeatId: t.toBeatId,
      isBranch: t.isBranch,
      takenAt: t.takenAt?.toISOString() ?? null,
    })),
    incomingTransitions: beat.incomingTransitions.map((t) => ({
      id: t.id,
      fromBeatId: t.fromBeatId,
      toBeatId: t.toBeatId,
      isBranch: t.isBranch,
      takenAt: t.takenAt?.toISOString() ?? null,
    })),
  }));

  const foreclosedIds = computeForeclosedSet(serialized);

  return beats.map((beat, i) => ({
    id: beat.id,
    title: beat.title,
    description: beat.description,
    beatType: beat.beatType,
    sequenceOrder: beat.sequenceOrder,
    completedAt: serialized[i].completedAt,
    state: computeBeatState(
      serialized[i],
      serialized,
      activeBeatId,
      foreclosedIds,
    ),
    outgoingTransitions: beat.outgoingTransitions.map((t) => ({
      id: t.id,
      fromBeatId: t.fromBeatId,
      toBeatId: t.toBeatId,
      transitionType: t.transitionType,
      conditionDescription: t.conditionDescription,
      isHidden: t.isHidden,
      isBranch: t.isBranch,
      takenAt: t.takenAt?.toISOString() ?? null,
    })),
    incomingTransitions: beat.incomingTransitions.map((t) => ({
      id: t.id,
      fromBeatId: t.fromBeatId,
      toBeatId: t.toBeatId,
      transitionType: t.transitionType,
      conditionDescription: t.conditionDescription,
      isHidden: t.isHidden,
      isBranch: t.isBranch,
      takenAt: t.takenAt?.toISOString() ?? null,
    })),
  }));
}
