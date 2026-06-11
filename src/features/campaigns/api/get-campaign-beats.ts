import { prisma } from "@/lib/prisma/prisma";
import { Prisma } from "@/../generated/prisma";
import { BeatForGraph, BeatState } from "@/app/types/graph";

type BeatWithTransitions = Prisma.StoryBeatGetPayload<{
  include: {
    outgoingTransitions: true;
    incomingTransitions: true;
  };
}>;

function computeState(
  beat: BeatWithTransitions,
  allBeats: BeatWithTransitions[],
): BeatState {
  if (beat.completedAt !== null) return "completed";

  if (beat.incomingTransitions.length === 0) return "current";

  const anyIncomingCompleted = beat.incomingTransitions.some((transition) => {
    const fromBeat = allBeats.find((b) => b.id === transition.fromBeatId);
    return fromBeat?.completedAt !== null;
  });

  return anyIncomingCompleted ? "current" : "default";
}

export async function getCampaignBeats(
  campaignId: string,
): Promise<BeatForGraph[] | null> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { id: true },
  });

  if (!campaign) return null;

  const beats = await prisma.storyBeat.findMany({
    where: { campaignId },
    orderBy: { sequenceOrder: "asc" },
    include: {
      outgoingTransitions: true,
      incomingTransitions: true,
    },
  });

  return beats.map((beat) => ({
    id: beat.id,
    title: beat.title,
    description: beat.description,
    beatType: beat.beatType,
    sequenceOrder: beat.sequenceOrder,
    completedAt: beat.completedAt?.toISOString() ?? null,
    state: computeState(beat, beats),
    outgoingTransitions: beat.outgoingTransitions.map((t) => ({
      id: t.id,
      fromBeatId: t.fromBeatId,
      toBeatId: t.toBeatId,
      transitionType: t.transitionType,
      isHidden: t.isHidden,
    })),
    incomingTransitions: beat.incomingTransitions.map((t) => ({
      id: t.id,
      fromBeatId: t.fromBeatId,
      toBeatId: t.toBeatId,
      transitionType: t.transitionType,
      isHidden: t.isHidden,
    })),
  }));
}
