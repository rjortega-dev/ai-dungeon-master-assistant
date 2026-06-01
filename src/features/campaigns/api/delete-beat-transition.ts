import { prisma } from "@/lib/prisma/prisma";

export async function deleteBeatTransition(id:string) {
    return prisma.beatTransition.delete({
        where: { id }
    });
}