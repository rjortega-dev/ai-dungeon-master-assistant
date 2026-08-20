import { prisma } from "@/lib/prisma/prisma";

type UncompleteResult =
  | { success: true; id: string; activeBeatId: string }
  | {
      success: false;
      error: "NOT_FOUND" | "NOT_COMPLETED" | "DOWNSTREAM_COMPLETED";
    };

export async function uncompleteBeat(
  beatId: string,
): Promise<UncompleteResult> {
  const beat = await prisma.storyBeat.findUnique({
    where: { id: beatId },
    select: {
      id: true,
      completedAt: true,
      campaignId: true,
      outgoingTransitions: {
        where: { isBranch: false, takenAt: { not: null } },
        select: {
          id: true,
          toBeatId: true,
          toBeat: { select: { completedAt: true } },
        },
      },
    },
  });

  if (!beat) return { success: false, error: "NOT_FOUND" };
  if (beat.completedAt === null) {
    return { success: false, error: "NOT_COMPLETED" };
  }

  const takenExclusive = beat.outgoingTransitions[0] ?? null;

  if (takenExclusive && takenExclusive.toBeat.completedAt !== null) {
    return { success: false, error: "DOWNSTREAM_COMPLETED" };
  }

  const activeCampaign = await prisma.activeCampaign.findUnique({
    where: { campaignID: beat.campaignId },
    select: { id: true },
  });

  await prisma.$transaction([
    prisma.storyBeat.update({
      where: { id: beatId },
      data: { completedAt: null },
    }),
    ...(takenExclusive
      ? [
          prisma.beatTransition.update({
            where: { id: takenExclusive.id },
            data: { takenAt: null },
          }),
        ]
      : []),
    ...(activeCampaign
      ? [
          prisma.activeCampaign.update({
            where: { id: activeCampaign.id },
            data: { activeBeatId: beatId },
          }),
        ]
      : []),
  ]);

  return { success: true, id: beatId, activeBeatId: beatId };
}
