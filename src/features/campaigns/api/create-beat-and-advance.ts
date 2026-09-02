import { prisma } from "@/lib/prisma/prisma";
import { BeatType, TransitionType } from "@/../generated/prisma";
import { randomUUID } from "crypto";

type CreateBeatInput = {
  title: string;
  description?: string;
  isMainContinuation: boolean;
};

type CreateBeatResult =
  | {
      success: true;
      newBeatId: string;
      transitionId: string;
      activeBeatId: string;
    }
  | {
      success: false;
      error: "NOT_FOUND" | "ALREADY_COMPLETED" | "TITLE_REQUIRED";
    };

export async function createBeatAndAdvance(
  sourceBeatId: string,
  input: CreateBeatInput,
): Promise<CreateBeatResult> {
  const trimmedTitle = input.title.trim();
  if (!trimmedTitle) {
    return { success: false, error: "TITLE_REQUIRED" };
  }

  const sourceBeat = await prisma.storyBeat.findUnique({
    where: { id: sourceBeatId },
    select: { id: true, completedAt: true, campaignId: true },
  });

  if (!sourceBeat) return { success: false, error: "NOT_FOUND" };
  if (sourceBeat.completedAt !== null) {
    return { success: false, error: "ALREADY_COMPLETED" };
  }

  const activeCampaign = await prisma.activeCampaign.findUnique({
    where: { campaignID: sourceBeat.campaignId },
    select: { id: true },
  });

  if (!activeCampaign) return { success: false, error: "NOT_FOUND" };

  const now = new Date();
  const newBeatId = randomUUID();
  const transitionId = randomUUID();

  await prisma.$transaction([
    prisma.storyBeat.create({
      data: {
        id: newBeatId,
        campaignId: sourceBeat.campaignId,
        title: trimmedTitle,
        description: input.description?.trim() || null,
        beatType: input.isMainContinuation
          ? BeatType.MAIN_QUEST
          : BeatType.SIDE_QUEST,
      },
    }),
    prisma.beatTransition.create({
      data: {
        id: transitionId,
        campaignId: activeCampaign.id,
        fromBeatId: sourceBeatId,
        toBeatId: newBeatId,
        transitionType: input.isMainContinuation
          ? TransitionType.SUCCESS
          : TransitionType.OPTIONAL,
        isBranch: !input.isMainContinuation,
        takenAt: now,
      },
    }),
    ...(input.isMainContinuation
      ? [
          prisma.storyBeat.update({
            where: { id: sourceBeatId },
            data: { completedAt: now },
          }),
        ]
      : []),
    prisma.activeCampaign.update({
      where: { id: activeCampaign.id },
      data: { activeBeatId: newBeatId },
    }),
  ]);

  return {
    success: true,
    newBeatId,
    transitionId,
    activeBeatId: newBeatId,
  };
}
