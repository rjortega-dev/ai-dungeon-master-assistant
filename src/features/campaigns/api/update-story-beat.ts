import { prisma } from "@/lib/prisma/prisma";
import { BeatType } from "../../../../generated/prisma";

// NOTE: export local type for update 
// NOTE: may change updatable fields
export type UpdateStoryBeatInput = {
    title?: string,
    description?: string
    beatType?: BeatType,
    sequenceOrder?: number
};

export async function updateStoryBeat(
    id:string, 
    data: UpdateStoryBeatInput
) {
    return prisma.storyBeat.update({
        where: {
            id,
        },
        data,
    });
}
