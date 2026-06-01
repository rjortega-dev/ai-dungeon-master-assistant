import { prisma } from "@/lib/prisma/prisma";

export async function deleteStoryBeat(id:string) {
    return prisma.storyBeat.delete({
        where: { id, }
    });
}