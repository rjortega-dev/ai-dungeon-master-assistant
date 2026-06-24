import { prisma } from "@/lib/prisma/prisma";

type ToggleResult =
  | { success: true; id: string; completedAt: string | null }
  | { success: false; error: "NOT_FOUND" };

export async function toggleBeatComplete(
  beatId: string,
): Promise<ToggleResult> {
  const beat = await prisma.storyBeat.findUnique({
    where: { id: beatId },
    select: { id: true, completedAt: true },
  });

  if (!beat) return { success: false, error: "NOT_FOUND" };

  const updatedBeat = await prisma.storyBeat.update({
    where: { id: beatId },
    data: {
      completedAt: beat.completedAt === null ? new Date() : null,
    },
    select: { id: true, completedAt: true },
  });

  return {
    success: true,
    id: updatedBeat.id,
    completedAt: updatedBeat.completedAt?.toISOString() ?? null,
  };
}
