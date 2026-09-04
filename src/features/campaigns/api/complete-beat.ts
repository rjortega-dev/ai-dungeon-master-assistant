import { prisma } from "@/lib/prisma/prisma";

type CompleteResult =
  | {
      success: true;
      id: string;
      completedAt: string | null;
      activeBeatId: string | null;
    }
  | {
      success: false;
      error:
        | "NOT_FOUND"
        | "ALREADY_COMPLETED"
        | "TRANSITION_REQUIRED"
        | "INVALID_TRANSITION";
    };

export async function completeBeat(
  beatId: string,
  transitionId?: string,
): Promise<CompleteResult> {
  const beat = await prisma.storyBeat.findUnique({
    where: { id: beatId },
    select: {
      id: true,
      completedAt: true,
      campaignId: true,
      outgoingTransitions: {
        select: { id: true, toBeatId: true, isBranch: true },
      },
    },
  });

  if (!beat) return { success: false, error: "NOT_FOUND" };
  if (beat.completedAt !== null) {
    return { success: false, error: "ALREADY_COMPLETED" };
  }

  let nextActiveBeatId: string | null = null;
  let completesSource = true;

  if (beat.outgoingTransitions.length > 0) {
    if (!transitionId) {
      return { success: false, error: "TRANSITION_REQUIRED" };
    }

    const chosenTransition = beat.outgoingTransitions.find(
      (t) => t.id === transitionId,
    );

    if (!chosenTransition) {
      return { success: false, error: "INVALID_TRANSITION" };
    }

    nextActiveBeatId = chosenTransition.toBeatId;
    completesSource = !chosenTransition.isBranch;
  }

  const activeCampaign = await prisma.activeCampaign.findUnique({
    where: { campaignID: beat.campaignId },
    select: { id: true },
  });

  const now = new Date();

  await prisma.$transaction([
    ...(completesSource
      ? [
          prisma.storyBeat.update({
            where: { id: beatId },
            data: { completedAt: now },
          }),
        ]
      : []),
    ...(transitionId
      ? [
          prisma.beatTransition.update({
            where: { id: transitionId },
            data: { takenAt: now },
          }),
        ]
      : []),
    ...(activeCampaign
      ? [
          prisma.activeCampaign.update({
            where: { id: activeCampaign.id },
            data: { activeBeatId: nextActiveBeatId },
          }),
        ]
      : []),
  ]);

  return {
    success: true,
    id: beatId,
    completedAt: completesSource ? now.toISOString() : null,
    activeBeatId: nextActiveBeatId,
  };
}
