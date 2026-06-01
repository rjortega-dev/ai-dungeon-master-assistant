import { prisma } from "@/lib/prisma/prisma";


// NOTE: no includes added yet
export async function getStoryBeat(id:string) {
    return prisma.storyBeat.findUnique({
        where: { id, }
    });
}