import { prisma } from "@/lib/prisma/prisma";

export async function getLocation(id:string) {
    return prisma.location.findUnique({
        where: { id },
    });
}