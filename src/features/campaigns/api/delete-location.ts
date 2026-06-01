import { prisma } from "@/lib/prisma/prisma";

export async function deleteLocation(id:string) {
    return prisma.location.delete({
        where: { id, }
    });
}