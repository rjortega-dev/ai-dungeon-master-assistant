import { prisma } from "@/lib/prisma/prisma";

export async function deleteCharacter(id:string) {
    return prisma.character.delete({
        where: { id }
    });
}