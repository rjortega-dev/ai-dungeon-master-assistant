import { prisma } from "@/lib/prisma/prisma";
import { computeForeclosureClassification } from "@/lib/beat-graph-state";

type SetActiveBeatResult =
  | { success: true; id: string; activeBeatId: string }
  | {
      success: false;
      error:
        | "NOT_FOUND"
        | "ALREADY_COMPLETED"
        | "HARD_FORECLOSED"
        | "CAMPAIGN_MISMATCH";
    };

export async function setActiveBeat(
  beatId: string,
  campaignId: string,
): Promise<SetActiveBeatResult> {
  const beat = await prisma.storyBeat.findUnique({
    where: { id: beatId },
    select: { id: true, completedAt: true, campaignId: true },
  });

  if (!beat) return { success: false, error: "NOT_FOUND" };
  if (beat.campaignId !== campaignId) {
    return { success: false, error: "CAMPAIGN_MISMATCH" };
  }
  if (beat.completedAt !== null) {
    return { success: false, error: "ALREADY_COMPLETED" };
  }

  const allBeats = await prisma.storyBeat.findMany({
    where: { campaignId: beat.campaignId },
    include: { outgoingTransitions: true, incomingTransitions: true },
  });

  const serialized = allBeats.map((b) => ({
    id: b.id,
    completedAt: b.completedAt?.toISOString() ?? null,
    outgoingTransitions: b.outgoingTransitions.map((t) => ({
      id: t.id,
      fromBeatId: t.fromBeatId,
      toBeatId: t.toBeatId,
      isBranch: t.isBranch,
      takenAt: t.takenAt?.toISOString() ?? null,
    })),
    incomingTransitions: b.incomingTransitions.map((t) => ({
      id: t.id,
      fromBeatId: t.fromBeatId,
      toBeatId: t.toBeatId,
      isBranch: t.isBranch,
      takenAt: t.takenAt?.toISOString() ?? null,
    })),
  }));

  const { hardForeclosedIds } = computeForeclosureClassification(serialized);

  if (hardForeclosedIds.has(beatId)) {
    return { success: false, error: "HARD_FORECLOSED" };
  }

  const activeCampaign = await prisma.activeCampaign.findUnique({
    where: { campaignID: beat.campaignId },
    select: { id: true },
  });

  if (!activeCampaign) return { success: false, error: "NOT_FOUND" };

  await prisma.activeCampaign.update({
    where: { id: activeCampaign.id },
    data: { activeBeatId: beatId },
  });

  return { success: true, id: beatId, activeBeatId: beatId };
}
